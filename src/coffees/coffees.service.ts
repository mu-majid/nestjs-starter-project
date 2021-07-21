import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavour)
    private readonly flavorRepository: Repository<Flavour>,
    private readonly connection: Connection
  ) {

  }


  public findAll (paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.coffeeRepository.find({ relations: ['flavors'], take: limit, skip: offset });
  }

  public async findOne (id: string) {
    const coffee = await this.coffeeRepository.findOne(id, { relations: ['flavors'] });
    if (!coffee) {
      throw new NotFoundException(`Could not find coffee with id: ${id}`);
    }

    return coffee;
  }

  public async createCoffee (body: CreateCoffeeDto) {
    const flavors = await Promise.all(
      body.flavors.map(flavorrName => this.preLoadFlavourByName(flavorrName))
    )
    const coffee = this.coffeeRepository.create({ ...body, flavors });
    return this.coffeeRepository.save(coffee);
  }

  public async updateCoffee (id: string, body: UpdateCoffeeDto) {
    const flavors = body.flavors && (await Promise.all(
      body.flavors.map(flavorrName => this.preLoadFlavourByName(flavorrName))
    ))
    const coffee = await this.coffeeRepository.preload({
      id: +id + '',
      ...body,
      flavors
    });
    if (!coffee) {
      throw new NotFoundException(`Could not find coffee with id: ${id}`);
    }

    return this.coffeeRepository.save(coffee);

  }

  public async deleteCoffee (id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  public async preLoadFlavourByName (name: string): Promise<Flavour> { 
    const flavor = await this.flavorRepository.findOne({ name });
    if (flavor) {
      return flavor;
    }

    return this.flavorRepository.create({ name });
  }

  public async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const newEvent = new Event();
      newEvent.name = 'recommend_coffee';
      newEvent.type = 'coffee';
      newEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(newEvent);

      await queryRunner.commitTransaction();
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
    }
    finally {
      await queryRunner.release();
    }
  }
}

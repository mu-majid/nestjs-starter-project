import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {

  }


  public findAll () {
    return this.coffeeRepository.find();
  }

  public async findOne (id: string) {
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Could not find coffee with id: ${id}`);
    }

    return coffee;
  }

  public createCoffee (body: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(body);
    return this.coffeeRepository.save(coffee);
  }

  public async updateCoffee (id: string, body: UpdateCoffeeDto) {
    
    const coffee = await this.coffeeRepository.preload({
      id: +id + '',
      ...body
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
}

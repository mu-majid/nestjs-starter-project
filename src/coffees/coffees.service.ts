import { Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {


  public findAll () {
    return 'This returns all coffess';
  }

  public findOne (id: string) {

    return `return coffee with id ${id}`;
  }

  public createCoffee (body: CreateCoffeeDto) {

    return body;
  }

  public updateCoffee (id: string, body: UpdateCoffeeDto) {

    return 'Update coffee with ID ' + id;

  }

  public deleteCoffee (id: string) {

    return 'Delete coffee with ID ' + id;
  }
}

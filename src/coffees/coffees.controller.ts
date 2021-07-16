import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

  constructor(private readonly coffeeService: CoffeesService) {}

  @Get('flavors')
  public findAll (@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return this.coffeeService.findAll();
  }

  @Get(':id')
  public findOne (@Param('id') id: string) {

    return this.coffeeService.findOne(id);
  }

  @Post()
  // @HttpCode(HttpStatus.GONE) // useful for static status codes on specifc endpoints
  public createCoffee (@Body() body: CreateCoffeeDto) {

    return this.coffeeService.createCoffee(body);
  }

  @Patch(':id')
  public updateCoffee (@Param('id') id: string,@Body() body: UpdateCoffeeDto) {

    return this.coffeeService.updateCoffee(id, body);
  }

  @Delete('id')
  public deleteCoffee (@Param('id') id: string) {

    return this.coffeeService.deleteCoffee(id);
  }

}

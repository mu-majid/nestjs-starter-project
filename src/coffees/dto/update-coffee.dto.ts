import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

// Inherit all Validation rules
// mark all properties as optional
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}








// Could do this but this is redundant

// export class UpdateCoffeeDto {
//   readonly name?: string;
//   readonly brand?: string;
//   readonly flavors?: string[];
// }
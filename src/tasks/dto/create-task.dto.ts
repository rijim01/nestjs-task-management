/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateTaskDTO {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
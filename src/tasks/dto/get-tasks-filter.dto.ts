/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";
import { Transform } from "class-transformer";

export class GetTasksFilterDTO {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      "status must be one of the following values: OPEN, IN_PROGRESS, DONE",
  })
  @Transform(({ value }) => value?.trim().toUpperCase())
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}

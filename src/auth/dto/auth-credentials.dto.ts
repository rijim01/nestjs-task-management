/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthCredentialsDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(5, { message: 'Username must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  username: string;


  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one number, and one special character.',
    },
  )
  password: string;
}

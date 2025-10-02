import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}

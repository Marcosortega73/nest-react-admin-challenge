import { IsNotEmpty } from 'class-validator';

import { Role } from '../enums/role.enum';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
}

export class LoginResponseDto {
  token: string;
  user: UserResponseDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
  }
  @ApiProperty({
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    description: 'User name',
  })
  name: string;
}

export class UserResponseDto {
  constructor(user: User) {
    this.user = new UserDto(user);
  }

  @ApiProperty({
    description: 'User details',
  })
  user: UserDto;
}

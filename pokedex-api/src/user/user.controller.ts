import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Create a new user',
  })
  @ApiOkResponse({
    description: 'Created user details',
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return new UserResponseDto(user);
  }
}

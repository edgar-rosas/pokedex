import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUser, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { queryFailedGuard } from '../common/errors/guards';
import { SQLITE_UNIQUE_CONSTRAINT_ERROR_CODE } from '../common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(params: CreateUserDto) {
    try {
      const user = await this.userRepository.save(createUser(params.name));
      return user;
    } catch (error) {
      if (
        queryFailedGuard(error) &&
        error.code === SQLITE_UNIQUE_CONSTRAINT_ERROR_CODE
      ) {
        throw new ConflictException();
      }

      throw error;
    }
  }
}

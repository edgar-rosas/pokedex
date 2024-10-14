import { CreateUserDto } from '../dto/create-user-dto';

export function createUserTestData(): CreateUserDto[] {
  return [1, 2, 3, 4].map((id) => ({
    name: `test-user-${id}`,
  }));
}

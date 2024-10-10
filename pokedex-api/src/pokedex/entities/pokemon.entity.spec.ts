import { Pokemon } from './pokemon.entity';

describe('Pokemon', () => {
  it('should be defined', () => {
    expect(new Pokemon()).toBeDefined();
  });
});

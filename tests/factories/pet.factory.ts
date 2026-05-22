import type { Pet, PetStatus } from '../schemas/pet.schema';

// Uses timestamp-based IDs to ensure uniqueness across parallel test runs
let counter = 0;

function uniqueId(): number {
  // Stay within int32 range while remaining unique per process run
  return (Date.now() % 100_000_000) * 100 + (counter++ % 100);
}

export class PetFactory {
  static build(overrides: Partial<Pet> = {}): Pet {
    const id = uniqueId();
    return {
      id,
      name: `TestPet-${id}`,
      category: { id: 1, name: 'Dogs' },
      photoUrls: ['https://example.com/photos/test.jpg'],
      tags: [{ id: 1, name: 'test' }],
      status: 'available',
      ...overrides,
    };
  }

  static buildWithStatus(status: PetStatus, overrides: Partial<Pet> = {}): Pet {
    return PetFactory.build({ status, ...overrides });
  }

  static buildMinimal(): Pet {
    return {
      name: `MinimalPet-${uniqueId()}`,
      photoUrls: ['https://example.com/photo.jpg'],
    };
  }

  static buildList(count: number, overrides: Partial<Pet> = {}): Pet[] {
    return Array.from({ length: count }, () => PetFactory.build(overrides));
  }
}

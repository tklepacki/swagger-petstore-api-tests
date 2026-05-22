import { test as base } from '@playwright/test';
import { PetClient } from '../helpers/pet-client';
import { PetFactory } from '../factories/pet.factory';
import type { Pet } from '../schemas/pet.schema';

type ApiFixtures = {
  petClient: PetClient;
  /**
   * Creates a pet via the API and automatically deletes it after the test.
   * Use this in tests to ensure full isolation without manual cleanup.
   */
  withPet: (overrides?: Partial<Pet>) => Promise<Pet>;
};

export const test = base.extend<ApiFixtures>({
  petClient: async ({ request }, use) => {
    await use(new PetClient(request));
  },

  withPet: async ({ petClient }, use) => {
    const created: Pet[] = [];

    const factory = async (overrides?: Partial<Pet>): Promise<Pet> => {
      const pet = await petClient.create(PetFactory.build(overrides));
      created.push(pet);
      return pet;
    };

    await use(factory);

    for (const pet of created) {
      if (pet.id != null) {
        await petClient.deleteRaw(pet.id).catch(() => {
          // Best-effort cleanup — ignore 404 if already deleted by the test
        });
      }
    }
  },
});

export { expect } from '@playwright/test';

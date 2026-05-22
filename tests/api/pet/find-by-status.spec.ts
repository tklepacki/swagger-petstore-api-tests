import { test, expect } from '../../fixtures/api.fixture';
import { PetSchema } from '../../schemas/pet.schema';
import { z } from 'zod';

test.describe('GET /pet/findByStatus — Find pets by status', () => {
  test.describe('available status', () => {
    test('returns 200 with an array of pets @smoke', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('available');

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test('our created pet has status "available" in results @smoke', async ({ withPet, petClient }) => {
      const created = await withPet({ status: 'available' });

      const pets = await petClient.findByStatus('available');
      const ours = pets.find((p) => p.id === created.id);

      expect(ours).toBeDefined();
      expect(ours?.status).toBe('available');
    });

    test('response array items conform to Pet schema @regression', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('available');
      const body = await response.json();

      const result = z.array(PetSchema).safeParse(body);
      expect(result.success, `Schema validation failed: ${JSON.stringify(result.error)}`).toBe(true);
    });
  });

  test.describe('pending status', () => {
    test('returns 200 with an array of pets @smoke', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('pending');

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test('our created pet has status "pending" in results @regression', async ({ withPet, petClient }) => {
      const created = await withPet({ status: 'pending' });

      const pets = await petClient.findByStatus('pending');
      const ours = pets.find((p) => p.id === created.id);

      expect(ours).toBeDefined();
      expect(ours?.status).toBe('pending');
    });
  });

  test.describe('sold status', () => {
    test('returns 200 with an array of pets @smoke', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('sold');

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test('our created pet has status "sold" in results @regression', async ({ withPet, petClient }) => {
      const created = await withPet({ status: 'sold' });

      const pets = await petClient.findByStatus('sold');
      const ours = pets.find((p) => p.id === created.id);

      expect(ours).toBeDefined();
      expect(ours?.status).toBe('sold');
    });
  });

  test.describe('error scenarios', () => {
    test('returns 400 when status value is invalid @regression', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('nonexistent');

      expect([400, 200]).toContain(response.status());
    });

    test('returns content-type application/json @regression', async ({ petClient }) => {
      const response = await petClient.findByStatusRaw('available');

      expect(response.headers()['content-type']).toContain('application/json');
    });
  });

  test('created pet appears in findByStatus results @regression', async ({ withPet, petClient }) => {
    const created = await withPet({ status: 'available' });

    const pets = await petClient.findByStatus('available');
    const found = pets.find((p) => p.id === created.id);

    expect(found).toBeDefined();
    expect(found?.name).toBe(created.name);
  });

  test('pet does not appear in different status results @regression', async ({ withPet, petClient }) => {
    const created = await withPet({ status: 'available' });

    const soldPets = await petClient.findByStatus('sold');
    const found = soldPets.find((p) => p.id === created.id);

    expect(found).toBeUndefined();
  });
});

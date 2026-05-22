import { test, expect } from '../../fixtures/api.fixture';
import { PetSchema } from '../../schemas/pet.schema';

test.describe('GET /pet/{petId} — Get pet by ID', () => {
  test('returns 200 and correct pet when ID exists @smoke', async ({ withPet, petClient }) => {
    const created = await withPet({ name: 'FindMe', status: 'available' });

    const response = await petClient.getByIdRaw(created.id!);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(created.id);
    expect(body.name).toBe('FindMe');
  });

  test('response body conforms to Pet schema @smoke', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.getByIdRaw(created.id!);
    const body = await response.json();

    const result = PetSchema.safeParse(body);
    expect(result.success, `Schema validation failed: ${JSON.stringify(result.error)}`).toBe(true);
  });

  test('returns 404 for non-existent pet ID @smoke', async ({ petClient }) => {
    const nonExistentId = 999_999_987;

    const response = await petClient.getByIdRaw(nonExistentId);

    expect(response.status()).toBe(404);
  });

  test('returns 400 when petId is not a valid integer @regression', async ({ petClient }) => {
    const response = await petClient.getByIdRaw('not-a-number');

    expect([400, 404]).toContain(response.status());
  });

  test('returns all fields including category and tags @regression', async ({ withPet, petClient }) => {
    const created = await withPet({
      category: { id: 3, name: 'Birds' },
      tags: [{ id: 7, name: 'small' }],
      status: 'sold',
    });

    const body = await petClient.getById(created.id!);

    expect(body.status).toBe('sold');
    expect(body.category?.name).toBe('Birds');
    expect(body.tags?.[0]?.name).toBe('small');
  });

  test('returns content-type application/json @regression', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.getByIdRaw(created.id!);

    expect(response.headers()['content-type']).toContain('application/json');
  });
});

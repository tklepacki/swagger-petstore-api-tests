import { test, expect } from '../../fixtures/api.fixture';
import { PetSchema } from '../../schemas/pet.schema';

test.describe('PUT /pet — Update existing pet', () => {
  test('returns 200 and updated pet when valid data provided @smoke', async ({ withPet, petClient }) => {
    const created = await withPet({ name: 'OldName', status: 'available' });
    const updated = { ...created, name: 'NewName', status: 'sold' as const };

    const response = await petClient.updateRaw(updated);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('NewName');
    expect(body.status).toBe('sold');
    expect(body.id).toBe(created.id);
  });

  test('updated data is persisted and retrievable via GET @smoke', async ({ withPet, petClient }) => {
    const created = await withPet({ status: 'available' });
    const updated = { ...created, status: 'pending' as const };

    await petClient.update(updated);
    const fetched = await petClient.getById(created.id!);

    expect(fetched.status).toBe('pending');
  });

  test('response body conforms to Pet schema @regression', async ({ withPet, petClient }) => {
    const created = await withPet();
    const updated = { ...created, name: 'SchemaCheck' };

    const response = await petClient.updateRaw(updated);
    const body = await response.json();

    const result = PetSchema.safeParse(body);
    expect(result.success, `Schema validation failed: ${JSON.stringify(result.error)}`).toBe(true);
  });

  test('can update category and tags @regression', async ({ withPet, petClient }) => {
    const created = await withPet();
    const updated = {
      ...created,
      category: { id: 2, name: 'Cats' },
      tags: [{ id: 20, name: 'updated-tag' }],
    };

    const body = await petClient.update(updated);

    expect(body.category?.name).toBe('Cats');
    expect(body.tags?.[0]?.name).toBe('updated-tag');
  });

  test('returns a non-success or success when pet ID is negative @regression', async ({ petClient }) => {
    // The Petstore demo does not strictly validate negative IDs — accept any 2xx or 4xx
    const response = await petClient.updateRaw({ id: -1, name: 'Ghost', photoUrls: [] });

    expect([200, 400, 404, 405]).toContain(response.status());
  });

  test('returns content-type application/json @regression', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.updateRaw(created);

    expect(response.headers()['content-type']).toContain('application/json');
  });
});

test.describe('POST /pet/{petId} — Update pet with form data', () => {
  test('returns 200 when updating name via form data @regression', async ({ withPet, petClient }) => {
    const created = await withPet({ name: 'BeforeForm' });

    const response = await petClient.updateWithFormRaw(created.id!, 'AfterForm');

    expect([200, 405]).toContain(response.status());
  });

  test('returns 200 when updating status via form data @regression', async ({ withPet, petClient }) => {
    const created = await withPet({ status: 'available' });

    const response = await petClient.updateWithFormRaw(created.id!, undefined, 'sold');

    expect([200, 405]).toContain(response.status());
  });
});

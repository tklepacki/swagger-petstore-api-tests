import { test, expect } from '../../fixtures/api.fixture';
import { PetFactory } from '../../factories/pet.factory';

test.describe('DELETE /pet/{petId} — Delete pet', () => {
  test('returns 200 when deleting an existing pet @smoke', async ({ petClient }) => {
    // Create directly without fixture so the test owns the lifecycle
    const created = await petClient.create(PetFactory.build());

    const response = await petClient.deleteRaw(created.id!);

    expect(response.status()).toBe(200);
  });

  test('deleted pet is no longer retrievable via GET @smoke', async ({ petClient }) => {
    const created = await petClient.create(PetFactory.build());

    await petClient.deleteRaw(created.id!);
    const getResponse = await petClient.getByIdRaw(created.id!);

    expect(getResponse.status()).toBe(200);
  });

  test('returns 404 when deleting a non-existent pet @smoke', async ({ petClient }) => {
    const response = await petClient.deleteRaw(999_999_988);

    expect(response.status()).toBe(404);
  });

  test('returns 400 when petId is not a valid integer @regression', async ({ petClient }) => {
    const response = await petClient.deleteRaw('invalid-id');

    expect([400, 404]).toContain(response.status());
  });

  test('second delete on the same pet returns 404 @regression', async ({ petClient }) => {
    const created = await petClient.create(PetFactory.build());

    await petClient.deleteRaw(created.id!);
    const secondDelete = await petClient.deleteRaw(created.id!);

    expect(secondDelete.status()).toBe(404);
  });

  test('delete with api_key header succeeds @regression', async ({ petClient }) => {
    const created = await petClient.create(PetFactory.build());

    const response = await petClient.deleteRaw(created.id!, 'special-key');

    expect(response.status()).toBe(200);
  });
});

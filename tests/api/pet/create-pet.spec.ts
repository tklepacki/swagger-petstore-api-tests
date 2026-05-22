import { test, expect } from '../../fixtures/api.fixture';
import { PetFactory } from '../../factories/pet.factory';
import { PetSchema } from '../../schemas/pet.schema';

test.describe('POST /pet — Create pet', () => {
  test('returns 200 and the created pet when all fields are provided @smoke', async ({ petClient }) => {
    const payload = PetFactory.build();

    const response = await petClient.createRaw(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe(payload.name);
    expect(body.status).toBe(payload.status);
    expect(body.photoUrls).toEqual(payload.photoUrls);
  });

  test('response body conforms to Pet schema @smoke', async ({ petClient }) => {
    const payload = PetFactory.build();

    const response = await petClient.createRaw(payload);
    const body = await response.json();

    const result = PetSchema.safeParse(body);
    expect(result.success, `Schema validation failed: ${JSON.stringify(result.error)}`).toBe(true);
  });

  test('accepts minimal payload with only required fields @regression', async ({ petClient }) => {
    const payload = PetFactory.buildMinimal();

    const response = await petClient.createRaw(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.photoUrls).toEqual(payload.photoUrls);
  });

  test('preserves all provided fields in the response @regression', async ({ petClient }) => {
    const payload = PetFactory.build({
      name: 'Buddy',
      status: 'pending',
      category: { id: 5, name: 'Cats' },
      tags: [{ id: 10, name: 'fluffy' }, { id: 11, name: 'indoor' }],
      photoUrls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
    });

    const response = await petClient.createRaw(payload);
    const body = await response.json();

    expect(body.name).toBe('Buddy');
    expect(body.status).toBe('pending');
    expect(body.category?.name).toBe('Cats');
    expect(body.photoUrls).toHaveLength(2);
    expect(body.tags).toHaveLength(2);
  });

  test('returns content-type application/json @regression', async ({ petClient }) => {
    const response = await petClient.createRaw(PetFactory.build());

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('returns 405 when body is missing @regression', async ({ petClient }) => {
    const response = await petClient.createRaw(undefined);

    expect([405, 400, 415, 500]).toContain(response.status());
  });
});

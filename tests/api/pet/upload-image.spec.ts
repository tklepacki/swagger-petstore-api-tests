import { test, expect } from '../../fixtures/api.fixture';
import { ApiResponseSchema } from '../../schemas/pet.schema';

// Minimal 1x1 white JPEG — avoids reading from disk in API tests
const MINIMAL_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
    'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
    'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
    'MjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAA' +
    'AAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/' +
    'aAAwDAQACEQMRAD8AJQAB/9k=',
  'base64',
);

test.describe('POST /pet/{petId}/uploadImage — Upload pet image', () => {
  test('returns 200 and ApiResponse when uploading a valid image @smoke', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.uploadImageRaw(created.id!, MINIMAL_JPEG, 'test.jpg');

    expect(response.status()).toBe(200);
  });

  test('response body conforms to ApiResponse schema @smoke', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.uploadImageRaw(created.id!, MINIMAL_JPEG);
    const body = await response.json();

    const result = ApiResponseSchema.safeParse(body);
    expect(result.success, `Schema validation failed: ${JSON.stringify(result.error)}`).toBe(true);
  });

  test('response contains code, type and message fields @regression', async ({ withPet, petClient }) => {
    const created = await withPet();

    const result = await petClient.uploadImage(created.id!, MINIMAL_JPEG);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('message');
  });

  test('returns content-type application/json @regression', async ({ withPet, petClient }) => {
    const created = await withPet();

    const response = await petClient.uploadImageRaw(created.id!, MINIMAL_JPEG);

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('returns a response for non-existent pet ID @regression', async ({ petClient }) => {
    // The Petstore demo does not validate pet existence before uploading — accepts any pet ID
    const response = await petClient.uploadImageRaw(999_999_989, MINIMAL_JPEG);

    expect([200, 404, 415]).toContain(response.status());
  });
});

import { APIRequestContext, APIResponse } from '@playwright/test';
import type { Pet, ApiResponse, PetStatus } from '../schemas/pet.schema';
import { PetSchema, ApiResponseSchema } from '../schemas/pet.schema';
import { z } from 'zod';

export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  async createRaw(data: unknown): Promise<APIResponse> {
    return this.request.post('pet', { data });
  }

  async create(pet: Pet): Promise<Pet> {
    const response = await this.request.post('pet', { data: pet });
    const body = await response.json();
    return PetSchema.parse(body);
  }

  async getByIdRaw(id: number | string): Promise<APIResponse> {
    return this.request.get(`pet/${id}`);
  }

  async getById(id: number): Promise<Pet> {
    const response = await this.request.get(`pet/${id}`);
    const body = await response.json();
    return PetSchema.parse(body);
  }

  async findByStatusRaw(status: string): Promise<APIResponse> {
    return this.request.get('pet/findByStatus', { params: { status } });
  }

  async findByStatus(status: PetStatus): Promise<Pet[]> {
    const response = await this.request.get('pet/findByStatus', {
      params: { status },
    });
    const body = await response.json();
    return z.array(PetSchema).parse(body);
  }

  async findByTagsRaw(tags: string[]): Promise<APIResponse> {
    return this.request.get('pet/findByTags', { params: { tags: tags.join(',') } });
  }

  async updateRaw(data: unknown): Promise<APIResponse> {
    return this.request.put('pet', { data });
  }

  async update(pet: Pet): Promise<Pet> {
    const response = await this.request.put('pet', { data: pet });
    const body = await response.json();
    return PetSchema.parse(body);
  }

  async updateWithFormRaw(petId: number, name?: string, status?: string): Promise<APIResponse> {
    return this.request.post(`pet/${petId}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: { ...(name && { name }), ...(status && { status }) },
    });
  }

  async deleteRaw(id: number | string, apiKey?: string): Promise<APIResponse> {
    return this.request.delete(`pet/${id}`, {
      headers: { api_key: apiKey ?? process.env.API_KEY ?? 'special-key' },
    });
  }

  async uploadImageRaw(petId: number, imageBuffer: Buffer, filename = 'test.jpg'): Promise<APIResponse> {
    return this.request.post(`pet/${petId}/uploadImage`, {
      multipart: {
        additionalMetadata: 'test image upload',
        file: {
          name: filename,
          mimeType: 'image/jpeg',
          buffer: imageBuffer,
        },
      },
    });
  }

  async uploadImage(petId: number, imageBuffer: Buffer, filename?: string): Promise<ApiResponse> {
    const response = await this.uploadImageRaw(petId, imageBuffer, filename);
    const body = await response.json();
    return ApiResponseSchema.parse(body);
  }
}

import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const PetStatusSchema = z.enum(['available', 'pending', 'sold']);

export const PetSchema = z.object({
  id: z.number().optional(),
  category: CategorySchema.optional(),
  // The spec marks name as required, but the shared demo API has pets without it
  name: z.string().optional(),
  photoUrls: z.array(z.string()).optional(),
  tags: z.array(TagSchema).optional(),
  status: PetStatusSchema.optional(),
});

export const ApiResponseSchema = z.object({
  code: z.number().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Tag = z.infer<typeof TagSchema>;
export type PetStatus = z.infer<typeof PetStatusSchema>;
export type Pet = z.infer<typeof PetSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

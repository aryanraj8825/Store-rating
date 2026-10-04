const { z } = require('zod');

const name = z.string().trim().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters');
const email = z.string().trim().toLowerCase().max(255).email('Enter a valid email address');
const address = z.string().trim().min(1, 'Address is required').max(400, 'Address must be at most 400 characters');
const password = z
  .string()
  .min(8, 'Password must be 8-16 characters')
  .max(16, 'Password must be 8-16 characters')
  .regex(/[A-Z]/, 'Password needs at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password needs at least one special character');

const signupSchema = z.object({ name, email, address, password });
const loginSchema = z.object({ email, password: z.string().min(1, 'Password is required') });
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password,
});
const adminUserSchema = signupSchema.extend({ role: z.enum(['ADMIN', 'USER', 'OWNER']) });
const storeSchema = z.object({
  name: z.string().trim().min(1, 'Store name is required').max(100),
  email,
  address,
  ownerId: z.coerce.number().int().positive().nullable().optional(),
});
const ratingSchema = z.object({ rating: z.coerce.number().int().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5') });

module.exports = { signupSchema, loginSchema, passwordChangeSchema, adminUserSchema, storeSchema, ratingSchema };

import { z } from 'zod';

// Auth
export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8),
  displayName: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// User
export const UpdateProfileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  status: z.enum(['online', 'idle', 'dnd', 'invisible']).optional(),
  statusText: z.string().optional(),
  theme: z.string().optional(),
  compactMode: z.boolean().optional(),
});

// Server
export const CreateServerSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateServerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isPublic: z.boolean().optional(),
  category: z.string().optional(),
});

// Channel
export const CreateChannelSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['text', 'voice', 'forum']).optional(),
  isPrivate: z.boolean().optional(),
  isReadOnly: z.boolean().optional(),
  slowMode: z.number().optional(),
});

// Message
export const CreateMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  threadId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export const UpdateMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

// Bot
export const CreateBotCommandSchema = z.object({
  name: z.string().min(1).max(32),
  description: z.string(),
  trigger: z.string(),
  response: z.string(),
  cooldown: z.number().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateServerInput = z.infer<typeof CreateServerSchema>;
export type CreateChannelInput = z.infer<typeof CreateChannelSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

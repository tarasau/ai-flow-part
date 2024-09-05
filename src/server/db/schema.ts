import {
  serial,
  varchar,
  pgTable,
  timestamp,
  pgEnum,
  text,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { ProvidersType } from '../modules/ai-provider/ai-provider.types';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);
export const statusEnum = pgEnum('status', ['ACTIVE', 'BLOCKED']);
// TODO: create type helper for database enum
export const providersTypeEnum = pgEnum(
  'ProvidersType',
  Object.values(ProvidersType) as [string, ...string[]],
);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  refreshToken: varchar('refresh_token'),
  status: statusEnum('status').notNull().default('ACTIVE'),
  role: roleEnum('role').notNull().default('USER'),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const aiProviders = pgTable('ai_providers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: providersTypeEnum('type').notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  openAiId: integer('openai_id').references(() => openAiCredentials.id, { onDelete: 'cascade' }),
  groqId: integer('groq_id').references(() => groqCredentials.id, { onDelete: 'cascade' }),
  anthropicId: integer('anthropic_id').references(() => groqCredentials.id, {
    onDelete: 'cascade',
  }),
  geminiId: integer('gemini_id').references(() => geminiCredentials.id, {onDelete: 'cascade'}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const groqCredentials = pgTable('groq_credentials', {
  id: serial('id').primaryKey(),
  apiKey: varchar('api_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const groqCredentialsRelations = relations(groqCredentials, ({ many }) => ({
  aiProviders: many(aiProviders),
}));

export const openAiCredentials = pgTable('openai_credentials', {
  id: serial('id').primaryKey(),
  apiKey: varchar('api_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const openAiCredentialsRelations = relations(openAiCredentials, ({ many }) => ({
  aiProviders: many(aiProviders),
}));

export const geminiCredentials = pgTable("gemini_credentials", {
  id: serial('id').primaryKey(),
  apiKey: varchar('api_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const geminiCredentialsRelations = relations(geminiCredentials, ({ many }) => ({
  aiProviders: many(aiProviders),
}));

export const anthropicCredentials = pgTable('anthropic_credentials', {
  id: serial('id').primaryKey(),
  apiKey: varchar('api_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const anthropicCredentialsRelations = relations(anthropicCredentials, ({ many }) => ({
  aiProviders: many(aiProviders),
}));

export const aiProvidersRelations = relations(aiProviders, ({ one }) => ({
  groqCredential: one(groqCredentials, {
    fields: [aiProviders.groqId],
    references: [groqCredentials.id],
  }),
  openAiCredential: one(openAiCredentials, {
    fields: [aiProviders.openAiId],
    references: [openAiCredentials.id],
  }),
  anthropicCredential: one(anthropicCredentials, {
    fields: [aiProviders.anthropicId],
    references: [anthropicCredentials.id],
  }),
  geminiCredentials: one(geminiCredentials, {
    fields: [aiProviders.geminiId],
    references: [geminiCredentials.id],
  })
}));

export const flows = pgTable('flows', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  schema: jsonb('schema').notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  schema: jsonb('schema').notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

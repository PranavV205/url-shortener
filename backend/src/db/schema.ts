import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const urls = pgTable("urls", {
    id: uuid("id").defaultRandom().primaryKey(),
    shortCode: text("short_code").notNull().unique(),
    originalUrl: text("original_url").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    clicks: integer("clicks").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

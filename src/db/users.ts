import {pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: serial().primaryKey(),
    firstName: varchar({ length: 50 }).notNull(),
    lastName: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    timezone: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true })
});

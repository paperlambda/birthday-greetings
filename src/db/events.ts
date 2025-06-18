import {pgTable, integer, timestamp, date, serial, varchar} from "drizzle-orm/pg-core";
import {usersTable} from "./users";

export const eventsTable = pgTable("events", {
    id: serial().primaryKey(),
    userId: integer().notNull().references(() => usersTable.id, { onDelete: "restrict" }),
    eventType: varchar({ length: 100 }).notNull(),
    eventDate: date().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }),
})
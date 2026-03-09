import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const newsletters = pgTable(
  "newsletters",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    isActive: boolean("is_active").notNull().default(true),
    subscribedAt: timestamp("subscribed_at", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    unqEmail: uniqueIndex("newsletters_email_unique").on(table.email),
    idxIsActive: index("idx_newsletters_is_active").on(table.isActive),
    idxCreatedAt: index("idx_newsletters_created_at").on(table.createdAt),
  }),
);

import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const achievements = pgTable(
  "achievements",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    position: integer("position").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxPosition: index("idx_achievements_position").on(table.position),
    idxIsActive: index("idx_achievements_is_active").on(table.isActive),
  }),
);

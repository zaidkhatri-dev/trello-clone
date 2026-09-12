import { pgTable, uuid, timestamp, pgEnum, uniqueIndex, integer, check, text, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const memberRoles = pgEnum("member_role", ["admin", "member"]);

const timestamps = {
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}

export const users = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    email: text("email").notNull(),
    username: text("username"),
    profilePictureUrl: text("profile_picture_url"),
    ...timestamps
}, (table) => [
    uniqueIndex('email_lower_idx').on(sql`lower(${table.email})`),
    check("valid_email_format", sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`) 
]);

export const organizations = pgTable("organizations", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    name: text("name").notNull(),
    description: text("description"),
    ...timestamps
});

export const membership = pgTable("membership", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    role: memberRoles("role").notNull().default("member"),
    accepted: boolean("accepted").notNull().default(false),
    ...timestamps
}, (table) => [
    uniqueIndex('user_org_idx').on(table.userId, table.organizationId)
]);

export const boards = pgTable("boards", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    title: text("title").notNull(),
    description: text("description"),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    ...timestamps
});

export const sections = pgTable("sections", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    title: text("title").notNull(),
    boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    ...timestamps
}, (table) => [
    check("order_check", sql`${table.order} >= 0`)
]);

export const issues = pgTable("issues", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    title: text("title").notNull(),
    description: text("description"),
    sectionId: uuid("section_id").notNull().references(() => sections.id, { onDelete: "restrict" }),
    boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    ...timestamps
}, (table) => [
    check("order_check", sql`${table.order} >= 0`)
]);

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    content: text("content").notNull(),
    commentedById: uuid("commented_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id").notNull().references(() => issues.id, { onDelete: "cascade" }),
    ...timestamps
}, (table) => [
    check("content_not_empty", sql`TRIM(${table.content}) <> ''`)
]);
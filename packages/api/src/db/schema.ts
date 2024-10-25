import { pgTable, serial, varchar, integer, date } from 'drizzle-orm/pg-core'
import { type InferModel } from 'drizzle-orm'

export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  size: varchar('size', { length: 20 }).notNull(),
  miles: integer('miles').notNull(),
  lastService: date('last_service').notNull()
})

export type Vehicle = InferModel<typeof vehicles>
export type NewVehicle = InferModel<typeof vehicles, 'insert'>

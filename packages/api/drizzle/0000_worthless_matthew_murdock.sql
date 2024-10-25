CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"size" varchar(20) NOT NULL,
	"miles" integer NOT NULL,
	"last_service" date NOT NULL
);

INSERT INTO vehicles (type, size, miles, last_service) VALUES
  ('Semi Truck', 'Large', 150000, '2024-01-15'),
  ('Box Truck', 'Medium', 75000, '2024-02-20'),
  ('Dump Truck', 'Large', 98000, '2024-03-01'),
  ('Delivery Van', 'Small', 45000, '2024-02-10'),
  ('Flatbed Truck', 'Large', 120000, '2024-01-25'),
  ('Refrigerated Truck', 'Medium', 85000, '2024-03-10'),
  ('Concrete Mixer', 'Large', 65000, '2024-02-28'),
  ('Pickup Truck', 'Small', 35000, '2024-03-15');
  

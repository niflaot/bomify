CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "icon_key" VARCHAR(40) NOT NULL,
    "hex_color" VARCHAR(7) NOT NULL,
    "width_cm" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_materials" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "combination_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_materials_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "materials_deleted_at_idx" ON "materials"("deleted_at");
CREATE INDEX "materials_name_idx" ON "materials"("name");
CREATE INDEX "product_materials_product_id_idx" ON "product_materials"("product_id");
CREATE INDEX "product_materials_material_id_idx" ON "product_materials"("material_id");
CREATE INDEX "product_materials_combination_id_idx" ON "product_materials"("combination_id");

CREATE UNIQUE INDEX "product_materials_product_material_combination_key"
ON "product_materials"("product_id", "material_id", "combination_id");

CREATE UNIQUE INDEX "product_materials_global_material_key"
ON "product_materials"("product_id", "material_id")
WHERE "combination_id" IS NULL;

ALTER TABLE "product_materials"
ADD CONSTRAINT "product_materials_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_materials"
ADD CONSTRAINT "product_materials_material_id_fkey"
FOREIGN KEY ("material_id") REFERENCES "materials"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_materials"
ADD CONSTRAINT "product_materials_combination_id_fkey"
FOREIGN KEY ("combination_id") REFERENCES "product_combinations"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

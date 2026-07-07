CREATE TABLE "pieces" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "width_mm" DOUBLE PRECISION NOT NULL,
    "height_mm" DOUBLE PRECISION NOT NULL,
    "dxf_bucket" VARCHAR(255) NOT NULL,
    "dxf_object_key" VARCHAR(1024) NOT NULL,
    "dxf_url" VARCHAR(2048),
    "dxf_file_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "piece_material_requirements" (
    "id" TEXT NOT NULL,
    "piece_id" TEXT NOT NULL,
    "product_material_id" TEXT,
    "combination_material_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "piece_material_requirements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "piece_material_requirements_single_scope_check"
        CHECK (
            (
                ("product_material_id" IS NOT NULL)::integer
                + ("combination_material_id" IS NOT NULL)::integer
            ) = 1
        )
);

CREATE INDEX "pieces_product_id_deleted_at_idx"
ON "pieces"("product_id", "deleted_at");

CREATE INDEX "pieces_updated_at_idx"
ON "pieces"("updated_at");

CREATE UNIQUE INDEX "pieces_product_id_number_key"
ON "pieces"("product_id", "number");

CREATE INDEX "piece_material_requirements_combination_material_id_idx"
ON "piece_material_requirements"("combination_material_id");

CREATE INDEX "piece_material_requirements_piece_id_idx"
ON "piece_material_requirements"("piece_id");

CREATE INDEX "piece_material_requirements_product_material_id_idx"
ON "piece_material_requirements"("product_material_id");

CREATE UNIQUE INDEX "piece_material_requirements_piece_id_combination_material_id_key"
ON "piece_material_requirements"("piece_id", "combination_material_id");

CREATE UNIQUE INDEX "piece_material_requirements_piece_id_product_material_id_key"
ON "piece_material_requirements"("piece_id", "product_material_id");

ALTER TABLE "pieces"
ADD CONSTRAINT "pieces_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "piece_material_requirements"
ADD CONSTRAINT "piece_material_requirements_piece_id_fkey"
FOREIGN KEY ("piece_id") REFERENCES "pieces"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "piece_material_requirements"
ADD CONSTRAINT "piece_material_requirements_product_material_id_fkey"
FOREIGN KEY ("product_material_id") REFERENCES "product_materials"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "piece_material_requirements"
ADD CONSTRAINT "piece_material_requirements_combination_material_id_fkey"
FOREIGN KEY ("combination_material_id") REFERENCES "product_combination_materials"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

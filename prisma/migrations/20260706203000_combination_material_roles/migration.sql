CREATE TABLE "product_combination_materials" (
    "id" TEXT NOT NULL,
    "combination_id" TEXT NOT NULL,
    "product_material_id" TEXT NOT NULL,
    "role_id" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_combination_materials_pkey" PRIMARY KEY ("id")
);

INSERT INTO "product_combination_materials" (
    "id",
    "combination_id",
    "product_material_id",
    "role_id",
    "created_at",
    "updated_at"
)
SELECT
    'migrated_' || "id",
    "combination_id",
    "id",
    'material-' || ROW_NUMBER() OVER (
        PARTITION BY "combination_id"
        ORDER BY "created_at", "id"
    ),
    "created_at",
    "updated_at"
FROM "product_materials"
WHERE "combination_id" IS NOT NULL;

WITH ranked_product_materials AS (
    SELECT
        "id",
        FIRST_VALUE("id") OVER (
            PARTITION BY "product_id", "material_id"
            ORDER BY
                CASE WHEN "combination_id" IS NULL THEN 0 ELSE 1 END,
                "created_at",
                "id"
        ) AS "canonical_id"
    FROM "product_materials"
)
UPDATE "product_combination_materials"
SET "product_material_id" = ranked_product_materials."canonical_id"
FROM ranked_product_materials
WHERE "product_combination_materials"."product_material_id" = ranked_product_materials."id";

WITH ranked_product_materials AS (
    SELECT
        "id",
        FIRST_VALUE("id") OVER (
            PARTITION BY "product_id", "material_id"
            ORDER BY
                CASE WHEN "combination_id" IS NULL THEN 0 ELSE 1 END,
                "created_at",
                "id"
        ) AS "canonical_id"
    FROM "product_materials"
)
DELETE FROM "product_materials"
USING ranked_product_materials
WHERE "product_materials"."id" = ranked_product_materials."id"
  AND ranked_product_materials."id" <> ranked_product_materials."canonical_id";

ALTER TABLE "product_materials"
DROP CONSTRAINT IF EXISTS "product_materials_combination_id_fkey";

DROP INDEX IF EXISTS "product_materials_product_material_combination_key";
DROP INDEX IF EXISTS "product_materials_global_material_key";
DROP INDEX IF EXISTS "product_materials_combination_id_idx";

ALTER TABLE "product_materials"
DROP COLUMN "combination_id";

CREATE UNIQUE INDEX "product_materials_product_id_material_id_key"
ON "product_materials"("product_id", "material_id");

CREATE INDEX "product_combination_materials_combination_id_idx"
ON "product_combination_materials"("combination_id");

CREATE INDEX "product_combination_materials_product_material_id_idx"
ON "product_combination_materials"("product_material_id");

CREATE UNIQUE INDEX "product_combination_materials_combination_id_role_id_key"
ON "product_combination_materials"("combination_id", "role_id");

ALTER TABLE "product_combination_materials"
ADD CONSTRAINT "product_combination_materials_combination_id_fkey"
FOREIGN KEY ("combination_id") REFERENCES "product_combinations"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_combination_materials"
ADD CONSTRAINT "product_combination_materials_product_material_id_fkey"
FOREIGN KEY ("product_material_id") REFERENCES "product_materials"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

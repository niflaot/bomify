CREATE TABLE "product_combinations" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "hex_color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_combinations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_combinations_product_id_deleted_at_idx"
ON "product_combinations"("product_id", "deleted_at");

CREATE INDEX "product_combinations_updated_at_idx"
ON "product_combinations"("updated_at");

ALTER TABLE "product_combinations"
ADD CONSTRAINT "product_combinations_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

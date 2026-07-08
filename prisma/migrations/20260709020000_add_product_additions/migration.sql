CREATE TABLE "product_additions" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit_price_cop" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "product_additions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_additions_product_id_deleted_at_idx" ON "product_additions"("product_id", "deleted_at");

ALTER TABLE "product_additions" ADD CONSTRAINT "product_additions_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

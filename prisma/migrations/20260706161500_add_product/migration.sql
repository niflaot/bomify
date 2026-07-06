CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "photo_bucket" VARCHAR(255),
    "photo_object_key" VARCHAR(1024),
    "photo_url" VARCHAR(2048),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

CREATE INDEX "products_updated_at_idx" ON "products"("updated_at");

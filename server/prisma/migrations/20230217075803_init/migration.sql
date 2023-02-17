-- CreateTable
CREATE TABLE "ShortUrl" (
    "id" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isOgCustom" BOOLEAN NOT NULL,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,

    CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShortUrl_id_url_userId_idx" ON "ShortUrl"("id", "url", "userId");

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "safeImport" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "sku" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "socket" TEXT,
    "chipset" TEXT,
    "ramType" TEXT,
    "ramSlots" INTEGER,
    "maxRamGb" INTEGER,
    "formFactor" TEXT,
    "lengthMm" INTEGER,
    "heightMm" INTEGER,
    "widthMm" INTEGER,
    "tdpWatts" INTEGER,
    "psuWatts" INTEGER,
    "psuFormFactor" TEXT,
    "benchmarkScore" INTEGER,
    "fps1080p" INTEGER,
    "fps1440p" INTEGER,
    "fps4K" INTEGER,
    "cores" INTEGER,
    "threads" INTEGER,
    "boostClockMhz" INTEGER,
    "baseCockMhz" INTEGER,
    "cacheMb" INTEGER,
    "capacityGb" INTEGER,
    "speedMhz" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Part_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Retailer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'AU',
    "source" TEXT NOT NULL,
    "logoUrl" TEXT
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "profileUrl" TEXT,
    "country" TEXT
);

-- CreateTable
CREATE TABLE "SellerTrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "orderCount" INTEGER,
    "positivePercent" REAL,
    "shipsToAU" BOOLEAN NOT NULL DEFAULT true,
    "score" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SellerTrustScore_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partId" TEXT NOT NULL,
    "retailerId" TEXT NOT NULL,
    "sellerId" TEXT,
    "url" TEXT,
    "price" REAL NOT NULL,
    "shipping" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'AUD',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "condition" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "deliveryDays" INTEGER,
    "warrantyMonths" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "shipping" REAL NOT NULL DEFAULT 0,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceHistory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "totalPrice" REAL,
    "estimatedWatts" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BuildPart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buildId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    CONSTRAINT "BuildPart_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompatibilityRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectPartId" TEXT,
    "targetPartId" TEXT,
    "subjectCategory" TEXT,
    "targetCategory" TEXT,
    "field" TEXT,
    "operator" TEXT,
    "value" TEXT,
    "result" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'error',
    CONSTRAINT "CompatibilityRule_subjectPartId_fkey" FOREIGN KEY ("subjectPartId") REFERENCES "Part" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CompatibilityRule_targetPartId_fkey" FOREIGN KEY ("targetPartId") REFERENCES "Part" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Retailer_slug_key" ON "Retailer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SellerTrustScore_sellerId_key" ON "SellerTrustScore"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "Build_slug_key" ON "Build"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BuildPart_buildId_partId_key" ON "BuildPart"("buildId", "partId");

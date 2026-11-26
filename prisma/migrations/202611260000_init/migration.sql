-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlMedium" TEXT NOT NULL DEFAULT '',
    "alt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "destination" TEXT NOT NULL DEFAULT '',
    "usage" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "sourceUrl" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "license" TEXT NOT NULL DEFAULT '',
    "provenance" TEXT NOT NULL DEFAULT 'verified_photograph',
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "bestTimeToVisit" TEXT NOT NULL DEFAULT '',
    "travelInfo" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "heroImageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "City_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CityMedia" (
    "cityId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("cityId", "mediaId"),
    CONSTRAINT "CityMedia_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CityMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttractionCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Attraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "historicalInfo" TEXT NOT NULL DEFAULT '',
    "visitorInfo" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "coverImageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attraction_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attraction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AttractionCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Attraction_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttractionMedia" (
    "attractionId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("attractionId", "mediaId"),
    CONSTRAINT "AttractionMedia_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttractionMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SightseeingRoute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SightseeingRoute_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SightseeingRouteNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "attractionId" TEXT,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "SightseeingRouteNode_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "SightseeingRoute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SightseeingRouteNode_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SightseeingRouteEdge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    CONSTRAINT "SightseeingRouteEdge_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "SightseeingRoute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SightseeingRouteEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "SightseeingRouteNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SightseeingRouteEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "SightseeingRouteNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "MediaAsset_category_idx" ON "MediaAsset"("category");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_status_displayOrder_idx" ON "City"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AttractionCategory_name_key" ON "AttractionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AttractionCategory_slug_key" ON "AttractionCategory"("slug");

-- CreateIndex
CREATE INDEX "Attraction_cityId_status_displayOrder_idx" ON "Attraction"("cityId", "status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Attraction_cityId_slug_key" ON "Attraction"("cityId", "slug");

-- CreateIndex
CREATE INDEX "SightseeingRoute_cityId_status_displayOrder_idx" ON "SightseeingRoute"("cityId", "status", "displayOrder");

-- CreateIndex
CREATE INDEX "SightseeingRouteNode_routeId_sortOrder_idx" ON "SightseeingRouteNode"("routeId", "sortOrder");

-- CreateIndex
CREATE INDEX "SightseeingRouteEdge_routeId_idx" ON "SightseeingRouteEdge"("routeId");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");


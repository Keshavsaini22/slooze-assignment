-- CreateEnum
CREATE TYPE "DietaryType" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "dietaryType" "DietaryType" NOT NULL DEFAULT 'VEG',
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "image" TEXT;

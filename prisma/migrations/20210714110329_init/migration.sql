/*
  Warnings:

  - You are about to drop the column `postName` on the `likePosts` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `likePosts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "likePosts" DROP COLUMN "postName",
DROP COLUMN "userName";

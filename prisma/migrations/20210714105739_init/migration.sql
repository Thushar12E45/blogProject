/*
  Warnings:

  - You are about to drop the column `authorId` on the `likePosts` table. All the data in the column will be lost.
  - Added the required column `postName` to the `likePosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `likePosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `likePosts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likePosts" DROP CONSTRAINT "likePosts_authorId_fkey";

-- AlterTable
ALTER TABLE "likePosts" DROP COLUMN "authorId",
ADD COLUMN     "postName" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "likePosts" ADD FOREIGN KEY ("userId") REFERENCES "userTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

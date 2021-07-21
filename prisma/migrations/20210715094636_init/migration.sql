-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR');

-- AlterTable
ALTER TABLE "userTable" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'AUTHOR';

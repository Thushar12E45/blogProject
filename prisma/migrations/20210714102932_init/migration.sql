-- CreateTable
CREATE TABLE "likePosts" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likePosts" ADD FOREIGN KEY ("authorId") REFERENCES "userTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likePosts" ADD FOREIGN KEY ("postId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

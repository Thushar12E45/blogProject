const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function createData(data, table) {
  const newData = await prisma[table].create({
    data,
  });
  return newData;
}
async function getAllArticles() {
  const articles = await prisma.article.findMany({
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: 'desc' }],
  });
  return articles;
}

async function getArticlesOfAuthor(id) {
  const articles = await prisma.article.findMany({
    where: {
      authorId: id,
    },
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: 'desc' }],
  });
  return articles;
}

async function getAuthorList() {
  const authorList = await prisma.userTable.findMany({
    select: {
      name: true,
      id: true,
      role: true,
    },
    orderBy: [{ role: 'asc' }],
  });
  return authorList;
}

async function getAuthorId(id) {
  const authorId = await prisma.article.findFirst({
    select: {
      authorId: true,
    },
    where: {
      id,
    },
  });
  return authorId;
}

async function getArticleById(id) {
  const article = await prisma.article.findFirst({
    where: {
      id,
    },
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
  return article;
}

async function getUserByEmail(email) {
  const user = await prisma.userTable.findUnique({
    where: {
      email,
    },
  });
  return user;
}

async function searchByAuthor(author, sortType) {
  const articles = await prisma.article.findMany({
    where: {
      userTable: {
        name: {
          contains: author,
          mode: 'insensitive',
        },
      },
    },
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: sortType }],
  });
  return articles;
}

async function searchByKeyword(keyword, sortType) {
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          markdown: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },

    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: sortType }],
  });
  return articles;
}

async function searchByAuthorAndKeyword(data) {
  const { keyword, author, sortType } = data;
  const articles = await prisma.article.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              title: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              markdown: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        },
        {
          userTable: {
            name: {
              contains: author,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: sortType }],
  });

  return articles;
}

async function sortbyDate(sortType) {
  const articles = await prisma.article.findMany({
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: [{ date: sortType }],
  });
  return articles;
}

async function updateArticleData(id, data) {
  const updatedData = await prisma.article.update({
    where: {
      id,
    },
    data,
    include: {
      userTable: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
  return updatedData;
}

async function updateUserData(id, data) {
  const updatedData = await prisma.userTable.update({
    where: {
      id,
    },
    data,
  });
  return updatedData;
}

async function deleteArticle(id) {
  const deletedData = await prisma.article.delete({
    where: {
      id: +id,
    },
  });
  return deletedData;
}

async function getUserById(id) {
  const user = await prisma.userTable.findUnique({
    where: {
      id,
    },
  });
  return user;
}

module.exports = {
  createData,
  getAllArticles,
  getAuthorList,
  getAuthorId,
  getArticleById,
  getArticlesOfAuthor,
  getUserByEmail,
  searchByAuthor,
  searchByKeyword,
  searchByAuthorAndKeyword,
  sortbyDate,
  updateArticleData,
  updateUserData,
  deleteArticle,
  getUserById,
};

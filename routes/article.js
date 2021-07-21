const express = require('express');

const router = express.Router();
const marked = require('marked');

const {
  getAllArticles,
  getAuthorList,
  getArticleById,
  searchByAuthor,
  searchByKeyword,
  searchByAuthorAndKeyword,
  sortbyDate,
} = require('../util/queryFunctions.js');

const logger = require('../util/winstonLogger.js');

let data;
let errorMessage;
let userName;
let loggedUser;
try {
  router.get('/', async (req, res, next) => {
    let loggedIn = false;
    loggedUser = {
      id: null,
      name: null,
      role: null,
    };

    if (global.isLogged) {
      loggedIn = true;
      loggedUser = req.user;
    }

    data = {
      author: null,
      keyword: null,
      sortType: null,
    };

    const author = null;

    const articles = await getAllArticles();

    const authorList = await getAuthorList();

    res.render('article', {
      articles,
      data,
      authorList,
      errorMessage: req.flash('errorMessage1'),
      successMessage: req.flash('successMessage1'),
      author,
      loggedIn,
      loggedUser,
    });
  });
} catch (e) {
  logger.error(e.stack);
}

try {
  router.get('/article/show/:id', async (req, res) => {
    const article = await getArticleById(+req.params.id);

    article.markdown = marked(article.markdown);
    if (article === null) {
      res.redirect('/');
    }

    let loggedIn = false;
    if (global.isLogged) {
      loggedIn = true;
      userName = req.user.name;
    }

    res.render('showArticle', { article, loggedIn });
  });
} catch (e) {
  logger.error(e.stack);
}

try {
  router.get('/search', async (req, res) => {
    data = req.query;
    if (data.sortType === undefined) {
      data.sortType = 'desc';
    }
    const { keyword, author, sortType } = data;
    errorMessage = null;

    const authorList = await getAuthorList();
    let loggedIn = false;
    loggedUser = {
      id: null,
      name: null,
      role: null,
    };

    if (global.isLogged) {
      loggedIn = true;
      loggedUser = req.user;
    }

    let articles;
    if (keyword && author) {
      articles = await searchByAuthorAndKeyword(data);
    } else if (keyword) {
      articles = await searchByKeyword(keyword, sortType);
    } else if (author) {
      articles = await searchByAuthor(author, sortType);
    } else {
      articles = await sortbyDate(sortType);
    }
    if (articles.length === 0) {
      errorMessage = 'Article not present';
    }
    res.render('article', {
      articles,
      data,
      authorList,
      errorMessage,
      author,
      loggedIn,
      loggedUser,
    });
  });
} catch (e) {
  logger.error(e.stack);
}

module.exports = router;

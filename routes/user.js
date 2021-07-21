const express = require('express');

const router = express.Router();
const { unlink } = require('fs/promises');
const marked = require('marked');
const { ensureAuthenticated } = require('../config/auth.js');
const permit = require('../util/permission.js');
const sanitizer = require('../util/sanitizer.js');

const { logger } = require('../util/winstonLogger.js');
const {
  createData,
  getAuthorList,
  getArticleById,
  getArticlesOfAuthor,
  updateArticleData,
  updateUserData,
  deleteArticle,
} = require('../util/queryFunctions.js');

let userName;
let warningMessage;

try {
  router.get('/', ensureAuthenticated, async (req, res) => {
    userName = req.user.name;
    global.isLogged = true;
    req.flash('loggedIn', 'true');
    res.redirect('/');
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.get('/posts', ensureAuthenticated, async (req, res) => {
    userName = req.user.name;
    const articles = await getArticlesOfAuthor(+req.user.id);

    if (articles.length === 0) {
      warningMessage = `No articles to display of ${userName}`;
    }
    res.render('author/userArticles', {
      userName,
      articles,
      errorMessage: req.flash('errorMessage'),
      warningMessage,
    });
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

let type;
let title;
let markdown;
let newArticle = {};

try {
  router.get('/newArticle', (req, res) => {
    newArticle = {
      title: null,
      markdown: null,
    };
    type = 'newArticle';
    res.render('author/newArticle', { newArticle, type });
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.get('/edit/:id/', ensureAuthenticated, permit(['ADMIN', 'EDITOR', 'AUTHOR'], 'edit'), async (req, res) => {
    newArticle = await getArticleById(+req.params.id);
    type = 'edit';
    if (newArticle === null) {
      res.redirect('/');
    }
    res.render('author/editArticle', { newArticle, type });
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.delete('/:id', ensureAuthenticated, permit(['ADMIN', 'AUTHOR', 'EDITOR'], 'delete'), async (req, res) => {
    const { id } = req.params;
    await deleteArticle(id);
    const filename = `${id}`;
    try {
      await unlink(`./public/uploads/${filename}`);
    } catch (error) {
      logger.error(error.stack);
      throw error;
    }

    req.flash('errorMessage1', `Article deleted successfully.`);
    res.redirect('/');
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.get('/post/:id', ensureAuthenticated, async (req, res) => {
    const article = await getArticleById(+req.params.id);
    article.markdown = marked(article.markdown);

    if (article === null) {
      res.redirect('/user');
    }
    res.render('author/showUserArticle', { article, successMessage: req.flash('updateMessage') });
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.post('/', async (req, res) => {
    title = sanitizer(req.body.title).toUpperCase();

    markdown = sanitizer(req.body.markdown);

    try {
      newArticle = {
        authorId: +req.user.id,
        title,
        markdown,
      };

      const newArticleData = await createData(newArticle, 'article');
      const { id } = newArticleData;
      if (req.files) {
        const file = req.files.img;
        const filename = `${id}`;

        file.mv(`./public/uploads/${filename}`).catch((err) => {
          logger.error(err);
        });
      }
      res.redirect(`/user/post/${id}`);
    } catch (e) {
      const errors = [];
      errors.push({ msg: 'Title is already used. Please use a different title' });
      type = 'newArticle';

      res.render(`author/newArticle`, { errors, newArticle, type });
      throw e;
    }
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.put('/:id', async (req, res) => {
    title = sanitizer(req.body.title).toUpperCase();
    markdown = sanitizer(req.body.markdown);

    const id = +req.params.id;
    if (req.files) {
      const file = req.files.img;
      const filename = `${id}`;
      file.mv(`./public/uploads/${filename}`).catch((err) => {
        if (err) {
          logger.error(err.stack);
          throw err;
        }
      });
    }
    const data = {
      title,
      markdown,
    };

    const updatedArticle = await updateArticleData(id, data);
    req.flash('updateMessage', `Article ${updatedArticle.title} updated successfully.`);
    res.redirect(`/user/post/${updatedArticle.id}`);
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

try {
  router.get('/admin', ensureAuthenticated, permit(['ADMIN'], 'adminAccess'), async (req, res) => {
    const userList = await getAuthorList();
    res.render('userList', { userList });
  });

  router.post('/update/userList', ensureAuthenticated, async (req, res) => {
    const id = +req.body.userId;
    const data = {
      role: req.body.userRole,
    };
    const userList = await updateUserData(id, data);
    res.redirect('/user/admin');
  });

  router.put('/admin/changeAuthor', ensureAuthenticated, permit(['ADMIN'], 'adminAccess'), async (req, res) => {
    const id = +req.body.articleId;
    const data = {
      authorId: +req.body.newAuthorId,
    };
    const article = await updateArticleData(id, data);
    req.flash('successMessage1', `Author of ${article.title} changed to ${article.userTable.name} successfully`);
    res.redirect('/');
  });
} catch (e) {
  logger.error(e.stack);
  throw e;
}

module.exports = router;

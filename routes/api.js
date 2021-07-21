const express = require('express');
const passport = require('passport');

const router = express.Router();
const sanitizer = require('../util/sanitizer.js');

const {
  getAllArticles,
  getArticleById,
  searchByAuthor,
  searchByKeyword,
  searchByAuthorAndKeyword,
  sortbyDate,
  createData,
  updateArticleData,
  deleteArticle,
} = require('../util/queryFunctions.js');
const logger = require('../util/winstonLogger.js');

router.get('/posts', passport.authenticate('jwt'), async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});
router.get('/posts/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const article = await getArticleById(+req.params.id);
    res.status(200).json(article);
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});
router.post('/posts', passport.authenticate('jwt'), async (req, res) => {
  try {
    const title = sanitizer(req.body.title).toUpperCase();
    const markdown = sanitizer(req.body.markdown);

    const newArticle = {
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
    res.status(200).json(newArticleData);
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});
router.put('/posts/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const title = sanitizer(req.body.title).toUpperCase();
    const markdown = sanitizer(req.body.markdown);

    const id = +req.params.id;
    const data = {
      title,
      markdown,
    };
    if (req.files) {
      const file = req.files.img;
      const filename = `${id}`;
      file.mv(`./public/uploads/${filename}`).catch((err) => {
        if (err) {
          logger.error(err.stack);
        }
      });
    }

    const updatedArticle = await updateArticleData(id, data);
    res.status(200).json(updatedArticle);
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});

router.delete('/posts/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await deleteArticle(id);
    res.status(200).json({ success: true, msg: `The article ${deletedArticle.title} is deleted succcessfully` });
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const data = req.query;
    if (data.sortType === undefined) {
      data.sortType = 'desc';
    }
    const { keyword, author, sortType } = data;

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
      res.status(404).json({ success: false, msg: 'Article not found' });
    }
    res.status(200).json(articles);
  } catch (err) {
    logger.error(err.stack);
    res.status(501).json({ msg: ' There is an error. Our tech team has been notified.' });
  }
});

module.exports = router;

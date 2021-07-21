const { getAuthorId } = require('./queryFunctions.js');

function permit(permittedRoles, task) {
  return async (req, res, next) => {
    const { user } = req;

    if (user.role !== 'ADMIN') {
      if (task === 'adminAccess') {
        req.flash('errorMessage1', `Access denied`);
        res.redirect('/');
      } else if (task === 'edit') {
        const { authorId } = await getAuthorId(+req.params.id);
        if (user.role === 'EDITOR') {
          next();
        } else if (user.id === +authorId) {
          next();
        } else {
          req.flash('errorMessage1', `Access denied`);
          res.redirect('/');
        }
      } else if (task === 'delete') {
        const { authorId } = await getAuthorId(+req.params.id);
        if (user.id === +authorId) {
          next();
        } else {
          req.flash('errorMessage1', `Access denied`);
          res.redirect('/');
        }
      }
    } else {
      next();
    }
  };
}

module.exports = permit;

const { getAuthorId } = require('./queryFunctions.js');

function apiPermit(task) {
  return async (req, res, next) => {
    const { user } = req;
    const authorId = await getAuthorId(+req.params.id);
    if (user.role !== 'ADMIN') {
      if (task === 'edit') {
        if (user.role === 'EDITOR') {
          next();
        } else if (user.id === +authorId) {
          next();
        } else {
          res.status(403).json({ success: false, msg: `Access Denied` });
        }
      } else if (task === 'delete') {
        if (user.id === +authorId) {
          next();
        } else {
          res.status(403).json({ success: false, msg: `Access Denied` });
        }
      } else if (task === 'adminAccess') {
        res.status(403).json({ success: false, msg: `Access Denied` });
      }
    } else {
      next();
    }
  };
}

module.exports = apiPermit;

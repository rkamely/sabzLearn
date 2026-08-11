module.exports =async (req, res, next) => {
  const isAdmin = req.user.role === 'ADMIN';
  if (isAdmin) {
    return next();
  }
  return res.status(401).send('Not authorized for USERS');
}
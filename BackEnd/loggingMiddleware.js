
module.exports = function loggingMiddleware(req, res, next) {
  
  req._log = {
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  };
  
  next();
};

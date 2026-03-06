const { validationResult } = require("express-validator");

/**
 * Middleware to collect express-validator errors and return a 422.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(422).json({ ok: false, message: messages.join(". ") });
  }
  next();
}

module.exports = validate;

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] || 'form';
      if (!errors[key]) errors[key] = issue.message;
    }
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

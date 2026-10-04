exports.notFound = (req, res) => res.status(404).json({ message: 'Not found' });

exports.errorHandler = (err, req, res, next) => {
  if (err.code === '23505') return res.status(409).json({ message: 'That email is already in use', errors: { email: 'Already in use' } });
  if (err.code === '23503') return res.status(400).json({ message: 'Referenced record does not exist' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side' });
};

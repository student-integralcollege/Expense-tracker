export const validate = (schema) => (req, _res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    if (Array.isArray(error.errors)) {
      const validationError = new Error(
        error.errors
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
      );
      validationError.statusCode = 400;
      next(validationError);
      return;
    }

    error.statusCode = 400;
    next(error);
  }
};

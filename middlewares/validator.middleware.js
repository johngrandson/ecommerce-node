class Validator {
  constructor() {}

  static get() {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }

    return Validator.instance;
  }

  check(schema) {
    return (req, res, next) => {
      const error = ["query", "body", "params"]
        .filter((property) => schema[property] && req[property])
        .map((property) =>
          schema[property].validate(req[property], {
            abortEarly: true,
            allowUnknown: false,
          })
        )
        .filter((result) => result.error)
        .map((result) => result.error)
        .slice()
        .shift();

      if (error) {
        return next(error);
      }

      next();
    };
  }
}

module.exports = { Validator: Validator.get() };

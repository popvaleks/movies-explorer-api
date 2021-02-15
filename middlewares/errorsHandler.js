class ErrorHandler extends Error {
  constructor(message, err) {
    super(message)
    this.statusCode = err
  }
}

module.exports = ErrorHandler
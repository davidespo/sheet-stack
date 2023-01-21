const functions = require("firebase-functions");

const { info, warn, debug, error, log } = functions.logger;

exports.gcp = {
  info,
  warn,
  debug,
  error,
  log,
};

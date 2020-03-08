
const createCallbackHandler = ({ callback, context = {} } = {}) => ({
  statusCode = 200,
  headers = {},
  body,
} = {}) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;
  callback(null, {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
};

module.exports = createCallbackHandler;

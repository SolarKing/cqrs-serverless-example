const uuid = require('uuid/v4');

const createJsonApiError = (error, {
  status = 500,
  code = '',
  detail = '',
} = {}) => ({
  error: {
    id: uuid(),
    title: error.message,
    detail,
    code,
    status,
  },
});

module.exports = createJsonApiError;

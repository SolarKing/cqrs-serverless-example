const uuid = require('uuid/v4');
const { Serializer } = require('jsonapi-serializer');
const getModels = require('../models');
const createCallbackHandler = require('../../../utils/createCallbackHandler');
const createJsonApiError = require('../../../utils/createJsonApiError');

module.exports = async (event, context, callback) => {
  const send = createCallbackHandler({ callback, context });
  const ApiSerializer = new Serializer('api', {
    attributes: ['success'],
    pluralizeType: false,
  });
  try {
    const { readModel } = await getModels();
    await readModel.refresh();
    const body = ApiSerializer.serialize({ success: true, id: uuid() });
    await send({ body });
  } catch (error) {
    await send({
      statusCode: 500,
      body: createJsonApiError(error),
    });
  }
};

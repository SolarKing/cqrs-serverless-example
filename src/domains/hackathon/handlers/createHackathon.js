const { commandTypes } = require('../types');
const getModels = require('../models');
const createCallbackHandler = require('../../../utils/createCallbackHandler');
const createJsonApiError = require('../../../utils/createJsonApiError');

module.exports = async (event, context, callback) => {
  const send = createCallbackHandler({ callback, context });
  try {
    const { writeModel } = await getModels();
    await writeModel[commandTypes.CREATE_HACKATHON]('001', JSON.parse(event.body));
    send({ statusCode: 201, body: 'created successfully' });
  } catch (error) {
    send({ statusCode: 500, body: createJsonApiError(error) });
  }
};

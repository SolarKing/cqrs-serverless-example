const getModels = require('../models');
const createCallbackHandler = require('../../../utils/createCallbackHandler');
const createJsonApiError = require('../../../utils/createJsonApiError');
const HackathonSerializer = require('../HackathonSerializer');

module.exports = async (event, context, callback) => {
  const send = createCallbackHandler({ callback, context });
  try {
    const { readModel } = await getModels();
    const { results } = await readModel.search({});
    const json = HackathonSerializer.serialize(results);
    send({ body: json });
  } catch (error) {
    send({ statusCode: 500, body: createJsonApiError(error) });
  }
};

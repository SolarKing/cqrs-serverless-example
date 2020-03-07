const uuid = require('uuid/v4');
const { commandTypes } = require('../types');
const getModels = require('../models');
const createCallbackHandler = require('../../../utils/createCallbackHandler');
const createJsonApiError = require('../../../utils/createJsonApiError');

module.exports = async (event, context, callback) => {
  let close = () => {};
  const send = createCallbackHandler(callback);
  try {
    const { writeModel, readModel, adapter } = await getModels();
    close = adapter.close;
    const id = uuid();
    await writeModel[commandTypes.CREATE_HACKATHON](id, {
      name: `Event Name ${id}`,
      location: 'Dallas, Texas',
      startDate: new Date(),
      endDate: new Date(),
    });
    await writeModel[commandTypes.PUBLISH_HACKATHON](id, {});
    await writeModel[commandTypes.PUBLISH_HACKATHON](id, {});
    await writeModel[commandTypes.UPDATE_HACKATHON_DETAILS](id, { location: 'Austin, Texas' });
    await writeModel[commandTypes.OPEN_HACKATHON_REGISTRATION](id, {});
    await readModel.refresh();
    const hackathon = await readModel.getById({ id });
    send({ body: hackathon });
  } catch (error) {
    send({ statusCode: 500, body: createJsonApiError(error) });
  } finally {
    await close();
  }
};

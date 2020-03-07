const { readModelBuilder, writeModelBuilder } = require('serverless-cqrs');

const actions = require('./actions');
const reducer = require('./reducer');
const mongoAdapterBuilder = require('../../utils/mongoAdapterBuilder');

// TODO: change this to different endpoints based on env / dev vs prod

const mongoUri = 'mongodb+srv://cqrs-serverless-eventstore-read-write:11&YvF*!Cavq@cqrs-serverless-eventstore-naxf6.mongodb.net/test?retryWrites=true&w=majority';

const initModels = async () => {
  const adapter = await mongoAdapterBuilder.build({
    entityName: 'hackathon',
  }, {
    url: mongoUri,
    dbName: 'eventstore',
  });
  return {
    writeModel: writeModelBuilder.build({
      actions,
      reducer,
      adapter,
    }),
    readModel: readModelBuilder.build({
      reducer,
      adapter,
      eventAdapter: adapter,
    }),
    adapter,
  };
};


module.exports = initModels;

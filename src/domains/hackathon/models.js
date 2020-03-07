const { readModelBuilder, writeModelBuilder } = require('serverless-cqrs')

const actions = require("./actions")
const reducer = require("./reducer")
const mongoAdapterBuilder = require('../../utils/mongoAdapterBuilder')

const initModels = async () => {
  const adapter = await mongoAdapterBuilder.build({
    entityName: "hackathon"
  }, {
    url: "mongodb://localhost:27017",
    dbName: "eventstore"
  })
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
    adapter
  }
}


module.exports = initModels
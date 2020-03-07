const { commandTypes } = require('./types')
const { writeModel, readModel } = require("./models")
const mongoAdapterBuilder = require("../../utils/mongoAdapterBuilder")
const uuid = require('uuid/v4')
const getModels = require('./models')


module.exports.createHackathon = async event => {

  const { writeModel, readModel } = await getModels()

  await writeModel[commandTypes.CREATE_HACKATHON]('001', {
    name: 'test001'
  })
  return {
    statusCode: 201, // created
    body: {
      input: event,
    }
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.testSaga = async event => {

  let status = 500
  let body = ""
  let close = () => {}

  try {
    const { writeModel, readModel, adapter } = await getModels()
    close = adapter.close
    const id = uuid()
    await writeModel[commandTypes.CREATE_HACKATHON](id, {
      name: `Event Name ${id}`
    })
    await writeModel[commandTypes.PUBLISH_HACKATHON](id, {})
    await readModel.refresh()
    const hackathon = await readModel.getById({ id })
    status = 200
    body = hackathon
  } catch (error) {
    status = 500
    body = error
  } finally {
    await close()
    return {
      status,
      body
    }
  }
}

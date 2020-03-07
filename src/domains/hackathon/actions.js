const { commandTypes, eventTypes } = require("./types")

module.exports = {
  [commandTypes.CREATE_HACKATHON]: (state, payload) => {
    if (!payload.name) throw new Error('payload.name is missing')
    return [
      {
        type: eventTypes.HACKATHON_CREATED,
        payload: payload.name,
      }
    ]
  },
  [commandTypes.PUBLISH_HACKATHON]: (state, payload) => {
    return [
      {
        type: eventTypes.HACKATHON_PUBLISHED
      }
    ]
  }
}


const { eventTypes } = require("./types")

const initState = {
  name: "",
  isPublished: false,
}

const reducer = (state, event = {}) => {
  switch(event.type) {
    case eventTypes.HACKATHON_CREATED: {
      return {
        ...state,
        name: event.payload
      }
    }
    case eventTypes.HACKATHON_PUBLISHED: {
      return {
        ...state,
        isPublished: true,
      }
    }
    default: return state
  }
}

module.exports = (events, state=initState) => {
  const view = events.reduce(reducer, state)
  return view
}
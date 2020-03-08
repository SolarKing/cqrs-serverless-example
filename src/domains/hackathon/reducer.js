const { eventTypes } = require('./types');

const initState = {
  name: '',
  isPublished: false,
};

const reducer = (state, event = {}) => {
  switch (event.type) {
    case eventTypes.HACKATHON_DETAILS_UPDATED: {
      return {
        ...state,
        ...event.payload,
      };
    }
    case eventTypes.HACKATHON_CREATED: {
      return {
        ...state,
        ...event.payload,
        isPublished: false,
        isRegistrationOpen: false,
      };
    }
    case eventTypes.HACKATHON_PUBLISHED: {
      return {
        ...state,
        isPublished: true,
      };
    }
    case eventTypes.HACKATHON_UNPUBLISHED: {
      return {
        ...state,
        isPublished: false,
      };
    }
    case eventTypes.HACKATHON_REGISTRATION_OPEN: {
      return {
        ...state,
        isRegistrationOpen: true,
      };
    }
    case eventTypes.HACKATHON_REGISTRATION_CLOSED: {
      return {
        ...state,
        isRegistrationOpen: false,
      };
    }
    default: return state;
  }
};

module.exports = (events, state = initState) => {
  const view = events.reduce(reducer, state);
  return view;
};

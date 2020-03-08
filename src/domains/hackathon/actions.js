const { commandTypes, eventTypes } = require('./types');

module.exports = {
  [commandTypes.CREATE_HACKATHON]: (state, payload) => {
    if (!payload.name) throw new Error('payload.name is missing');
    if (!payload.location) throw new Error('payload.location is missing');
    if (!payload.startDate) throw new Error('payload.startDate is missing');
    if (!payload.endDate) throw new Error('payload.endDate is missing');
    return [
      {
        type: eventTypes.HACKATHON_CREATED,
        payload: {
          name: payload.name,
          location: payload.location,
          startDate: payload.startDate,
          endDate: payload.endDate,
        },
      },
    ];
  },
  [commandTypes.PUBLISH_HACKATHON]: (state) => {
    if (state.isPublished) throw new Error('Hackathon is already published.');
    return [
      {
        type: eventTypes.HACKATHON_PUBLISHED,
      },
    ];
  },
  [commandTypes.UNPUBLISH_HACKATHON]: (state) => {
    if (!state.isPublished) throw new Error('Hackathon is already unpublished.');
    return [
      {
        type: eventTypes.HACKATHON_UNPUBLISHED,
      },
    ];
  },
  [commandTypes.OPEN_HACKATHON_REGISTRATION]: () => [
    {
      type: eventTypes.HACKATHON_REGISTRATION_OPEN,
    },
  ],
  [commandTypes.CLOSE_HACKATHON_REGISTRATION]: () => [
    {
      type: eventTypes.HACKATHON_REGISTRATION_CLOSED,
    },
  ],
  [commandTypes.UPDATE_HACKATHON_DETAILS]: (state, payload) => [
    {
      type: eventTypes.HACKATHON_DETAILS_UPDATED,
      payload: {
        name: payload.name,
        location: payload.location,
        startDate: payload.startDate,
        endDate: payload.endDate,
      },
    },
  ],
};

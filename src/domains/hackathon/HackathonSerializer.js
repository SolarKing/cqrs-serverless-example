const { Serializer } = require('jsonapi-serializer');

const HackathonSerializer = new Serializer('hackathon', {
  attributes: [
    'name', 'isPublished', 'location',
    'startDate', 'endDate', 'isRegistrationOpen',
  ],
  pluralizeType: false,
});

module.exports = HackathonSerializer;

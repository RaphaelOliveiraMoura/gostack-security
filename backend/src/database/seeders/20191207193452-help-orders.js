require('dotenv').config();
const faker = require('faker');

const TOTAL_OF_FAKE_DATA = process.env.FAKE_DATA === 'true' ? 100 : 0;

const fakeData = Array(TOTAL_OF_FAKE_DATA)
  .fill(0)
  .map((_, index) => ({
    student_id: faker.random.number({ min: 1, max: 100 }),
    question: faker.lorem.sentences(4),
    answer: index % 2 ? faker.lorem.sentences(4) : null,
    answer_at: index % 2 ? new Date() : null,
    created_at: new Date(),
    updated_at: new Date(),
  }));

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'help_orders',
      [
        {
          student_id: 1,
          question: 'Como faço para baixar o aplicativo gympoint para android?',
          answer: null,
          answer_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...fakeData,
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('help_orders', null, {});
  },
};

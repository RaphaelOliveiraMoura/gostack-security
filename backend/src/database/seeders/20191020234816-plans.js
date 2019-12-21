require('dotenv').config();
const faker = require('faker');

const TOTAL_OF_FAKE_DATA = process.env.FAKE_DATA === 'true' ? 10 : 0;

const fakeData = Array(TOTAL_OF_FAKE_DATA)
  .fill(0)
  .map(() => ({
    title: faker.commerce.productAdjective() + faker.commerce.productMaterial(),
    duration: faker.random.number({ min: 1, max: 24 }),
    price: faker.random.number({ min: 0, max: 500, precision: 0.01 }),
    created_at: new Date(),
    updated_at: new Date(),
  }));

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Start',
          duration: 1,
          price: 129,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Gold',
          duration: 3,
          price: 109,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Diamond',
          duration: 6,
          price: 89,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...fakeData,
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('plans', null, {});
  },
};

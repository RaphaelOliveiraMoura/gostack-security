require('dotenv').config();
const faker = require('faker');

const TOTAL_OF_FAKE_DATA = process.env.FAKE_DATA === 'true' ? 100 : 0;

const fakeData = Array(TOTAL_OF_FAKE_DATA)
  .fill(0)
  .map(() => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    birth: faker.date.between('1970-01-01', '2004-01-01'),
    weigth: faker.random.number({ min: 30, max: 160 }),
    height: faker.random.number({ min: 1.5, max: 2, precision: 0.01 }),
    created_at: new Date(),
    updated_at: new Date(),
  }));

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Raphael de Oliveira Moura',
          email: 'raphael@gmail.com',
          birth: '1999-08-26',
          weigth: 70,
          height: 1.72,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...fakeData,
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('students', null, {});
  },
};

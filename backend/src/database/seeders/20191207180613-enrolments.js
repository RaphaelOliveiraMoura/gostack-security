require('dotenv').config();
const faker = require('faker');

const TOTAL_OF_FAKE_DATA = process.env.FAKE_DATA === 'true' ? 100 : 0;

const fakeData = Array(TOTAL_OF_FAKE_DATA)
  .fill(0)
  .map(() => ({
    student_id: faker.random.number({ min: 1, max: 100 }),
    plan_id: faker.random.number({ min: 1, max: 10 }),
    price: faker.random.number({ min: 0, max: 500, precision: 0.01 }),
    start_date: faker.date.between('2018-01-01', '2021-01-01'),
    end_date: faker.date.between('2021-01-01', '2022-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  }));

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'enrolments',
      [
        {
          student_id: 1,
          plan_id: 2,
          price: 327,
          start_date: new Date('2019-12-08'),
          end_date: new Date('2020-03-08'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...fakeData,
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('enrolments', null, {});
  },
};

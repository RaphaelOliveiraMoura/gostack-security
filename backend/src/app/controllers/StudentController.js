import { Op } from 'sequelize';
import Student from '~/app/models/Student';

class StudentController {
  async index(request, response) {
    const { page = 1, per_page = 5, q = '' } = request.query;

    const { rows: students, count } = await Student.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
      offset: (page - 1) * per_page,
      limit: per_page,
      order: [['updated_at', 'DESC']],
    });

    return response
      .set({ total_pages: Math.ceil(count / per_page) })
      .json(students);
  }

  async show(request, response) {
    const student = await Student.findByPk(request.params.id);
    return response.json(student);
  }

  async store(request, response) {
    const student = await Student.create(request.body);
    return response.status(201).json(student);
  }

  async update(request, response) {
    const { student } = request;
    const { name, email, age, birth, weigth, height } = await student.update(
      request.body
    );
    response.json({ name, email, age, birth, weigth, height });
  }

  async destroy(request, response) {
    const { id } = request.params;
    await Student.destroy({ where: { id } });
    response.json({ message: 'Student deleted' });
  }
}

export default new StudentController();

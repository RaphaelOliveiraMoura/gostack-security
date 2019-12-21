import Queue from '~/lib/Queue';
import EnrolmentMail from '~/app/jobs/EnrolmentMail';
import Enrolment from '~/app/models/Enrolment';

class EnrolmentController {
  async index(request, response) {
    const { page = 1, per_page = 5 } = request.query;

    const { rows: enrolments, count } = await Enrolment.findAndCountAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        { association: 'student', attributes: ['id', 'name', 'email'] },
        {
          association: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
      offset: (page - 1) * per_page,
      limit: per_page,
      order: [['updated_at', 'DESC']],
    });

    return response
      .set({ total_pages: Math.ceil(count / per_page) })
      .json(enrolments);
  }

  async show(request, response) {
    const { id } = request.params;

    const enrolment = await Enrolment.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        { association: 'student', attributes: ['id', 'name', 'email'] },
        {
          association: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return response.json(enrolment);
  }

  async store(request, response) {
    const { start_date, plan_id, student_id } = request.body;
    const { plan, end_date } = request;
    const price = plan.price * plan.duration;

    const { id } = await Enrolment.create({
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    });

    const enrolment = await Enrolment.findByPk(id, {
      include: ['student', 'plan'],
    });

    await Queue.add(EnrolmentMail.key, {
      enrolment,
    });

    return response.json(enrolment);
  }

  async update(request, response) {
    const { id: student_id } = request.student;
    const { id: plan_id } = request.plan;
    const { enrolment, end_date } = request;
    const { start_date } = request.body;

    await enrolment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
    });

    return response.json(enrolment);
  }

  async delete(request, response) {
    const { id } = request.params;
    await Enrolment.destroy({ where: { id } });
    return response.json({ message: 'Enrolment successfully canceled' });
  }
}

export default new EnrolmentController();

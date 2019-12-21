import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '~/app/models/Checkin';
import Student from '~/app/models/Student';

class CheckinValidator {
  async index(request, response, next) {
    const student = await Student.findByPk(request.params.studentId);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    return next();
  }

  async store(request, response, next) {
    const lastDate = subDays(new Date(), 7);

    const student = await Student.findByPk(request.params.studentId);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    const studentCheckins = await Checkin.count({
      where: {
        student_id: request.params.studentId,
        created_at: {
          [Op.between]: [lastDate, new Date()],
        },
      },
    });

    if (studentCheckins >= 7) {
      return response
        .status(400)
        .json({ error: 'You cannot make more then 7 checkins per week' });
    }

    return next();
  }
}

export default new CheckinValidator();

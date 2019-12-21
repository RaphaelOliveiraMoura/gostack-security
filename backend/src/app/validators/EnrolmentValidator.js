import * as Yup from 'yup';
import { Op } from 'sequelize';
import { addMonths, parseISO, startOfDay, isBefore } from 'date-fns';
import Enrolment from '~/app/models/Enrolment';
import Plan from '~/app/models/Plan';
import Student from '~/app/models/Student';

class EnrolmentValidator {
  async store(request, response, next) {
    /**
     * Check body formmat
     */
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    /**
     * Check student exists
     */
    const student = await Student.findByPk(request.body.student_id);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    /**
     * Check plan exists
     */
    const plan = await Plan.findByPk(request.body.plan_id);

    if (!plan) {
      return response.status(400).json({ error: 'Plan does not exists' });
    }

    request.plan = plan;

    /**
     * Check if date is after today
     */

    const start_date = parseISO(request.body.start_date);
    const end_date = addMonths(start_date, plan.duration);

    if (isBefore(start_date, new Date())) {
      return response
        .status(400)
        .json({ error: 'You cannot enrolment a student in a past date' });
    }

    /**
     * Check student is already registered in the plan
     */

    const studentAlreadyEnrolmented = await Enrolment.findOne({
      where: {
        student_id: request.body.student_id,
        plan_id: request.body.plan_id,
        [Op.or]: [
          {
            start_date: {
              [Op.between]: [startOfDay(start_date), startOfDay(end_date)],
            },
          },
          {
            end_date: {
              [Op.between]: [startOfDay(start_date), startOfDay(end_date)],
            },
          },
        ],
      },
    });

    if (studentAlreadyEnrolmented) {
      return response
        .status(400)
        .json({ error: 'Student already in a plan in this range date' });
    }

    request.end_date = end_date;

    return next();
  }

  async update(request, response, next) {
    /**
     * Check body formmat
     */
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      student_id: Yup.number(),
      start_date: Yup.date(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    /**
     * Check enrolment exists
     */
    const enrolment = await Enrolment.findByPk(request.params.id, {
      include: ['student', 'plan'],
    });

    if (!enrolment) {
      return response.status(400).json({ error: 'Enrolment does not exists' });
    }

    request.enrolment = enrolment;

    /**
     * Check student exists
     */
    const student = request.body.student_id
      ? await Student.findByPk(request.body.student_id)
      : enrolment.student;

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    request.student = student;

    /**
     * Check plan exists
     */
    const plan = request.body.plan_id
      ? await Plan.findByPk(request.body.plan_id)
      : enrolment.plan;

    if (!plan) {
      return response.status(400).json({ error: 'Plan does not exists' });
    }

    request.plan = plan;

    /**
     * Check if date is after today
     */

    if (request.body.start_date) {
      const start_date = parseISO(request.body.start_date);
      const end_date = addMonths(start_date, plan.duration);

      if (isBefore(start_date, new Date())) {
        return response
          .status(400)
          .json({ error: 'You cannot enrolment a student in a past date' });
      }

      /**
       * Check student is already registered in the plan
       */

      const studentAlreadyEnrolmented = await Enrolment.findOne({
        where: {
          id: { [Op.ne]: request.params.id },
          student_id: enrolment.student.id,
          plan_id: plan.id,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [startOfDay(start_date), startOfDay(end_date)],
              },
            },
            {
              end_date: {
                [Op.between]: [startOfDay(start_date), startOfDay(end_date)],
              },
            },
          ],
        },
      });

      if (studentAlreadyEnrolmented) {
        return response
          .status(400)
          .json({ error: 'Student already in a plan in this range date' });
      }

      request.end_date = end_date;
    }

    return next();
  }

  async delete(request, response, next) {
    const enrolmentExists = await Enrolment.findByPk(request.params.id);
    if (!enrolmentExists) {
      return response.status(400).json({ error: 'Enrolment does not exists' });
    }
    return next();
  }
}

export default new EnrolmentValidator();

import { Op } from 'sequelize';
import * as Yup from 'yup';

import Student from '~/app/models/Student';

class StudentValidator {
  async store(request, response, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      birth: Yup.date()
        .required()
        .max(new Date()),
      weigth: Yup.number()
        .required()
        .min(0),
      height: Yup.number()
        .required()
        .min(0),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    const emailAlreadyInUse = await Student.findOne({
      where: { email: request.body.email },
    });

    if (emailAlreadyInUse) {
      return response.status(400).json({ error: 'Student already exists' });
    }

    return next();
  }

  async update(request, response, next) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      birth: Yup.date().max(new Date()),
      weigth: Yup.number().min(0),
      height: Yup.number().min(0),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    const { id } = request.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    request.student = student;

    if (request.body.email) {
      const studentAlreadyExists = await Student.findOne({
        where: { email: request.body.email, id: { [Op.ne]: id } },
      });

      if (studentAlreadyExists) {
        return response.status(400).json({
          error: 'You cannot set this email, because it already in use',
        });
      }
    }

    return next();
  }
}

export default new StudentValidator();

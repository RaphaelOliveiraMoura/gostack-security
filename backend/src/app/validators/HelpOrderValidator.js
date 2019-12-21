import Student from '~/app/models/Student';

class HelpOrderValidator {
  async index(request, response, next) {
    const student = await Student.findByPk(request.params.studentId);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    return next();
  }

  async store(request, response, next) {
    const student = await Student.findByPk(request.params.studentId);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exists' });
    }

    if (!request.body.question) {
      return response
        .status(400)
        .json({ error: 'You need to pass question field in request body' });
    }

    return next();
  }
}

export default new HelpOrderValidator();

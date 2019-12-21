import Checkin from '~/app/models/Checkin';

class CheckinController {
  async index(request, response) {
    const checkins = await Checkin.findAll({
      where: { student_id: request.params.studentId },
      include: ['student'],
      order: [['created_at', 'DESC']],
    });
    return response.json(checkins);
  }

  async store(request, response) {
    const checkin = await Checkin.create({
      student_id: request.params.studentId,
    });
    return response.json(checkin);
  }
}

export default new CheckinController();

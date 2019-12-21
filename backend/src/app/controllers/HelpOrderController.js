import HelpOrder from '~/app/models/HelpOrder';

class HelpOrderController {
  async index(request, response) {
    const { page = 1, per_page = 5 } = request.query;

    const { rows: helpOrders, count } = await HelpOrder.findAndCountAll({
      include: [
        { association: 'student', attributes: ['id', 'name', 'email'] },
      ],
      where: { student_id: request.params.studentId },
      offset: (page - 1) * per_page,
      limit: per_page,
      order: [['updated_at', 'DESC']],
    });

    return response
      .set({ total_pages: Math.ceil(count / per_page) })
      .json(helpOrders);
  }

  async store(request, response) {
    const { question } = request.body;
    const helpOrder = await HelpOrder.create({
      student_id: request.params.studentId,
      question,
    });
    return response.json(helpOrder);
  }
}

export default new HelpOrderController();

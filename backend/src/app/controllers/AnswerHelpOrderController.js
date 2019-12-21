import Queue from '~/lib/Queue';
import AnswerHelpOrderMail from '~/app/jobs/AnswerHelpOrderMail';
import HelpOrder from '~/app/models/HelpOrder';

class AnswerHelpOrderController {
  async index(request, response) {
    const { page = 1, per_page = 5 } = request.query;

    const { rows: helpOrders, count } = await HelpOrder.findAndCountAll({
      include: [
        { association: 'student', attributes: ['id', 'name', 'email'] },
      ],
      where: { answer: null },
      offset: (page - 1) * per_page,
      limit: per_page,
      order: [['updated_at', 'DESC']],
    });

    return response
      .set({ total_pages: Math.ceil(count / per_page) })
      .json(helpOrders);
  }

  async store(request, response) {
    const { helpOrder } = request;

    await helpOrder.update({
      answer: request.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerHelpOrderMail.key, {
      helpOrder,
    });

    return response.json(helpOrder);
  }
}

export default new AnswerHelpOrderController();

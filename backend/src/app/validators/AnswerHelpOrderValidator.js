import HelpOrder from '~/app/models/HelpOrder';

class AnswerHelpOrderValidator {
  async store(request, response, next) {
    const helpOrder = await HelpOrder.findByPk(request.params.id, {
      include: ['student'],
    });

    if (!helpOrder) {
      return response.status(400).json({ error: 'Invalid help order' });
    }

    if (helpOrder.answer) {
      return response
        .status(400)
        .json({ error: 'Help order already answered' });
    }

    request.helpOrder = helpOrder;

    if (!request.body.answer) {
      return response
        .status(400)
        .json({ error: 'You need to pass answer field in request body' });
    }

    return next();
  }
}

export default new AnswerHelpOrderValidator();

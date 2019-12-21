import Mail from '~/lib/Mail';

class AnswerHelpOrderMail {
  get key() {
    return 'AnswerHelpOrderMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    console.log('A fila de pedido de auxílio executou ...');

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Pedido de ajuda respondido 🚀',
      template: 'answer-help-order',
      context: {
        logo_source: `${process.env.APP_URL}/public/gympoint-logo.png`,
        name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new AnswerHelpOrderMail();

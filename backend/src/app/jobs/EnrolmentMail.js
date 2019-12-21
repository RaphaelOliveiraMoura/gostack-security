import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '~/lib/Mail';

class EnrolmentMail {
  get key() {
    return 'EnrolmentMail';
  }

  async handle({ data }) {
    const { enrolment } = data;

    console.log('A fila de matrícula executou ...');

    await Mail.sendMail({
      to: `${enrolment.student.name} <${enrolment.student.email}>`,
      subject: 'Matrícula realizada 🚀',
      template: 'enrolment',
      context: {
        logo_source: `${process.env.APP_URL}/public/gympoint-logo.png`,
        name: enrolment.student.name,
        plan: enrolment.plan.title,
        duration: `${enrolment.plan.duration} meses`,
        price: enrolment.price,
        start_date: format(
          parseISO(enrolment.start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrolmentMail();

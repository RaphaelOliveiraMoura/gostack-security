import * as Yup from 'yup';
import Plan from '~/app/models/Plan';

class PlanValidator {
  async store(request, response, next) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .min(0),
      price: Yup.number()
        .required()
        .min(0),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    const planExists = await Plan.findOne({
      where: { title: request.body.title },
    });

    if (planExists) {
      return response.status(400).json({ error: 'Plan already exists' });
    }

    return next();
  }

  async update(request, response, next) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().min(0),
      price: Yup.number().min(0),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch ({ errors }) {
      return response.status(400).json({ errors });
    }

    const plan = await Plan.findOne({
      where: { title: request.body.title },
    });

    if (!plan) {
      return response.status(400).json({ error: 'Plan does not exists' });
    }

    request.plan = plan;

    return next();
  }

  async delete(request, response, next) {
    const planExists = await Plan.findOne({
      where: { id: request.params.id },
    });

    if (!planExists) {
      return response.status(400).json({ error: 'Plan does not exists' });
    }

    return next();
  }
}

export default new PlanValidator();

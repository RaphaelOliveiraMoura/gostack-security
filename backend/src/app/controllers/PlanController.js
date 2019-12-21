import { Op } from 'sequelize';
import Plan from '~/app/models/Plan';

class PlanController {
  async index(request, response) {
    const { page = 1, per_page = 5, q = '', paginate = 'true' } = request.query;

    const usePaginate = paginate === 'true';

    const offset = usePaginate ? (page - 1) * per_page : null;
    const limit = usePaginate ? per_page : null;

    const { rows: plans, count } = await Plan.findAndCountAll({
      where: {
        [Op.or]: [{ title: { [Op.iLike]: `%${q}%` } }],
      },
      offset,
      limit,
      order: [['updated_at', 'DESC']],
    });

    const total_pages = usePaginate ? Math.ceil(count / per_page) : null;

    return response.set({ total_pages }).json(plans);
  }

  async show(request, response) {
    const plans = await Plan.findByPk(request.params.id);
    return response.json(plans);
  }

  async store(request, response) {
    const plan = await Plan.create(request.body);
    return response.json(plan);
  }

  async update(request, response) {
    const { plan } = request;

    await plan.update(request.body);

    return response.json(plan);
  }

  async delete(request, response) {
    const { id } = request.params;

    await Plan.destroy({ where: { id } });

    return response.send();
  }
}

export default new PlanController();

import { Router } from 'express';

import authMiddleware from '~/app/middlewares/auth';

import SessionController from '~/app/controllers/SessionController';
import StudentController from '~/app/controllers/StudentController';
import PlanController from '~/app/controllers/PlanController';
import EnrolmentController from '~/app/controllers/EnrolmentController';
import CheckinController from '~/app/controllers/CheckinController';
import HelpOrderController from '~/app/controllers/HelpOrderController';
import AnswerHelpOrderController from '~/app/controllers/AnswerHelpOrderController';

import SessionValidator from '~/app/validators/SessionValidator';
import StudentValidator from '~/app/validators/StudentValidator';
import PlanValidator from '~/app/validators/PlanValidator';
import EnrolmentValidator from '~/app/validators/EnrolmentValidator';
import CheckinValidator from '~/app/validators/CheckinValidator';
import HelpOrderValidator from '~/app/validators/HelpOrderValidator';
import AnswerHelpOrderValidator from '~/app/validators/AnswerHelpOrderValidator';

const routes = new Router();

/** Session */
routes.post('/sessions', SessionValidator.store, SessionController.store);

/** Checkin */
routes.get(
  '/students/:studentId/checkins',
  CheckinValidator.index,
  CheckinController.index
);
routes.post(
  '/students/:studentId/checkins',
  CheckinValidator.store,
  CheckinController.store
);

/** Help Order */
routes.get(
  '/students/:studentId/help-orders',
  HelpOrderValidator.index,
  HelpOrderController.index
);
routes.post(
  '/students/:studentId/help-orders',
  HelpOrderValidator.store,
  HelpOrderController.store
);

/** Student */
routes.get('/students/:id', StudentController.show);

routes.use(authMiddleware);

/** Student */
routes.get('/students', StudentController.index);
routes.post('/students', StudentValidator.store, StudentController.store);
routes.put('/students/:id', StudentValidator.update, StudentController.update);
routes.delete('/students/:id', StudentController.destroy);

/** Plan */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanValidator.store, PlanController.store);
routes.put('/plans/:id', PlanValidator.update, PlanController.update);
routes.delete('/plans/:id', PlanValidator.delete, PlanController.delete);

/** Enrolment */
routes.get('/enrolments', EnrolmentController.index);
routes.get('/enrolments/:id', EnrolmentController.show);
routes.post('/enrolments', EnrolmentValidator.store, EnrolmentController.store);
routes.put(
  '/enrolments/:id',
  EnrolmentValidator.update,
  EnrolmentController.update
);
routes.delete(
  '/enrolments/:id',
  EnrolmentValidator.delete,
  EnrolmentController.delete
);

/** Help Order */
routes.get('/help-orders', AnswerHelpOrderController.index);
routes.post(
  '/help-orders/:id/answer',
  AnswerHelpOrderValidator.store,
  AnswerHelpOrderController.store
);

export default routes;

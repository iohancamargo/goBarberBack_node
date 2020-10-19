import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// SoC: Separation of Concerns - Separação de preocupações| rota, repositorio...
// DTO - Data transfer object - transferir um objeto a outra class
// Rota: recebe a request, chama o service, devolve a reposta

// appointmentsRouter.get('/', async (request, response) => {
//     const appointments = await appointmentsRepository.find();
//     return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;

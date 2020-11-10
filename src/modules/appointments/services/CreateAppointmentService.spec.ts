import AppError from '@shared/errors/AppErrors';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('sould be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123123',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123');
    });

    it('sould not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 10, 9, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123123',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

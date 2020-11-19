import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('sould be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        expect(user).toHaveProperty('id');
        expect(user.email).toBe('zesilva@example.com');
    });

    it('sould be not be able to create a new user with same email from another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        expect(
            createUser.execute({
                name: 'Ze Silva',
                email: 'zesilva@example.com',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

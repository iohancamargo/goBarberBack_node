import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('sould be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        const response = await authenticateUser.execute({
            email: 'zesilva@example.com',
            password: '1234',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('sould not be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        expect(
            authenticateUser.execute({
                email: 'zesilva@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('sould not be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        expect(
            authenticateUser.execute({
                email: 'zesilva@example.com',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import AppError from '@shared/errors/AppErrors';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('sould be able to authenticate', async () => {
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
        await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        await expect(
            authenticateUser.execute({
                email: 'zesilva@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('sould not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'zesilva@example.com',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import AppError from '@shared/errors/AppErrors';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('sould be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        expect(user).toHaveProperty('id');
        expect(user.email).toBe('zesilva@example.com');
    });

    it('sould be not be able to create a new user with same email from another', async () => {
        await createUser.execute({
            name: 'Ze Silva',
            email: 'zesilva@example.com',
            password: '1234',
        });

        await expect(
            createUser.execute({
                name: 'Ze Silva',
                email: 'zesilva@example.com',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

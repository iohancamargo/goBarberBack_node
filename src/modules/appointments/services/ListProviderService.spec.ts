import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeCacheProvider: FakeCacheProvider;
let listProviderService: ListProviderService;
let fakeUsersRepository: FakeUsersRepository;

describe('listProviders', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeUsersRepository = new FakeUsersRepository();
        listProviderService = new ListProviderService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list the providers', async () => {
        const userUm = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const userDois = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'johndotre@example.com',
            password: '123456',
        });
        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456',
        });
        const providers = await listProviderService.execute({
            user_id: loggedUser.id,
        });
        expect(providers).toEqual([userUm, userDois]);
    });
});

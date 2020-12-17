// import AppError from '@shared/errors/AppErrors';
import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('sould be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze Silva',
            email: 'zesilva@gmail.com',
            password: '1234',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '112233',
            token,
        });

        const updtUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('112233');
        expect(updtUser?.password).toBe('112233');
    });

    it('sould not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('sould not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('sould not be able to reset password if passed more than two hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze Silva',
            email: 'zesilva@gmail.com',
            password: '1234',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '112233',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

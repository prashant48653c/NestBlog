import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { LocalStrategy } from '../modules/auth/strageties/local.stragety';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const user = { id: 'userId', email: 'test@example.com' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      expect(await strategy.validate('test@example.com', 'password')).toEqual(user);
    });

    it('should throw an BadRequestException if validation fails', async () => {
       
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

     const result=strategy.validate("test@mail.com","password")
     expect(result).rejects.toThrow(new BadRequestException({messege:"Invalid Credentials"}))
    });
  });
});

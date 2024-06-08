import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { User } from 'src/auth/schema/user.schema';

describe('AuthorController', () => {
  let authorController: AuthorController;
  let authorService: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: {
            getUserInfo: jest.fn(),
            updateUserInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    authorController = module.get<AuthorController>(AuthorController);
    authorService = module.get<AuthorService>(AuthorService);
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      const userId = '123';
      const mockUser: User = {
        _id: userId,
        username: 'testUser',
        desc: 'description',
        refreshToken:'dfd',
        email:'test@gmail.com',
        password:'aaaaaa'
      };

      jest.spyOn(authorService, 'getUserInfo').mockResolvedValue(mockUser);

      const result = await authorController.getUserInfo(userId);
      expect(result).toEqual(mockUser);
      expect(authorService.getUserInfo).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUser', () => {
    it('should update user info', async () => {
      const updateUserDto = {
        id: '123',
        username: 'updatedUser',
        desc: 'updatedDescription',
      };

      const mockUpdatedUser = {
        ...updateUserDto,
      };

      jest.spyOn(authorService, 'updateUserInfo').mockResolvedValue(mockUpdatedUser);

      const result = await authorController.updateUser(updateUserDto);
      expect(result).toEqual(mockUpdatedUser);
      expect(authorService.updateUserInfo).toHaveBeenCalledWith(updateUserDto);
    });
  });
});

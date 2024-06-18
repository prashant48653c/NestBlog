import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { User } from '../auth/schema/user.schema';

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
            updatePP:jest.fn()
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
        password:'aaaaaa',
        profilePic:"i.png"
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

  describe('updatePP',()=>{
    it('should update the user profile picture',async()=>{
      let file:Express.Multer.File = {
        fieldname: 'fileUpload',
        originalname: 'example.txt',
        destination: 'uploads/',
        filename: 'example-12345.txt',
        mimetype: 'text/plain',
        path: 'uploads/example-12345.txt',
        size: 2323,
        stream: null,  
        buffer: Buffer.from('Example file content'),
        encoding:'dfdsf'
      };
      
     
      let _id='123'
      let mockUpdatedUser:User = {
        _id: '123',
        username: 'updatedUser',
        desc: 'updatedDescription',
        profilePic:'i.png',
        email:'ac@gmail.com',
        password:'aaaaaa',
        refreshToken:'sdfsdfd'
      };
      jest.spyOn(authorController, 'updatePP').mockResolvedValue(mockUpdatedUser);

      const result = await authorController.updatePP(file,_id);
      expect(result).toBe(mockUpdatedUser);
      expect(authorController.updatePP).toHaveBeenCalledWith(file,_id);
   
      
    })

     
  })



});

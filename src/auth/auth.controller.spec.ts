import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./schema/user.schema";
import { loginDto } from "./dto/login.dto";
import { signUpDto } from "./dto/signup.dto";
import { loginType, returnedTokenType, signUpType, tokensType } from "./types/helper";
import { createMocks } from 'node-mocks-http';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    let mockUser: User = {
        _id: '12345',
        username: 'testuser',
        email: 'test@example.com',
        desc: 'Test user description',
        password: 'password',
        refreshToken: 'slfjsdfe3d',
        profilePic: 'i.png'
    };

    let mockSignUpDto: signUpDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
    let mockLoginDto: loginDto = { email: 'test@example.com', password: 'password' };
    let mockReturnTokens: returnedTokenType = { accessToken: 'access_token', refreshToken: 'refresh_token' };
    let mockLoginType: loginType = { user: mockUser, token: 'access_token', refreshToken: 'refresh_token' };
    let mockSignUpType: signUpType = { token: 'access_token', refreshToken: 'refresh_token' };

    const mockAuthService = {
        signUp: jest.fn(),
        login: jest.fn(),
        refreshTokens: jest.fn(),
        logOut: jest.fn()
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        authController = moduleRef.get<AuthController>(AuthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", async () => {
        expect(authService).toBeDefined();
        expect(authController).toBeDefined();
    });

    describe('signUp', () => {
        it('should create a new user', async () => {
            mockAuthService.signUp.mockResolvedValue(mockSignUpType);
            const result = await authController.signUp(mockSignUpDto);
            expect(result).toBe(mockSignUpType);
            expect(mockAuthService.signUp).toHaveBeenCalledWith(mockSignUpDto);
        });
    });

    describe('loginUser', () => {
        it('should login a user', async () => {
            mockAuthService.login.mockResolvedValue(mockLoginType);
            const req = { user: mockUser };
            const result = await authController.loginUser(req);
            expect(result).toBe(mockLoginType);
            expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
        });
    });

    describe('refreshTokens', () => {
        it('should return refresh and access tokens', async () => {
            mockAuthService.refreshTokens.mockResolvedValue(mockReturnTokens);
            const result = await authController.refreshTokens({ REFRESHTOKEN: 'refresh_token' });
            expect(result).toBe(mockReturnTokens);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith({ REFRESHTOKEN: 'refresh_token' });
        });
    });

    describe('logOut', () => {
        it("should log out the user", async () => {
            const { req, res } = createMocks();
            const refreshToken = '34ft';
            res.clearCookie = jest.fn();
            mockAuthService.logOut.mockResolvedValue({ message: 'Successfully logged out' });

            const result = await authController.logOut(refreshToken, res);

            expect(mockAuthService.logOut).toHaveBeenCalledWith(refreshToken);
            expect(res.clearCookie).toHaveBeenCalledWith('accesstoken', { path: '/' });
            expect(res.clearCookie).toHaveBeenCalledWith('refreshtoken', { path: '/' });
          
        });
    });
});

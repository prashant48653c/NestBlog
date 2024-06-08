import { Test } from "@nestjs/testing";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { Blog } from "./schema/blog.schema";
import { AuthController } from "src/auth/auth.controller";
import { createBlogDto } from "./dto/create-blog.dto";
import { User } from "../auth/schema/user.schema";
import { updateUserDto } from "src/author/dto/update.user.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

describe('BlogController', () => {
    let blogController: BlogController;
    let blogService: BlogService;
    const mockBlog: Blog = {
        _id: '660d47933aeebfc7846b182e',
        head: "Sample Blog Title",
        desc: "This is a sample blog description.",
        profilePic: "url_to_profile_picture.jpg",
        blogImg: "url_to_blog_image.jpg",
        user: {
          _id: '12345',
          username: 'testuser',
          email: 'test@example.com',
          desc: 'Test user description',
          password: 'password',
          refreshToken:'dse3f3'
          
        },
        tags: ['tag1', 'tag2'],
      };
    let mockUser:User;
    let blogDto:createBlogDto

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [BlogController],
            providers: [{
                provide: BlogService,
                useValue: {
                    getAllBlogs: jest.fn(),
                    createBlog: jest.fn(),
                    findSingleBlog:jest.fn(),
                    update:jest.fn(),
                    deleteTheBlog:jest.fn()
                }
            }],
        }).compile();

        blogController = moduleRef.get<BlogController>(BlogController)
        blogService = moduleRef.get<BlogService>(BlogService)
    })

    it('should be defined', () => {
        expect(blogController).toBeDefined();
    });

    describe('getAllBlogs', () => {
        it("should return all the blog based on query", async () => {
            let mockAllBlog: Blog[];
            let query = {}
            jest.spyOn(blogController, 'getAllBlogs').mockResolvedValue(mockAllBlog)
            const result = await blogController.getAllBlogs(query)
            expect(result).toBe(mockAllBlog)
        })
    })

    describe('createBlog', () => { 
       
        it("should create blog",async()=>{
           
            jest.spyOn(blogController,'createBlog').mockResolvedValue(mockBlog)
            const result=await blogController.createBlog(blogDto,mockUser)
            expect(result).toBe(mockBlog)
        })

       
     })

     describe('findSingleBlog',()=>{
        it("should return a single blog",async()=>{
            jest.spyOn(blogController,'findSingleBlog').mockResolvedValue(mockBlog)
            const result=await blogController.findSingleBlog(mockBlog._id)
            expect(result).toBe(mockBlog)
            
        })


     })

     describe('update',()=>{
        it("should update the blog",async()=>{
            jest.spyOn(blogController,'update').mockResolvedValue(mockBlog)
            let mockUpdateBlog:UpdateBlogDto
            let id='aaa'
            const result=await blogController.update(id,mockUpdateBlog)
            expect(result).toBe(mockBlog)


        })
     })

     describe('deleteTheBlog',()=>{
        it('should delete the blog',async()=>{
            jest.spyOn(blogController,'deleteTheBlog').mockResolvedValue(mockBlog)
            let id='aaa'
            const result=await blogController.deleteTheBlog(id)
            expect(result).toBe(mockBlog)
        })
     })


     
})
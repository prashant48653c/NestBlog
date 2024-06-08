import { Test, TestingModule } from "@nestjs/testing";
import { BlogService } from "./blog.service";
import { getModelToken } from "@nestjs/mongoose";
 
import mongoose, { Model } from "mongoose";
import { BadRequestException, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { Blog } from "./schema/blog.schema";
import { User } from "src/auth/schema/user.schema";

 
 
  describe('BlogService', () => {
    let blogService: BlogService;
    let model: Model<Blog>;
  
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
  
    const mockUser: User = {
      _id: '123344345',
      username: 'testusers',
      email: 'test@examples.com',
      desc: 'Test user desscription',
      password: 'passwords',
      refreshToken:'sdfds',
    };
  
    const mockBlogModel = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findOne:jest.fn()
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BlogService,
          {
            provide: getModelToken(Blog.name),
            useValue: mockBlogModel,
          },
        ],
      }).compile();
  
      blogService = module.get<BlogService>(BlogService);
      model = module.get<Model<Blog>>(getModelToken(Blog.name));
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('findAllBlogs', () => {
        it('should return an array of blogs based on provided query parameters', async () => {
          const query = { page: '1', keyword: 'sample', tags: ['tag1', 'tag2'] };
          const expectedBlogs = [mockBlog];
          mockBlogModel.find.mockReturnValue({
            limit: jest.fn().mockReturnValue({
              skip: jest.fn().mockResolvedValue(expectedBlogs),
            }),
          });
      
          const result = await blogService.findAllBlogs(query as any);
          expect(model.find).toHaveBeenCalledWith({
            head: { $regex: 'sample', $options: 'i' },
            tags: { $in: ['tag1', 'tag2'] },
          });
          expect(result).toEqual(expectedBlogs);
        });
      
        it('should return an empty array if no blogs are found', async () => {
          const query = { page: '1', keyword: 'non-existent', tags: ['tag1'] };
          mockBlogModel.find.mockReturnValue({
            limit: jest.fn().mockReturnValue({
              skip: jest.fn().mockResolvedValue([]),
            }),
          });
      
          const result = await blogService.findAllBlogs(query as any);
          expect(model.find).toHaveBeenCalledWith({
            head: { $regex: 'non-existent', $options: 'i' },
            tags: { $in: ['tag1'] },
          });
          expect(result).toEqual([]);
        });
      
        it('should return an array of blogs with default query parameters if none provided', async () => {
          const expectedBlogs = [mockBlog];
          mockBlogModel.find.mockReturnValue({
            limit: jest.fn().mockReturnValue({
              skip: jest.fn().mockResolvedValue(expectedBlogs),
            }),
          });
      
          const result = await blogService.findAllBlogs({} as any);
          expect(model.find).toHaveBeenCalledWith({});
          expect(result).toEqual(expectedBlogs);
        });
      
       
      });
      
  
      describe('createNewBlog', () => {
        it('should create and return a new blog', async () => {
          const blogData = { ...mockBlog, _id: undefined };
          const TrackedBlog = { ...blogData, user: mockUser._id };
          mockBlogModel.create.mockResolvedValue(mockBlog);
      
          const result = await blogService.createNewBlog(blogData as Blog, mockUser);
          expect(model.create).toHaveBeenCalledWith(TrackedBlog);
          expect(result).toEqual(mockBlog);
        });
      
        it('should throw an HttpException if there is an error during blog creation', async () => {
          const blogData = { ...mockBlog, _id: undefined };
          const errorMessage = 'Error creating blog';
          mockBlogModel.create.mockRejectedValue(new Error(errorMessage));
      
          await expect(blogService.createNewBlog(blogData as Blog, mockUser)).rejects.toThrow(HttpException);
        });
      
         
      });
      
  
    describe('findSingleBlog', () => {
      it('should return a blog when found', async () => {
        mockBlogModel.findById.mockResolvedValue(mockBlog);
  
        const result = await blogService.findSingleBlog(mockBlog._id);
        expect(model.findById).toHaveBeenCalledWith(mockBlog._id);
        expect(result).toEqual(mockBlog);
      });
  
      it('should throw BadRequestException for an invalid ID', async () => {
        const invalidId = 'Invalid id';
        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
  
        await expect(blogService.findSingleBlog(invalidId)).rejects.toThrow(BadRequestException);
      });
  
      it('should throw NotFoundException if blog is not found', async () => {
        const validId = mockBlog._id;
        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
        mockBlogModel.findById.mockResolvedValue(null);
  
        await expect(blogService.findSingleBlog(validId)).rejects.toThrow(NotFoundException);
      });
    });
  
    describe('updateBlog', () => {
        it('should update and return the updated blog', async () => {
          const updatedBlog = { ...mockBlog, head: "Updated Title" };
          mockBlogModel.findByIdAndUpdate.mockResolvedValue(updatedBlog);
      
          const result = await blogService.updateBlog(mockBlog._id, updatedBlog as Blog);
          expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBlog._id, updatedBlog, {
            new: true,
            runValidators: true,
          });
          expect(result).toEqual(updatedBlog);
        });
      
        it('should throw a NotFoundException if the blog does not exist', async () => {
          const nonExistentBlogId = 'nonExistentId';
          const updatedBlog = { ...mockBlog, head: "Updated Title" };
          mockBlogModel.findByIdAndUpdate.mockResolvedValue(null);
      
          await expect(blogService.updateBlog(nonExistentBlogId, updatedBlog as Blog)).rejects.toThrow(NotFoundException);
        });
      
     
      });
      
  
      describe('deleteBlog', () => {
        it('should delete and return the deleted blog', async () => {
          mockBlogModel.findByIdAndDelete.mockResolvedValue(mockBlog);
      
          const result = await blogService.deleteBlog(mockBlog._id);
          expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBlog._id);
          expect(result).toEqual(mockBlog);
        });
      
        it('should throw a NotFoundException if the blog does not exist', async () => {
          const nonExistentBlogId = 'nonExistentId';
          mockBlogModel.findByIdAndDelete.mockResolvedValue(null);
      
          await expect(blogService.deleteBlog(nonExistentBlogId)).rejects.toThrow(NotFoundException);
        });
      
         
      });
      
  })

  
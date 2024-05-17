// import { Test, TestingModule } from "@nestjs/testing"
// import { BlogController } from "./blog.controller"
// import { BlogService } from "./blog.service"
// import { getModelToken } from "@nestjs/mongoose"
// import { Blog } from "./schema/blog.schema"
// import mongoose, { Model } from "mongoose"
// import { BadRequestException, NotFoundException } from "@nestjs/common"

// describe('blogService', () => {

//   let model: Model<Blog>;
//   const mockBlogService = {
//     findSingleBlog: jest.fn()
//   }
//   const mockBlog = {

//     _id:
//       '660d47933aeebfc7846b182e',
//     head:
//       "Sample Blog Title",
//     desc:
//       "This is a sample blog description.",
//     profilePic:
//       "url_to_profile_picture.jpg",
//     blogImg:
//       "url_to_blog_image.jpg",
//     authorName:
//       "John Doe"



//   }
//   let blogService: BlogService;
//   beforeEach(async () => {

//     const module: TestingModule = Test.createTestingModule({
//       providers: [
//         BlogService,
//         {
//           provide: getModelToken(Blog.name),
//           useValue: mockBlogService,
//         },
//       ],
//     }).compile()

//     blogService = module.get<BlogService>(BlogService);
//     model = module.get<Model<Blog>>(getModelToken(Blog.name));




//   })

//   describe('findSingleBlog', () => {
//     it('should find the blog with id', async () => {
//       jest.spyOn(model, 'findById').mockResolvedValue(mockBlog)

//       const result = await blogService.findSingleBlog(mockBlog._id)
//       expect(model.findById).toHaveBeenCalledWith(mockBlog._id)
//       expect(result).toEqual(mockBlog)
//     })



//     it('should throw invalid id',async ()=>{
//       const id='Invalid id'
//       const isValidObjectId=jest.spyOn(mongoose,'isValidObjectId').mockReturnValue(false)

//       await expect(blogService.findSingleBlog(id)).rejects.toThrow(BadRequestException)
//     })
    
//   })




// });

import { Query as ExpressQuery } from 'express-serve-static-core'
import { Blog } from '../schema/blog.schema';
 

export class BLOG_UTILITY {
  static async PAGINATE(query:ExpressQuery):Promise<any> {
    const responsePerPage = 3;
    const currentPage: number = Number(query.page) || 1;
    const skip: number = responsePerPage * (currentPage - 1)
    const keywords:any =  {}
    
    if(query.keyword){
    
    keywords.head= {
    $regex: query.keyword as string,
    $options: 'i'
    }
     
    
    }
    if (query.tags) {
    keywords.tags = { $in: query.tags as string[] };
    }
    const blog = await this..find({ ...keywords }).limit(responsePerPage).skip(skip)
    
    return {...keywords,responsePerPage,skip}
  }

  
}

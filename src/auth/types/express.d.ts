import { Request } from 'express';
import { UsersDocument } from 'src/auth/schema/user.schema';
 

declare module 'express' {
  interface Request {
    user?: UsersDocument;
  }
}
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',   
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 10000000,   
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|svg)$/)) {
      cb(new Error('Only JPEG images are allowed!'), false);
    } else {
      cb(null, true);
    }
  }
};

import * as fs from 'fs';
import * as path from 'path';

interface FileObject {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export async function saveBufferAsImage(file: FileObject, uploadDir: string): Promise<string> {
 
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

 
  const filePath = path.join(uploadDir, file.originalname);
  const bufferFile = Buffer.from(file.buffer)
  fs.writeFileSync(filePath, bufferFile);
  console.log(filePath)
  return filePath;
}



 
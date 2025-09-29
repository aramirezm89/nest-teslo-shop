import { v4 as uuid } from 'uuid';

const fileNamerHelper = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  cb(null, `${uuid()}-${file.originalname}`);
};

export default fileNamerHelper;

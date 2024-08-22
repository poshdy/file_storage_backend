import * as Mino from 'minio';

export const minioClient = new Mino.Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET,
  useSSL: false,
});

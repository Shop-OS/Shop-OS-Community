import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ message: 'No file found', status: 400 });

    const fileBuffer = await file.arrayBuffer();
    const fileName = file.name + '-' + Date.now() + '.' + file.type.split('/')[1];
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: new Uint8Array(fileBuffer),
    };

    await s3.send(new PutObjectCommand(uploadParams));
    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName,
      fileType: file.type,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' });
  }
}

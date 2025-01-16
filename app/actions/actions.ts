"use server";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "Missing AWS credentials: Ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set in your environment variables."
  );
}

const client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const saveImageToS3 = async (base64data: string) => {
  if (!base64data) {
    throw new Error("No file is chosen");
  }
  const base64Data = base64data?.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const command = new PutObjectCommand({
    Bucket: "potraits",
    Key: Date.now().toString(),
    Body: buffer,
    ContentType: "image/png",
  });

  const response = await client.send(command);
  return response;
};

async function getObjectsFromBucket() {
  const command = new ListObjectsCommand({ Bucket: "potraits" });
  const { Contents } = await client.send(command);
  return Contents;
}

const fetch_all_images = async (): Promise<string[]> => {
  const contents = await getObjectsFromBucket();
  let preSignedUrlList: string[] = [];
  if (contents) {
    preSignedUrlList = await Promise.all(
      contents.map(async (content) => {
        const getObjectCommand = new GetObjectCommand({
          Bucket: "potraits",
          Key: content.Key,
        });
        const preSignedUrl = await getSignedUrl(client, getObjectCommand, {
          expiresIn: 3600,
        });
        return preSignedUrl;
      })
    );
  }
  return preSignedUrlList;
};
export { saveImageToS3, fetch_all_images };

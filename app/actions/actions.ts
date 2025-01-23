"use server";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";

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

interface preSignedUrlsInterface {
  url: string;
  key: string;
}

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
  revalidatePath("/");
  return response;
};

async function getObjectsFromBucket() {
  const command = new ListObjectsCommand({ Bucket: "potraits" });
  const { Contents } = await client.send(command);
  return Contents;
}

const fetch_all_images = async (): Promise<
  (preSignedUrlsInterface | undefined)[]
> => {
  const contents = await getObjectsFromBucket();
  let preSignedUrlList: (preSignedUrlsInterface | undefined)[] = [];
  if (contents) {
    preSignedUrlList = await Promise.all(
      contents.map(async (content) => {
        if (content.Key) {
          const getObjectCommand = new GetObjectCommand({
            Bucket: "potraits",
            Key: content.Key,
          });
          const preSignedUrl = await getSignedUrl(client, getObjectCommand, {
            expiresIn: 3600,
          });
          return { url: preSignedUrl, key: content.Key };
        }
      })
    );
  }
  return preSignedUrlList;
};

const deleteImage = async (imageKey: string) => {
  try {
    console.log("imageKye", imageKey);
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: "potraits",
      Key: imageKey,
    });
    const data = await client.send(deleteObjectCommand);
    console.log("data after deleting object", data);
    revalidatePath("/");
  } catch (error) {
    console.log("error while deleting image", error);
    throw new Error("failed to delete image");
  }
};

export { saveImageToS3, fetch_all_images, deleteImage };

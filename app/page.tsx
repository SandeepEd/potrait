import Image from "next/image";
import UploadImage from "./components/upload_button";
import { fetch_all_images } from "./utils/actions";

export default async function S3Page() {

  try {
    const images = await fetch_all_images()

    return (
      <main className="flex min-h-screen flex-col p-2">
        <div className="flex flex-row justify-between border-white border-2 rounded-md">
          <div className="font-extrabold text-2xl font-sans p-2 text-center">Potraits</div>
          <UploadImage />
        </div>
        <div className="grid grid-flow-col grid-col-4">
          {images.map((url, index) => (
            <div key={index}>
              <Image className="rounded m-1 transition-property: all; hover:scale-110 duration-300 hover:p-2" src={url} style={{ objectFit: 'fill' }} alt={`Image ${index}`} width="200" height="200" />
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Error loading images.</div>
      </main>
    );
  }
}

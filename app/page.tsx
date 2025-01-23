import Image from "next/image";
import UploadImage from "./components/upload_button";
import { deleteImage, fetch_all_images } from "./actions/actions";
import DeleteImage from "./components/delete_button";
export default async function S3Page() {

  try {
    const data = await fetch_all_images()

    return (
      <main className="flex min-h-screen flex-col p-2">
        <div className="flex flex-row justify-between border-white border-2 mb-3 rounded-md">
          <div className="font-extrabold text-2xl font-sans p-2 text-center">Potraits</div>
          <UploadImage />
        </div>
        <div className="grid grid-cols-6 gap-4">
          {data.map((item) => (
            <div
              key={item?.key}
              className="flex flex-col items-center justify-center overflow-hidden transition-property: all; hover:scale-110 duration-300 hover:p-2"
            >
              {item &&
                item.url &&
                <>
                  <Image
                    className="rounded overflow-hidden"
                    src={item.url}
                    style={{ objectFit: 'cover', width: '100%', height: '100%', overflow: 'hidden' }}
                    alt={`Image ${item.key}`}
                    width="130"
                    height="90" />
                  <DeleteImage
                    imageKey={item.key}
                  />
                </>

              }
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

"use client"
import Image from "next/image";
import { useState } from "react";
import { saveImageToS3 } from "../actions/actions";
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);

    const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0] ? e.target.files[0] : null;
        if (!file) {
            throw new Error('No file has been uploaded')
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64data = reader.result;
            setImage(base64data as string);
        }
    }

    return (
        <div className="flex flex-col m-4">
            <div className="flex flex-row justify-between">
                <div>
                    <label>Upload Image here: </label>
                    <input type="file" onChange={handleLocalImageUpload} />
                </div>
                {
                    image ?
                        <button className="items-end p-4 border-white border-2 rounded-lg" onClick={async () => {
                            await saveImageToS3(image);
                            router.push('/');
                        }}>Upload to S3</button>
                        : null
                }
            </div>
            {image ?
                <div className="flex w-full justify-center"><Image src={image} alt="uploaded image" width={600} height={600} /> </div> :
                null}
        </div>
    );
}
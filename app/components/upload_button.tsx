'use client'
import { useRouter } from "next/navigation";
const UploadImage = () => {
    const router = useRouter()
    return (
        <button onClick={() => router.push('/upload')} className="text-center bg-slate-500 p-2">Upload a new Image
        </button>
    );
}

export default UploadImage;
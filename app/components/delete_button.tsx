'use client'

import { deleteImage } from "../actions/actions";

const DeleteImage = ({ imageKey }: { imageKey: string }) => {
    return (
        <button
            onClick={async() => {
                console.log('function execution', imageKey)
                await deleteImage(imageKey)
            }}
            className="bg-red-400 text-white w-full rounded-b-sm p-2">delete
        </button>
    );
}

export default DeleteImage;
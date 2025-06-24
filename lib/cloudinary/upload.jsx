"use server";
import {v2 as cloudinary} from 'cloudinary';
import toast from 'react-hot-toast';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (image,folder)=>{
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder
        })
        return result.secure_url;
    } catch (error) {
        toast.error("Image upload to cloudinary failed. Please try again.");
    }
} 


export const deleteImage = async (imageUrl) => {
    try {
        
        const urlParts = imageUrl.split('/');
        const fileNameWithExt = urlParts.pop();
        const folderName = urlParts[urlParts.length - 1];
        const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Image deletion from Cloudinary failed. Please try again.");
    }
};

export const updateImage = async (oldImage, newImage, folder) => {
    try {
        if (oldImage) {
            await deleteImage(oldImage);
        }
        return await uploadImage(newImage, folder);
    } catch (error) {
        toast.error("Image update failed. Please try again.");
    }
}

import admin from "firebase-admin";
import {getDownloadURL, getStorage} from "firebase-admin/storage";

class MediaService {

    static getFileFromBucket(fileName) {
        return getStorage().bucket(process.env.STORAGE_BUCKET).file(fileName)

    }
    static async  uploadFileToStorage(buffer, fileName, contentType) {
        try {
            const bucket = admin.storage().bucket();
            const file = bucket.file(fileName);

            // Save the buffer to the file
            await file.save(buffer, {
                contentType: contentType,
                public: true
            });

            // Get the public URL of the uploaded file
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            return publicUrl;
        } catch (error) {
            console.error("Error uploading file to storage:", error);
            throw error;
        }
    }


    static async getPublicViewUrl(storage) {
        return getDownloadURL(storage)
            .then((url) => {
                // Insert url into an <img> tag to "download"
                return url;
            })
            .catch((error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/object-not-found':
                        // File doesn't exist
                        break;
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                }
            });
    }
}


export default MediaService

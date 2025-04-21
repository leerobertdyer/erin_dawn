import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebaseConfig";
import { safeName } from "./newDoc";

interface IUploadFile {
  reference: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export default async function uploadFile({ reference, file, onProgress }: IUploadFile): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const safeReference = safeName(reference) + "_" + new Date().getTime();
      const storageRef = ref(storage, `photos/${safeReference}`);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        cacheControl: 'public,max-age=31536000'
      });

      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.floor(progress));
          console.log('Upload is ' + Math.floor(progress) + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log("Error occurred while processing upload: ", error);
          reject(new Error("Error occurred while processing upload: " + error));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        }
      );

    } catch (error) {
      reject(new Error("Error uploading file: " + error));
    }
  });
}
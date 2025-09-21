import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

/**
 * Uploads a file to Firebase Storage in the 'resumes' directory.
 * @param file The file to upload.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("File to be uploaded is not provided.");
  }

  // Create a unique file path
  const filePath = `resumes/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw new Error("Failed to upload file. Please check your Firebase Storage setup and security rules.");
  }
};

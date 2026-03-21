export const convertFileToBase64 = (file: File | null | undefined): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

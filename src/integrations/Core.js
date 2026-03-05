

export const UploadFile = async ({ file }) => {

  return {
    success: true,
    file_url: URL.createObjectURL(file)
  };
};
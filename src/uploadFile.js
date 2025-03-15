export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();

  // * Set data as file name
  const currentDate = Date.now();
  
  formData.append("file", file);
  formData.append("upload_preset", "SPORTLIFE");
  formData.append("public_id", `${currentDate}`);

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dnrraamqm/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error("Error uploading image");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

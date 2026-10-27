
const cloudinary = require("cloudinary").v2;

const configureCloudinary = () => {
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are missing");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const uploadImage = async (filePath, folder = "agrinext/equipment") => {
  if (!filePath) {
    throw new Error("Image file path is required");
  }

  configureCloudinary();

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
};

const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error("Cloudinary public ID is required");
  }

  configureCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

module.exports = {
  uploadImage,
  deleteImage,
};

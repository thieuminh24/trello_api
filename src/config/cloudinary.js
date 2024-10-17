import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Cấu hình Multer lưu trữ file lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = "raw"; // Mặc định là 'raw' cho các tệp tài liệu

    // Kiểm tra xem file có phải là ảnh hay không
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image"; // Đặt resource_type là 'image' cho ảnh
    }

    return {
      folder: "uploads",
      // resource_type: resourceType, // Tùy theo loại tệp
      // allowed_formats: [
      //   "jpg",
      //   "png",
      //   "pdf",
      //   "doc",
      //   "docx",
      //   "xls",
      //   "xlsx",
      //   "txt",
      // ], // Các định dạng file cho phép
      // eslint-disable-next-line no-dupe-keys
      resource_type: "auto", // Điều này cho phép Cloudinary tự động phát hiện loại file
    };
  },
});

const upload = multer({ storage });

export default upload;

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { fileType } = req.body; 
        let uploadPath = 'uploads/documents'; 

        if (fileType === 'profile') {
            uploadPath = 'uploads/profiles';
        } else if (fileType === 'product') {
            uploadPath = 'uploads/products';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage });

export default upload;
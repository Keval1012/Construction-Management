import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// const upload = multer({ dest: 'images/' });

// const __dirname = path.resolve();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        let dir;
        if (req.baseUrl === '/api/project') dir = path.join(__dirname, `../images/project/${req?.body?.projectId || req?.params?.id}`);
        if (req.baseUrl === '/api/inspection') dir = path.join(__dirname, `../images/inspection/${req?.body?.projectId || req?.params?.id}`);
        if (req.baseUrl === '/api/task') dir = path.join(__dirname, `../images/task/${req?.body?.taskId || req?.params?.id}`);
        if (req.baseUrl === '/api/equipmentRequest') dir = path.join(__dirname, `../images/equipmentRequest/${req?.body?.equipmentRequestId || req?.params?.id}`);
        if (req.body?.saleInvoiceId && req.baseUrl === '/api/saleInvoice') dir = path.join(__dirname, `../images/sale/${req?.body?.saleInvoiceId || req?.params?.id}`);
        if (req.body?.purchaseOrderId && req.baseUrl === '/api/purchaseOrder') dir = path.join(__dirname, `../images/purchase/${req?.body?.purchaseOrderId || req?.params?.id}`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        // callback(null, path.join(__dirname, '../images/task'));
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            debugger
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

export default upload;
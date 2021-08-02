import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/pdf/')
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb) {

    const filetypes = /pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Pdf only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('pdf'), (req, res) => {

    console.log(`From pdfUploadsRoutes.js-> ` + path.resolve())
    const hostPath = req.headers['origin']
    const dirPath = '/' + req.file.path.replace(/\\/g, '/')
    const fullPath = hostPath + dirPath
    res.send({ hostPath: hostPath, dirPath: dirPath, fullPath: fullPath })
})

export default router
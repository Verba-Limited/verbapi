const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');

const authController = require('../controllers/authController');
const userMiddleware = require('../middlewares/userMiddleware');

router.post('/register', userMiddleware.notUser, authController.register);
// router.post('/passport', authController.registerIntlPassport);
router.post('/login', userMiddleware.isUserVerified, authController.login);

const storage = multer.diskStorage({
    // destination: '../client/build/uploads/profile',
    destination: './public',
    filename: function (req, file, cb) {
        // let fileExtension = path.extname(file.originalname).toLowerCase();
        let fileExtension = file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/);
        if (fileExtension) {
            cb(null, file.fieldname.toLowerCase() + '-' + Date.now() + path.extname(file.originalname));
        } else {
            cb(new Error("Either jpg, jpeg or png image extension is allowed."), "false")
        }
    },
});
const upload = multer({
    storage: storage,     
    limits: {
      files: 1, // allow up to 5 files per request,
      fileSize: 2 * 1024 * 1024 // 2 MB (max file size)
}});

router.post('/passport', upload.single('profilePicture'), authController.registerIntlPassport);

module.exports = router;

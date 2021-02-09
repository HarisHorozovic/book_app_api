const cloudinary = require('../utils/cloudinary');

module.exports = uploadImage = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) next();
    else {
      const result = await cloudinary.uploader.upload(req.file.path);

      const { url, public_id } = result;
      req.body.imageurl = url;
      req.body.cloudinary_id = public_id;

      next();
    }
  } catch (err) {
    res.status(500).json({ status: 'error', err });
  }
};

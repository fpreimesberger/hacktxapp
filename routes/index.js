var express = require('express');
var router = express.Router();
var app = express();

var multer = require('multer')
var multerS3 = require('multer-s3')

// Set storage engine
var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + ".jpg");
  }
});

// Init upload
const upload = multer({
  storage: storage
}).single('image');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'STAY FRESH' });
});

router.post('/upload', function(req, res) {
  upload(req, res, (err) => {
    if (err) {
      res.render('error');
    } else {
      // successful upload
      // NAME OF FILE 
      console.log(req.file.filename);
      res.send('test');


      // json of vegs and fruits

      // estimate expiration

      // set up push notifs
    }
  });
});

module.exports = router;

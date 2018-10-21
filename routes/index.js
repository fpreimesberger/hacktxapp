var express = require('express');
var router = express.Router();
var app = express();
const accountSid = process.env.twilioSSI;
const authToken = process.env.twilioAUTH;
const client = require('twilio')(accountSid, authToken);

var multer = require('multer')
var multerS3 = require('multer-s3')

var foodRecog = 'public\\scripts\\foodRecognizer.py'

// Use python shell
var ps = require('python-shell');

var options = {
  mode: 'text',
  args: []
};

// Set storage engine
var storage = multer.diskStorage({
  destination: 'C:\\Users\\Abhishek\\Miniconda3\\python',
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

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'STAY FRESH' });
});

router.get('/output', function(req, res, next) {
  res.render('output', {items: ["bananas: 1 week", "apples: 2 weeks", "potatoes: 2 months"]});
})

router.post('/upload', function(req, res) {
  upload(req, res, (err) => {
    if (err) {
      res.render('error');
    } else {
      // successful upload
      // NAME OF FILE 
      console.log(req.file.filename);
      // options.args = ['../public/uploads/' + req.file.filename];
      options.args = ['C:/Users/Abhishek/Documents/github/hacktxapp/public/uploads/image-1540080516637.jpg'];
      console.log(options.args[0])
      ps.PythonShell.run(foodRecog, options, function (err, results) {
        if (err) throw err;
        else {
          var data = results.toString();
          console.log(data);
        }
      });
      res.render('output');


      // json of vegs and fruits
      // var json = require("../public/logs/exp.json");
      // console.log(json);

      // estimate expiration

      // set up push notifs
      // time delay ???
      client.messages.create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+18606064589',
        to: '+12818137130'
      })
      .then(message => console.log("Text successfully sent!"))
      .done();
      }
     });
});

module.exports = router;

var express = require('express');
var router = express.Router();

const userRoute = require('./users')
const themeRoute = require('./theme')
const cursusRoute = require('./cursus')
const lessonRoute = require('./lesson')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'Endpoint actif !' });
});

router.use('/user', userRoute)
router.use('/theme', themeRoute)
router.use('/cursus', cursusRoute)
router.use('/lesson', lessonRoute)

module.exports = router;

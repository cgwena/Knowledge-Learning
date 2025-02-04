import express from 'express';
const router = express.Router();

import userRoute from './users.js';
import themeRoute from './theme.js';
import cursusRoute from './cursus.js';
import lessonRoute from './lesson.js';
import orderRoutes from './order.js';
import stripeRoutes from './stripe.js'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'Endpoint actif !' });
});

router.use('/user', userRoute)
router.use('/theme', themeRoute)
router.use('/cursus', cursusRoute)
router.use('/lesson', lessonRoute)
router.use('/orders', orderRoutes);
router.use('/stripe', stripeRoutes)

export default router;

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

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.use('/users', userRoute)
router.use('/themes', themeRoute)
router.use('/cursus', cursusRoute)
router.use('/lessons', lessonRoute)
router.use('/orders', orderRoutes);
router.use('/stripe', stripeRoutes)

export default router;

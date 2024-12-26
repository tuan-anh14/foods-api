const Router = require('express');
const { updateProfile } = require('../controllers/userController');

const userRouter = Router();    

userRouter.patch('/', updateProfile);

module.exports = userRouter;

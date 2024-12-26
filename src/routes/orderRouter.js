const Router = require('express');
const { placeAnOrder, getAllOrders } = require('../controllers/orderController');

const orderRouter = Router();

orderRouter.post('/', placeAnOrder);
orderRouter.get('/', getAllOrders);

module.exports = orderRouter;

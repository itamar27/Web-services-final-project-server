const {Router} = require('express');
const {customerDBController} = require('../controllers/customer.ctrl');

const customerRouter = new Router();

customerRouter.get('/', customerDBController.getCustomers);
customerRouter.get('/:id', customerDBController.getCustomer);
customerRouter.post('/', customerDBController.addCustomer);
customerRouter.Put('/:id', customerDBController.updateCustomer);
customerRouter.delete('/:id', customerDBController.deleteCustomer);

module.exports = {customerRouter};

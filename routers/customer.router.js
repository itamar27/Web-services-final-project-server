const {Router} = require('express');
const {customerDbController} = require('../controllers/customer.ctrl');

const customerRouter = new Router();

customerRouter.get('/', customerDbController.getCustomers);
customerRouter.get('/:id', customerDbController.getCustomer);
customerRouter.post('/', customerDbController.addCustomer);
customerRouter.Put('/:id', customerDbController.updateCustomer);
customerRouter.delete('/:id', customerDbController.deleteCustomer);

module.exports = {customerRouter};

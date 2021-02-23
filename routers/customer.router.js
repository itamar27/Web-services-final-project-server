const { Router } = require('express');
const { customerDbController } = require('../controllers/customer.ctrl');
const auth = require('../middleware/auth');

const customerRouter = new Router();

customerRouter.get('/', customerDbController.getCustomers);
customerRouter.get('/:id', auth.checkIfSelf, customerDbController.getCustomer);
customerRouter.post('/', customerDbController.addCustomer);
customerRouter.put('/:id', auth.checkIfSelf, customerDbController.updateCustomer);
customerRouter.delete('/:id', auth.checkIfSelf, customerDbController.deleteCustomer);



module.exports = { customerRouter };

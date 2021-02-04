const { Router } = require('express');
const { customerDbController } = require('../controllers/customer.ctrl');
const auth = require('../middleware/auth');
const constants = require('../constants');

const customerRouter = new Router();

customerRouter.get('/', customerDbController.getCustomers);     // in use? cant protect
customerRouter.get('/:id', auth.checkIfSelf, customerDbController.getCustomer);
customerRouter.post('/', customerDbController.addCustomer);     // cant protect
customerRouter.put('/:id', auth.checkIfSelf, customerDbController.updateCustomer);
customerRouter.delete('/:id', auth.checkIfSelf, customerDbController.deleteCustomer);



module.exports = { customerRouter };

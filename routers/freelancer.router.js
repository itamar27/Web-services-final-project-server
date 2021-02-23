const { Router } = require('express');
const { freeLancerDbController } = require('../controllers/freelancer.ctrl');
const auth = require('../middleware/auth');

const freelancerRouter = new Router();

freelancerRouter.get('/', freeLancerDbController.getFreelancers);
freelancerRouter.get('/:id', auth.checkIfSelf, freeLancerDbController.getFreelancer);
freelancerRouter.post('/', freeLancerDbController.addFreelancer);
freelancerRouter.put('/:id', auth.checkIfSelf, freeLancerDbController.updateFreelancer);
freelancerRouter.delete('/:id', auth.checkIfSelf, freeLancerDbController.deleteFreelancer);

module.exports = { freelancerRouter };
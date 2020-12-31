const { Router } = require('express');
const { freeLancerDbController } = require('../controllers/freelancer.ctrl');

const freelancerRouter = new Router();


freelancerRouter.get('/', freeLancerDbController.getFreelancers);
freelancerRouter.get('/:id', freeLancerDbController.getFreelancer);
freelancerRouter.post('/', freeLancerDbController.addFreelancer);
freelancerRouter.put('/:id', freeLancerDbController.updateFreelancer);
freelancerRouter.delete('/:id', freeLancerDbController.deleteFreelancer);

module.exports = { freelancerRouter };
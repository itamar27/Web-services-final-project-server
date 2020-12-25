const { Router } = require('express');
const { freeLancerDbController } = require('../controllers/freelancer.ctrl');

const freelancerRouter = new Router();


freelancerRouter.get('/', freeLancerDbController.getFreelancers);               // localhost:3000/api/freelancers
freelancerRouter.get('/:id', freeLancerDbController.getFreelancer);             // localhost:3000/api/freelancers/5
freelancerRouter.post('/', freeLancerDbController.addFreelancer);               // localhost:3000/api/freelancers         
freelancerRouter.put('/:id', freeLancerDbController.updateFreelancer);          // localhost:3000/api/freelancers/38 (with freelancer object)
freelancerRouter.delete('/:id', freeLancerDbController.deleteFreelancer);       // localhost:3000/api/freelancers

module.exports = { freelancerRouter };

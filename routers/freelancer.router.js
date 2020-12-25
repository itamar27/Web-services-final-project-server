const { Router } = require('express');
const { freeLancerDbController } = require('../controllers/freelancer.ctrl');

const freelancerRouter = new Router();


freelancerRouter.get('/', freeLancerDbController);              // localhost:3000/api/freelancers
freelancerRouter.get('/:id', freeLancerDbController);           // localhost:3000/api/freelancers/5
freelancerRouter.post('/', freeLancerDbController);             // localhost:3000/api/freelancers (with freelancer object)
freelancerRouter.put('/:id', freeLancerDbController);           // localhost:3000/api/freelancers/38 (with freelancer object)
freelancerRouter.delete('/:id', freeLancerDbController);        // localhost:3000/api/freelancers/43

module.exports = { freelancerRouter};

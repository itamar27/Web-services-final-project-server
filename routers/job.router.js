const { Router } = require('express');
const { jobDbController } = require('../controllers/job.ctrl');
const auth = require('../middleware/auth');
const constants = require('../constants');

const jobRouter = new Router();


jobRouter.get('/freelancer', jobDbController.getFreelancerJobs);
jobRouter.get('/', jobDbController.getJobs);
jobRouter.get('/user/:id', jobDbController.getCustomerJobs);
jobRouter.get('/:id', auth.checkJobOwnership, jobDbController.getJob);
jobRouter.post('/', auth.checkRole(constants.FREELANCER), jobDbController.addJob);
jobRouter.put('/:id', auth.checkJobOwnership, jobDbController.updateJobGoals);
jobRouter.delete('/:id', jobDbController.deleteJob);


module.exports = { jobRouter };

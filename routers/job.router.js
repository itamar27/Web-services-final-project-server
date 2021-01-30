const { Router } = require('express');
const { jobDbController } = require('../controllers/job.ctrl');
const auth = require('../middleware/auth');
const constants = require('../constants');

const jobRouter = new Router();


jobRouter.get('/', jobDbController.getJobs);
jobRouter.get('/:id', auth.checkRole(constants.COSTUMER), auth.checkJobOwnership, jobDbController.getJob);
jobRouter.post('/', auth.checkRole(constants.FREELANCER), jobDbController.addJob);
jobRouter.put('/:id', auth.checkJobOwnership, jobDbController.updateJob);
jobRouter.delete('/:id', auth.checkJobOwnership, jobDbController.deleteJob);

// jobRouter.get('/', jobDbController.getJobs);
// jobRouter.get('/:id', jobDbController.getJob);
// jobRouter.post('/',jobDbController.addJob);
// jobRouter.put('/:id', jobDbController.updateJob);
// jobRouter.delete('/:id', jobDbController.deleteJob);

module.exports = { jobRouter };

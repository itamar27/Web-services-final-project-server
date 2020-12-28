const {Router} = require('express');
const {jobDbController} = require('../controllers/job.ctrl');

const jobRouter = new Router();

jobRouter.get('/', jobDbController.getJobs);
jobRouter.get('/:id', jobDbController.getJob);
jobRouter.post('/', jobDbController.addJob);
jobRouter.put('/:id', jobDbController.updateJob);
jobRouter.delete('/:id', jobDbController.deleteJob);

module.exports = {jobRouter};

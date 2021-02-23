const { Router } = require('express');
const { freelancerApiController } = require('../controllers/freelancerApi.ctrl');

const freelancerApiRouter = new Router();

freelancerApiRouter.get('/projects/user', freelancerApiController.getUserProjects);
freelancerApiRouter.get('/projects', freelancerApiController.getProjects);


module.exports = { freelancerApiRouter }; 
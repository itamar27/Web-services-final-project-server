const { Router } = require('express');
const { freelancerApiController } = require('../controllers/freelancerApi.ctrl');
const auth = require('../middleware/auth');
const constants = require('../constants');

const freelancerApiRouter = new Router();


// used to fetch specific projects
freelancerApiRouter.get('/project/user', freelancerApiController.getUserProjects);

freelancerApiRouter.get('/projects', freelancerApiController.getProjects);


module.exports = { freelancerApiRouter };
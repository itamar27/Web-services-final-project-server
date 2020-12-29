const { Router } = require('express');
const { externalApiController } = require('../controllers/externalApi.ctrl');

const externalApiRouter = new Router();


externalApiRouter.get('/projects', externalApiController.getProjects); 


module.exports = { externalApiRouter };
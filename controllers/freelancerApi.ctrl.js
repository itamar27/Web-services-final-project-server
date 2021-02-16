const axios = require('axios');
const { getAllCustomers } = require('./customer.ctrl');
const { responseBadRequest, writeResponse } = require('./helper.ctrl');
const commentsController = require('./comments.ctrl')

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class JobOffer {
    constructor(project, job) {
        this.project_id = project.id
        this.owner_id = project.owner_id
        this.title = project.title
        this.currency_code = project.currency.sign;
        this.description = project.description;
        this.job_category = job.category.name;
        this.price = (project.budget.minimum + project.budget.maximum) / 2;
        this.time_submitted = new Date(project.time_submitted * 1000).toLocaleString().substr(0, 10);
        this.comment = null
    }
}


const freelancerApiController = {

    async getProjects(req, res) {
        let jobs = Array();
        const url = 'https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true';
        let query = "";

        try {
            const customers = await getAllCustomers(req, res);
            customers.forEach((customer) => {
                query += `&owners[]=${customer.freelancer_api_id}`;
            })

            let offers = await axios.get(url + query);
            jobs = generateJobOffers(offers);

            await commentsController.updateAllComments(jobs, customers);

            const returnedJobs = await commentsController.getAllComments();
            let response = [];
            jobs.map((job) => {
                returnedJobs.forEach((offer) => {
                    if (job.project_id == offer.offer_id) {
                        job.comment = offer.comment;
                        response.push(job);
                    }
                   
                })
            })
            res.json(response);
            writeResponse(req, res);
        } catch (err) {
            responseBadRequest(req, res, err)
        }

    },

    async getUserProjects(req, res) {
        const user = req.session.user;
        let jobs = null;
        let filterdJobOffers = null;

        try {
            let offers = await axios.get(`https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true&owners[]=${user.freelancer_api_id}`)
            jobs = generateJobOffers(offers);
            await commentsController.updateComments(user.personal_details.id, jobs);
            filterdJobOffers = await commentsController.getComments(user.personal_details.id);
            let returnedJobs = []
            jobs.map((job) => {
                filterdJobOffers.forEach((offer) => {
                    if (job.project_id == offer.offer_id) {
                        job.comment = offer.comment;
                        returnedJobs.push(job);
                    }
                })
            })
            res.json(returnedJobs);
            writeResponse(req, res);

        } catch (err) {
            res.send(err);
        }
    },
}


const generateJobOffers = (offers) => {
    let jobs = Array();
    offers.data.result.projects.forEach((project) => {
        // if (project.status == "active") {
        project.jobs.every((job) => {
            if ([1, 3, 5].includes(job.category.id)) {
                jobs.push(new JobOffer(project, job));
                return false;
            }
            return true;
        })
        // }
    })
    return jobs
}

module.exports = { freelancerApiController }

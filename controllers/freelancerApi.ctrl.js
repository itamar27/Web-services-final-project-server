const axios = require('axios').default;
const { getAllCostumers, writeCommentsBack } = require('./customer.ctrl');
const { responseBadRequest, writeResponse } = require('./helper.ctrl');

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
        this.comments = []
    }
}

exports.freelancerApiController = {
    async getProjects(req, res) {
        let jobs = Array();
        const url = 'https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true';
        let query = "";
        try {
            costumers = await getAllCostumers()
            costumers.forEach((costumer) => { query += `&owners[]=${costumer.freelancer_api_id}` })

            let offers = await axios.get(url + query)
            jobs = generateJobOffers(offers);

            res.json(jobs);
            writeResponse(req, res);
        } catch (err) {
            responseBadRequest(err)
        }

    },

    async getUserProjects(req, res) {
        let jobs = null;
        let comments = req.user.job_offers;
        try {
            let offers = await axios.get(`https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true&owners[]=${req.user.freelancer_api_id}`)
            jobs = generateJobOffers(offers);

            if (comments) {
                comments.forEach((item) => {
                    jobs.forEach((job) => {
                        if (job.project_id.toString() === item.id) {
                            job.comments = item.comments
                        }
                    })
                })
            }

            res.json(jobs);
            persistJobOffers(req.user.personal_details.id, jobs);
            writeResponse(req, res);

        } catch (err) {
            res.send(err);
        }
    }
}


const persistJobOffers = async (id, jobs) => {
    retComments = Array();
    jobs.forEach((job) => {
        retComments.push({
            id: job.project_id.toString(),
            comments: job.comments
        })
    })
    writeCommentsBack(id, retComments);
}


const generateJobOffers = (offers) => {
    let jobs = Array();
    offers.data.result.projects.forEach((project) => {
        // if (project.status == "active") {
        project.jobs.every((job) => {
            if (job.category.id == 1) {
                jobs.push(new JobOffer(project, job));
                return false;
            }
            return true;
        })
    }
        // })
    )
    return jobs
}
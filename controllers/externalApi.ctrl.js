const axios = require('axios').default;
const { getAllCostumers } = require('./customer.ctrl');
const { responseBadRequest, writeResponse, success } = require('./helper.ctrl');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class JobOffer {
    constructor(project, job) {
        this.owner_id = project.owner_id
        this.title = project.title
        this.currency_code = project.currency.sign;
        this.description = project.description;
        this.job_category = job.category.name;
        this.price = (project.budget.minimum + project.budget.maximum) / 2;
        this.time_submitted = new Date(project.time_submitted * 1000).toLocaleString().substr(0, 10);
    }
}

exports.externalApiController = {
    getProjects(req, res) {
        let jobs = Array();
        const url = 'https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true';
        let query = "";
        getAllCostumers()
            .then((costumers) => {
                costumers.forEach((costumer) => { query += `&owners[]=${costumer.freelancer_api_id}` })
                axios.get(url + query)
                    .then((response) => {
                        response.data.result.projects.forEach((project) => {
                            if (project.status == "active") {
                                project.jobs.every((job) => {
                                    if (job.category.id == 1) {
                                        jobs.push(new JobOffer(project, job));
                                        return false;
                                    }
                                    return true;
                                })
                            }
                        })
                        res.json(jobs);
                        writeResponse(req, res);
                    })
                    .catch((err) => { responseBadRequest(err) });
            })
            .catch((err) => { responseBadRequest(err) });
    }
}
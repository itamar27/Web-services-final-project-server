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


const getDataFromFreelancer = (url, query, req, res) => {
    let jobs = Array();
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
        }).catch((err) => { responseBadRequest(err) });
}


const freelancerApiController = {
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
    },
}

const getFreelancerApiId = (username) => {

    let query = `https://www.freelancer.com/api/users/0.1/users?usernames[]=${username}`;

    return axios.get(query, { withCredentials: true, credentials: 'include' }).
        then(response => {
            freelancerId = parseInt(Object.keys(response.data.result.users)[0]);
            return freelancerId;

        }).catch(err => console.log(err));

}


const persistJobOffers = async (id, jobs) => {
    retComments = Array();
    jobs.forEach((job) => {
        retComments.push({
            id: job.project_id.toString(),
            comments: job.comments
        })
    })
    await writeCommentsBack(id, retComments);
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
    })
    return jobs
}

module.exports = { freelancerApiController, getFreelancerApiId }

// getProjects(req, res) {
//     const url = 'https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true';
//     let query = "";
//     getAllCostumers()
//         .then((costumers) => {
//             costumers.forEach((costumer) => { query += `&owners[]=${costumer.freelancer_api_id}` });
//             getDataFromFreelancer(url, query, req, res);
//         })
//         .catch((err) => { responseBadRequest(err) });
//     )
// return jobs
// }
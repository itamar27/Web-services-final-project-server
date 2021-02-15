const axios = require('axios').default;
const { getAllCostumers, writeCommentsBack } = require('./customer.ctrl');
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


// const getDataFromFreelancer = (url, query, req, res) => {
//     let jobs = Array();
//     axios.get(url + query)
//         .then((response) => {
//             response.data.result.projects.forEach((project) => {
//                 if (project.status == "active") {
//                     project.jobs.every((job) => {
//                         if (job.category.id == 1) {
//                             jobs.push(new JobOffer(project, job));
//                             return false;
//                         }
//                         return true;
//                     })
//                 }
//             })
//             res.json(jobs);
//             writeResponse(req, res);
//         }).catch((err) => { responseBadRequest(err) });
// }


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
        const user = req.session.user;
        let jobs = null;
        let filterdJobOffers = null;

        try {
            let offers = await axios.get(`https://www.freelancer.com/api/projects/0.1/projects/?compact=true&full_description=true&languages[]=en&job_details=true&owners[]=${user.freelancer_api_id}`)
            jobs = generateJobOffers(offers);
            await commentsController.updateComments(user.personal_details.id, jobs);
            filterdJobOffers = await commentsController.getComments(user.personal_details.id);
            let returndJobs = []
            jobs.map((job) => {
                filterdJobOffers.forEach((offer) => {
                    if (job.project_id == offer.offer_id) {
                        job.comment = offer.comment;
                        returndJobs.push(job);
                    }
                })
            })
            res.json(returndJobs);
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

module.exports = { freelancerApiController, getFreelancerApiId }

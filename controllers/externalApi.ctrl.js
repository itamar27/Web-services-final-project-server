const axios = require('axios').default;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';



const MaxProjectsNum = 20;

class JobOffer {
    constructor(job, index) {
        this.owner_id = job.id
        this.title = job.title
        this.currency_code = job.currency.sign;
        this.description = job.description;
        this.job_category = job.jobs[index].category.name;
        this.price = (job.budget.minimum + job.budget.maximum) / 2;
        this.time_submitted = new Date(job.time_submitted * 1000).toLocaleString().substr(0, 10);
    }
}

exports.externalApiController = {
    getProjects(req, res) {
        let ans = Array();

        const promise = axios.get('https://www.freelancer.com/api/projects/0.1/projects/all/?compact=true&full_description=true&languages[]=en&project_types[]=fixed&job_details=true&query=web&limit=50&project_statuses[]=active')
            .then((response) => {
                const projects = response.data.result.projects;

                for (let i = 0; i < projects.length && i < MaxProjectsNum; i++) {
                    for (let j = 0; j < projects[i].jobs.length; j++) {
                        if (projects[i].jobs[j].category.id == 1) {
                            ans.push(new JobOffer(projects[i], j));
                            break;
                        }
                    }
                }
                res.json(ans);

            }).catch((err) => {
                console.log(err);
            });
    }
}
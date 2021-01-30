const freelancerCtrl = require('../controllers/freelancer.ctrl');
const customerCtrl = require('../controllers/customer.ctrl');
const jobCtrl = require('../controllers/customer.ctrl');
const constants = require('../constants')

authentication = {
    async checkAuthenticated(req, res, next) {
        let user = null;
        if (req.cookies['session-token']) {
            user = await customerCtrl.getCostumerByGoogle(req.cookies['session-token']);

            // if user defined we found a costumer matching, move to next 
            if (user) {
                req.user = user;
                req.role = constants.COSTUMER
            }
            else {
                user = await freelancerCtrl.getFreelancerByGoogle(req.cookies['session-token']);
                if (user) {
                    req.user = user;
                    req.role = constants.FREELANCER
                }
            }

            // if we found user -> its valid and continue
            if (user) {
                next()
            }


            //if user token isnt valid -> need to register / sign in
            else
                res.send("neeed to complete sign up")
        } else {
            // need to redirect at front to login/sign up page
            res.send("not signed in")
        }
    },

    checkRole(role) {
        return (req, res, next) => {
            if (req.role != role) {
                // denied entrence
                res.send("not allowd")
            }
            else {
                console.log("allowed");
                next()
            }

        }
    },

    async checkJobOwnership(req, res, next) {

        let ownedJobs = null
        let allowed = false
        if (req.role === constants.FREELANCER)
            ownedJobs = req.user.jobs

        else if (req.role === constants.COSTUMER)
            ownedJobs = req.user.jobs_id


        console.log(req.params.id);
        console.log(ownedJobs);

        ownedJobs.forEach((job) => {
            if (job.toString() === req.params.id)
                allowed = true;
        })


        if (allowed) {
            console.log("permitted");
            next()
        }
        else {
            res.send("not allowed here sorry")
        }


    }




}


module.exports = authentication
const freelancerCtrl = require('../controllers/freelancer.ctrl');
const customerCtrl = require('../controllers/customer.ctrl');


const constants = require('../constants')



const findByGoogle = async (req, cookie) => {
    let user = null;
    user = await customerCtrl.getCustomerByGoogle(cookie);

    // if user defined we found a costumer matching, move to next 
    if (user) {
        user.role = constants.CUSTOMER;
    }
    else {
        user = await freelancerCtrl.getFreelancerByGoogle(cookie);
        if (user) {
            user.role = constants.FREELANCER;
        }
        else
            return null
    }

    return user
}


const checkAuthenticated = async (req, res, next) => {

    if (req.session.user) {
        next()
    } else {
        // need to redirect at front to login/sign up page
        res.send("not signed in or registred")
    }
}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.role != role) {
            res.send("not allowed");
        }
        else {
            next()
        }
    }
}

const checkJobOwnership = (req, res, next) => {
    let ownedJobs = null
    let allowed = false
    if (req.session.role === constants.FREELANCER)
        ownedJobs = req.session.user.jobs_id

    else if (req.session.role === constants.CUSTOMER)
        ownedJobs = req.session.user.jobs_id

    ownedJobs.forEach((job) => {
        if (job.toString() === req.params.id)
            allowed = true;
    })

    if (allowed) {
        next()
    }
    else {
        res.send("not allowed here sorry")
    }
}


const checkIfSelf = (req, res, next) => {
    if (req.params.id === req.session.user.personal_details.id)
        next();
    else
        res.send("not allowed to get here - error")

}



module.exports = { checkJobOwnership, checkRole, checkAuthenticated, findByGoogle, checkIfSelf }
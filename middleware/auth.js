const freelancerCtrl = require('../controllers/freelancer.ctrl');
const customerCtrl = require('../controllers/customer.ctrl');
const constants = require('../constants')
const { writeResponse } = require('../logs/logs')



const findByGoogle = async (req, cookie) => {
    let user = null;
    user = await customerCtrl.getCustomerByGoogle(cookie);

    if (user)
        user.role = constants.CUSTOMER;
    else {
        user = await freelancerCtrl.getFreelancerByGoogle(cookie);
        if (user)
            user.role = constants.FREELANCER;
        else
            return null;
    }

    return user;
}


const checkAuthenticated = async (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        writeResponse(req, res, 'user was denied, no credentials provided');
        res.json({ error: "not signed in or registred, please sign in/up" });
    }
}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.role != role) {
            writeResponse(req, res, 'user was denied, user role dosent match requierments');
            res.json({ error: "you are not allowed to enter this page, your user role dosent match requierments" });
        }
        else
            next();
    }
}

const checkJobOwnership = (req, res, next) => {
    let ownedJobs = null;
    let allowed = false;
    if (req.session.role === constants.FREELANCER)
        ownedJobs = req.session.user.jobs_id;

    else if (req.session.role === constants.CUSTOMER)
        ownedJobs = req.session.user.jobs_id;

    ownedJobs.forEach((job) => {
        if (job.toString() === req.params.id)
            allowed = true;
    })

    if (allowed)
        next();
    else {
        writeResponse(req, res, 'user was denied, trying to access illegal data');
        res.json({ error: "you are not allowed to enter this page, this data is not yours to view" });
    }
}


const checkIfSelf = (req, res, next) => {
    if (req.params.id === req.session.user.personal_details.id)
        next();
    else {
        writeResponse(req, res, 'user was denied, trying to access illegal data');
        res.json({ error: "you are not allowed to enter this page, this data is not yours to view" });
    }
}


module.exports = { checkJobOwnership, checkRole, checkAuthenticated, findByGoogle, checkIfSelf }
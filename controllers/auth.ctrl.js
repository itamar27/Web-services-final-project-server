const { FREELANCER, CUSTOMER } = require('../constants');
const { freeLancerDbController } = require('../controllers/freelancer.ctrl');
const { customerDbController } = require('../controllers/customer.ctrl');
const { responseBadRequest, writeResponse } = require('./helper.ctrl');
const Auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const verify = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // check if payload exist

    let user = {
        id: payload['sub'],
        first_name: payload['given_name'],
        last_name: payload['family_name'],
        email: payload['email'],
    }
    return user;
}


exports.authController = {

    async login(req, res) {
        let token = req.body.token;
        try {
            let user = await verify(token);
            let url = '';
            if (user) {
                const localUser = await Auth.findByGoogle(req, user.id);
                req.session.user = localUser;
                if (localUser) {

                    user.role = localUser.role;
                    if (user.role === 'customer')
                        url = `user/${localUser.personal_details.first_name}_${localUser.personal_details.last_name}`;
                    else
                        url = `job_offers`;

                    req.session.role = localUser.role;
                    user.first_name = localUser.personal_details.first_name;
                    user.last_name = localUser.personal_details.last_name;
                    user.id = localUser.personal_details.id;
                    res.json({ user, url })
                    writeResponse(req, res);
                }  // user tried to login and exisit in db so all good
                else {
                    url = '/signup';
                    res.json({ user, url });   // user tried to login but dosent exist -> need to sign up
                }
            }

            else {
                err = 'Problome with google token';
                responseBadRequest(req, res, err);
            }


        } catch (err) {
            responseBadRequest(req, res, `Error with authenticating ${err.message}`);
        }
    },

    async logout(req, res) {
        res.clearCookie('connect.sid');
        req.session.destroy((err) => { console.log(err) });
        res.json({ message: 'logged out successfully' });

    },
    async signup(req, res) {
        if (req.body.freelancer) {

            await freeLancerDbController.addFreelancer(req, res);
        }
        else {
            await customerDbController.addCustomer(req, res);
        }
    },

    getCredentials(req, res) {
        const tmpUser = req.session.user;
        console.log(tmpUser);
        const user = {
            id: tmpUser.personal_details.id,
            first_name: tmpUser.personal_details.first_name,
            last_name: tmpUser.personal_details.last_name,
            email: tmpUser.personal_details.email,
            role: tmpUser.role
        }
        console.log(user);
        res.json(user);
    }
} 
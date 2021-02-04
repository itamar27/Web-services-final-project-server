const { Router } = require('express');
const Auth = require('../middleware/auth')

const authRouter = new Router()


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
        f_name: payload['given_name'],
        l_name: payload['family_name'],
        email: payload['email'],
    }
    return user;
}


// fix the responses in a way that makes front to redirect to correct pager
// explore catch and understand when happens + deal with errors
authRouter.post('/login', async (req, res) => {
    let token = req.body.token;
    try {
        let user = await verify(token);
        if (user) {
            let localUser = await Auth.findByGoogle(req, user.id);
            req.session.user = localUser;

            if (localUser)
                res.send("welcome to home page")    // user tried to login and exisit in db so all good
            else
                res.send("redirect to sign up page");   // user tried to login but dosent exist -> need to sign up
        }

        else
            res.send("not a valid google token")


    } catch (err) {
        console.log(err);
    }
})

// authRouter.get('/login', async (req, res) => {
//     let token = req.query.obj;
//     try {
//         let user = await verify(token);
//         if (user) {
//             // if tmp then user exist
//             // res.cookie('session-token', user.id, { expires: new Date(Date.now() + 3600000) });
//             let localUser = await Auth.findByGoogle(req, user.id);
//             req.session.user = localUser;
//             console.log("login");
//             // console.log(req.session);
//             console.log(req.sessionID);
//             if (localUser)
//                 res.send("welcome to home page")    // user tried to login and exisit in db so all good
//             else
//                 res.send("redirect to sign up page");   // user tried to login but dosent exist -> need to sign up
//         }
//         else
//             res.send("not a valid google token")
//     } catch (err) {
//         console.log(err);
//     }
// }
//)




authRouter.get('/logout', (req, res) => {
    res.clearCookie('connect.sid');
    req.session.destroy((err) => { console.log(err); });
    res.send("loged out")
})




module.exports = { authRouter };
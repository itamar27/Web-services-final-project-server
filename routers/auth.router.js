const { Router } = require('express');

const authRouter = new Router()


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const verify = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log(payload);

    let user = {
        id: payload['sub'],
        f_name: payload['given_name'],
        l_name: payload['family_name'],
        email: payload['email'],
    }
    return user;
}


authRouter.post('/login', async (req, res) => {
    let token = req.body.token;
    try {
        let user = await verify(token);
        res.cookie('session-token', user.id, { expires: new Date(Date.now() + 3600000) });
        res.json(user);

    } catch (err) {
        console.log(err);
    }
})


authRouter.post('/login', async (req, res) => {
    let token = req.body.token;
    try {
        let user = await verify(token);
        res.cookie('session-token', user.id, { expires: new Date(Date.now() + 3600000) });
        res.json(user);

    } catch (err) {
        console.log(err);
    }
})



authRouter.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.send("loged out?")
})




module.exports = { authRouter };
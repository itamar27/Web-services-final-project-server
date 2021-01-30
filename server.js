const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { freelancerRouter } = require('./routers/freelancer.router');
const { customerRouter } = require('./routers/customer.router');
const { freelancerApiRouter } = require('./routers/freelancerApi.router');
const { jobRouter } = require('./routers/job.router');
const { authRouter } = require('./routers/auth.router');
const { writeRequest } = require('./logs/logs');

const cors = require('cors')
const cookieParser = require('cookie-parser')
// const session = require('express-session');

const authMiddle = require('./middleware/auth')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'milky is the collest dog ever!'
// }))

app.use(cors({ origin: true, credentials: true }))

app.all('*', (req, res, next) => {
    writeRequest(req);
    next();
})


app.use('/auth', authRouter)

app.use(authMiddle.checkAuthenticated)

app.use('/api/freelancers', freelancerRouter);
app.use('/api/customers', customerRouter);
app.use('/api/freelancerApi', freelancerApiRouter);
app.use('/api/jobs', jobRouter);



app.use((req, res) => {
    res.status(500).send('Something is broken!');
});


app.listen(port, () => console.log('Express server is running on port ', port));


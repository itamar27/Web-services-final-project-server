const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { commentsRouter } = require('./routers/comments.router');
const { freelancerRouter } = require('./routers/freelancer.router');
const { customerRouter } = require('./routers/customer.router');
const { freelancerApiRouter } = require('./routers/freelancerApi.router');
const { jobRouter } = require('./routers/job.router');
const { authRouter } = require('./routers/auth.router');
const { writeRequest } = require('./logs/logs');

const cors = require('cors');
const authMiddle = require('./middleware/auth');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }))


// *****  session related *******
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db_connection')

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    ttl: 1000 * 60 * 60 * 24
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,// Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
        secure: false
    }
}));
// ***** session related *******


app.all('*', (req, res, next) => {
    writeRequest(req);
    next();
})

app.use('/auth', authRouter)

app.use(authMiddle.checkAuthenticated)

app.use('/api/comments',commentsRouter )
app.use('/api/freelancers', freelancerRouter);
app.use('/api/customers', customerRouter);
app.use('/api/freelancerApi', freelancerApiRouter);
app.use('/api/jobs', jobRouter);



app.use((req, res) => {
    res.status(500).send('Something is broken!');
});


app.listen(port, () => console.log('Express server is running on port ', port));


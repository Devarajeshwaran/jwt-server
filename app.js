// Bringing all the dependencies in
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

// Instantiating the express app
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

// MOCKING DB just for test
let users = [
    {
        id: 1,
        username: 'test',
        password: 'asdf123'
    }
];

//Login route
app.post('/login', (req, res) => {
    const {username, password} = req.body;

    for(let user of users) {
        if(username === user.username && password === user.password) {
            let token = jwt.sign({id: user.id, username: user.username}, 'keyboard cat 4 ever', {expiresIn: 129600});
            res.json({
                success: true,
                error: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                error: 'Username or Password is incorrect',
                token: null
            });
        }
    }
});

//Sending some response when authenticated
app.get('/', jwtMW, (req, res) => {
    res.send('You are authenticated');
});

//Sending some response when authenticated
app.get('/home', jwtMW, (req, res) => {
    res.send('You are authenticated');
});

// Error handling 
app.use(function(error, req, res, next) {
    if(error.name === 'UnauthorizedError') {
        res.status(401).send(error);
    }
    else {
        next(error);
    }
})

// Starting the app on PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Magic happens on port ${PORT}`);
});
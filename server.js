const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();

// Enable CORS
app.use(cors())
//   origin: 'http://localhost:3001',
//   credentials: true
// }));

app.use(express.json());
// app.use(bodyParser.json());

app.get('/', (req, res) => {res.send('it is working') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(process.env.PORT || 3000, () => {
  console.log('app is running on port ${process.env.PORT}');
});



// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
// const cors = require('cors');
// const knex = require('knex');

// const register = require ('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

// const db = knex({
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     port: 5432,
//     user: '',
//     password: '',
//     database: 'smart-brain'
//   }
// });

// const app = express();


// app.use(cors())
// app.use(bodyParser.json());


// app.get('/', (req, res) => {
//   db.select('*')
//     .from('users')
//     .then(users => {
//       res.json(users);
//     })
//     .catch(err => res.status(400).json('error getting users'));
// });


// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
// app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
// app.put('/image', (req,res) => { image.handleImage(req, res, db)})

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`app is running on port ${PORT}`);
// // });

// app.listen(3000, () => {
//   console.log('app is running on port 3000');
// });

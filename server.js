const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

console.log ('process.env.DATABASE_URL:',process.env.DATABASE_URL);

const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

// Test only - when you have a database variable you want to use
// app.get('/', (req, res)=> {
//   res.send(database.users);
// })

app.get('/', (req, res) => {
  console.log('Received request at root path'); // Added this line
  res.send('it is working');
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Received POST request at /signin'); // Log when the request is received
  
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      console.log('Data retrieved from login table:', data); // Log data retrieved
      
      if (data.length > 0) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          // Sign-in successful
          // Return user data or authentication token
          console.log('Sign-in successful'); // Log successful sign-in
          // You can return user data or an authentication token here
        } else {
          // Passwords do not match
          console.log('Invalid credentials'); // Log invalid credentials
          res.status(400).json('Invalid credentials');
        }
      } else {
        // User not found
        console.log('User not found'); // Log user not found
        res.status(400).json('User not found');
      }
    })
    .catch(err => {
      console.error('Error signing in:', err); // Log error
      res.status(500).json('Internal server error');
    });
});


app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  console.log('Received data:', email, name);
  const hash = bcrypt.hashSync(password);
  console.log('password hash:', hash);
    db.transaction(trx => {
      console.log('inside transaction')
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        console.log('login inserted:', loginEmail);
        return trx('users')
          .returning('*')
          .insert({
            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
            // loginEmail[0] --> this used to return the email
            // TO
            // loginEmail[0].email --> this now returns the email
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            console.log('user inserted:', user);
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register' + err))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request at /profile/${id}`); // Added this line
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        console.log('User profile retrieved:', user[0]); // Added this line
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => {
      console.error('Error getting user profile:', err); // Added this line
      res.status(400).json('error getting user');
    });
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
    // entries[0] --> this used to return the entries
    // TO
    // entries[0].entries --> this now returns the entries
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries: ' + err));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});




// TESTING ANDREI FILE START

// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
// const cors = require('cors');
// const knex = require('knex');

// const register = require('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

// c

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));



// app.use(express.json());
// // app.use(bodyParser.json());

// app.get('/', (req, res) => {res.send('it is working') })
// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
// app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
// app.put('/image', (req, res) => { image.handleImage(req, res, db) });

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`app is running on port ${process.env.PORT}`);
// });


// TESTING ANDREI FILE END




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

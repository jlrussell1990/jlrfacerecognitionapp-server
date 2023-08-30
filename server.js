app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user: ' + err));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials: ' + err));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  console.log('Received data:', email, name);
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to insert user: ' + err));
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => res.status(400).json('unable to register: ' + err));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('error getting user: ' + err));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
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

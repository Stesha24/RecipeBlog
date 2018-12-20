const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .on('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });

mongoose.connect(config.MONGO_URL, {useMongoClient: true});

// express

const app = express();

app.use(
  session({
    secret: config.SESSION_SECRET,
    resolve: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// routers

// app.get('/cabinet', function(req, res) {
//   const id = req.session.userId;
//   const login = req.session.userLogin;
//   const role = req.session.userRole;
//
//   res.render('cabinet', {
//     user: {
//       id,
//       login,
//       role
//     }
//   });
// });

app.use('/api/auth', routes.auth);
app.use('/cabinet', routes.cabinet);
app.use('/upload', routes.upload);
app.use('/cabinetAdmin', routes.cabinetAdmin);
app.use('/', routes.allRecipes);
// page 404
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next (err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status (error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, function () {
  console.log(`Example app listening on port ${config.PORT}!`);
});

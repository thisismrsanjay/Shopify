const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes= require('./routes/users');
const mainRoutes =require('./routes/main');
const adminRoutes = require('./routes/admin');
const apiRoutes =require('./api/api');
const flash = require('connect-flash');
const session =require('express-session');
const config = require('./config/config');
const passport = require('passport');
const passportConfig = require('./config/passport')(app,passport);
const Category = require('./models/category');
const mongodb = require('mongodb');

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
 }))
 app.use(flash());
  

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log('database connected'); 
});
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
})

app.use((req, res, next) => {
    Category.find({})
        .then(categories => {
            res.locals.categories = categories;
            next();
        })
        .catch(err => next(err));
});



app.use('/user',userRoutes);
app.use('/',mainRoutes);
app.use('/',adminRoutes);
app.use('/api',apiRoutes);



app.listen(config.port,(err)=>{
    if(err)throw err;
    console.log("server is running");
})
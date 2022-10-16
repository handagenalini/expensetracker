const path=require('path');
const express = require('express');
const app = express();
const User = require('./models/user');
const bodyParser=require('body-parser');
const cors=require('cors');
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')))

const sequelize = require('./util/database');
const userRoutes = require('./routes/user')
// const User = require('./models/users');
const Expense = require('./models/expense');

app.use(userRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);
require("dotenv").config();


sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

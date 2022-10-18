const path=require('path');
const express = require('express');
const app = express();
const User = require('./models/user');
const bodyParser=require('body-parser');
const cors=require('cors');
const Razorpay=require("razorpay");

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')))

const sequelize = require('./util/database');
const Order = require('./models/order')
const userRoutes = require('./routes/user')
// const User = require('./models/users');
const Expense = require('./models/expense');
const Forgotpassword = require('./models/forgotpassword');

app.use(userRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);
require("dotenv").config();

const purchaseRoutes = require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetpassword')


// get config vars

User.hasMany(Order);
Order.belongsTo(User);




// app.use(bodyParser.urlencoded());  ////this is for handling forms
 //this is for handling jsons




app.use('/purchase', purchaseRoutes)

app.use('/password', resetPasswordRoutes);





User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);




let instance = new Razorpay({
  key_id: 'rzp_test_giNWR1K5EXXHvF  ', // your `KEY_ID`
  key_secret: 'qOfF7G9ru6LIcOkrNKjKxVjf  ' // your `KEY_SECRET`
})


app.use('/web', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post("/api/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
       res.send({"sub":data,"status":"success"});
}).catch((error) => {
       res.send({"sub":error,"status":"failed"});
})
});




app.post("/api/payment/verify",(req,res)=>{
body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
var crypto = require("crypto");
var expectedSignature = crypto.createHmac('sha256', 'qOfF7G9ru6LIcOkrNKjKxVjf')
                                .update(body.toString())
                                .digest('hex');
                                console.log("sig"+req.body.razorpay_signature);
                                console.log("sig"+expectedSignature);
var response = {"status":"failure"}
if(expectedSignature === req.body.razorpay_signature)
 response={"status":"success"}
    res.send(response);
});

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

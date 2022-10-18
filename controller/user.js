
// const User = require('../models/user');

//  const signup = (req, res)=>{
//     console.log("2445enter in signup");
//     const { name, email, password } = req.body;
//     console.log('nalini',req.body);

//     // const saltRounds = 10;
//     // bcrypt.genSalt(saltRounds, function(err, salt) {
//     //     bcrypt.hash(password, salt, function(err, hash) {
//     //         // Store hash in your password DB.
//     //         if(err){
//     //             console.log('Unable to create new user')
//     //             res.json({message: 'Unable to create new user'})
//     //         }
//             User.create({ name, email, password}).then(() => {
//                 res.status(201).json({message: 'Successfuly create new user'})
//             }).catch(err => {
//                 res.status(403).json(err);
//             })

//     };
    




// const login = (req, res) => {
//     User.findAll({where:{email:req.body.email}})
//     .then(user=>{
//         console.log(user[0].name,user[0].email,user[0].password)
//         console.log("userfound")
//     })
//     .catch(err=>console.log(err))
// }
//     // const { email, password } = req.body;
//     // console.log(password);
//     // User.findAll({ where : { email }}).then(user => {
//     //     if(user.length > 0){
//             // bcrypt.compare(password, user[0].password, function(err, response) {
//             //     if (err){
//             //     console.log(err)
//             //     return res.json({success: false, message: 'Something went wrong'})
//             //     }
//                 // if (response){
//                 //     console.log(JSON.stringify(user))
//                 //     const jwttoken = generateAccessToken(user[0].id);
//             //         res.json({token: jwttoken, success: true, message: 'Successfully Logged In'})
//             //     // Send JWT
//             //     } else {
//             //     // response is OutgoingMessage object that server response http request
//             //     return res.status(401).json({success: false, message: 'passwords do not match'});
//             //     }
//             // });
//         // } else {
//         //     return res.status(404).json({success: false, message: 'passwords do not match'})
//         // }
    


// module.exports = {
//     signup,
//     login,

// }
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const getsignup=(req,res,next)=>{
    
        res.render('/signup', {
          pageTitle: 'signup',
          path: '/signup',
          editing: false
        });
}

 const signup = (req, res)=>{
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                console.log('Unable to create new user')
                res.json({message: 'Unable to create new user'})
            }
            User.create({ name, email, password: hash }).then(() => {
                res.status(201).json({message: 'Successfuly create new user'})
            }).catch(err => {
                res.status(403).json(err);
            })

        });
    });
}

function generateAccessToken(id) {
    return jwt.sign(id ,process.env.TOKEN_SECRET);
}
const getlogin=(req,res,next)=>{
    res.render('/login', {
        pageTitle: 'login',
        path: '/login',
        editing: false
      });
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where : { email }}).then(user => {
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function(err, response) {
                if (err){
                console.log(err)
                return res.json({success: false, message: 'Something went wrong'})
                }
                if (response){
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({token: jwttoken, success: true, message: 'Successfully Logged In'})
                // Send JWT
                } else {
                // response is OutgoingMessage object that server response http request
                return res.status(401).json({success: false, message: 'passwords do not match'});
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'passwords do not match'})
        }
    })
}

module.exports = {
    signup,
    login,
    getsignup,
    getlogin,

}
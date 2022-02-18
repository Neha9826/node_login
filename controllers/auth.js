const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const async = require("hbs/lib/async");
var shortid = require('shortid');
const express = require("express");
const app = express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const bodyParser=require('body-parser');
const { Socket } = require('socket.io');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
// var socket=io.on('connection',function(socket){
//     return socket;
// })

exports.login = async (req, res) => 
{
    // console.log(req.body);

    try
    {
        const { email, password} = req.body;
        if(!email || !password )
        {
            return res.status(400).render('login', {
                message: 'You need email and password.'
            })
        } 

        await db.query(`SELECT * FORM users WHERE email = ${email}`, [email], async (error, results) => {
            if (error) throw error;
            console.log(results)
            // if(!results || !(await bcrypt.compare(password, results[0].password)))
            // {
            // // console.log(results)
            // // res.status(400).render('login', {
            // //         message: 'The email or password is incorrect'
            // // }) 
            // }
            if(results != undefined){
                const id = results[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expireIn: process.env.JWT_EXPIRE_IN
                });
                const cookieOptions = {
                    expires: new date (
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httponly: true,
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/")
            }
            else {
                
                console.log(results)
                res.status(400).render('login', {
                        message: 'The email or password is incorrect'
                }) 
            }          
        })
    }
    catch(error)
    {
        console.log(error);
    }

}


exports.register = (req, res) => 
{
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    // ------------------- (OR) --------------------

    const { fname, lname, email, password, passwordConfirm ,referral_code,referral_point} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error)
        {
            console.log(error);
        }
        if(results.length > 0 )
        {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm ){
            return res.render('register', {
                message: 'Password do not match'
            });
        } 

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        let referral_code = shortid.generate();
 
        let referral_point=0   
      //   referral code a user submitted
        let referrer =  req.body.referrer;
      
        if(referrer){       //updating referal point if user had some valid referal code
          console.log('check1')
          db.query(`SELECT referral_point from users WHERE referral_code='${referrer}'`,(err,rows)=>{
              if(err){ res.send(err) }
              console.log('check2')
              var increment= rows[0].referral_point;
              console.log(increment);
              db.query(`UPDATE users SET referral_point=${increment + 10} WHERE referral_code='${referrer}'`)
              console.log('check3')
              console.log(increment);
          })
                    
            var socket=io.on('connection',function(socket){
                return socket;
            })
            app.post('/register',function(req,res,next){ 

            let referrer =  req.body.referrer;

            if(referrer){       //updating referal point if user had some valid referal code
                console.log(referrer)
                db.query(`SELECT id, referral_point from customer2 WHERE referral_code='${referrer}'`,(err,rows)=>{
                    console.log('check4')
                    if(err) console.log("error at geeting id");
                    var uid=rows[0].id;
                    var points=rows[0].referral_point; 
                    console.log('check5 ' + points)
                    
                    console.log('check6')
                    socket.emit('2',`User registered with your referal code. Token Count=${points}`)       //emitting msg
                    //   res.render({id:uid});
                    console.log('check7')
                })
                }
            })
        //   db.query(`SELECT id, referral_point from users WHERE referral_code='${referrer}'`,(err,rows)=>{
        //         console.log('check4')
        //         if(err) console.log("error at geeting id");
        //         var uid=rows[0].id;
        //         var points=rows[0].referral_point; 
        //         console.log('check5 ' + points)
                
        //         console.log('id = ' +uid)
        //         socket.emit(uid,`User registered with your referal code. Token Count=${points}`)       //emitting msg
              //   res.render({id:uid});

            //   io.sockets.on('connection',function(socket){    
            //     socket.on('join',function(room){
            //         socket.join(room);
            //     });
            //     socket.on('room_message', function(data) {        
            //         io.to('room_one').emit('room_message',{world:'world'});
            //     });
            // // });
            //     console.log('check7')
            // })
        }
        else{
            res.render('/')
        }

        db.query('INSERT INTO users SET ?', {fname: fname, lname: lname, email: email, password: hashedPassword, referral_code: referral_code, referral_point: referral_point}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })

    });

    // res.send("Form submitted");
}

// app.get('/public/notification', function(req, res, next) {
//     res.render(__dirname+'/public/notification'); 
//   });

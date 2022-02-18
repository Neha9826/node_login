require('dotenv').config();
const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

var router = express.Router();
var shortid = require('shortid');

const server=require('http').Server(app);
const io=require('socket.io')(server);
const bodyParser=require('body-parser');
const { Socket } = require('socket.io');

const i=2;

dotenv.config({ path: './.env'});



const db = mysql.createPool({
    connectionLimit:70,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname + '/views/login')
// });


// app.get('/register',(req,res,next)=>{
//     // res.sendFile(__dirname + '/views/register')
    
//         res.render('register');
        
//     });
//         db.getConnection(function(error,tempConn){
//             if(!!error){
//                 tempConn.release();    // to release the connection completed or throwing error
//             console.log('Error here at 1');
//         }else{
//             console.log('Connected!');
//             var sql = `CREATE TABLE customer${i}`+ "(`id` INT(11) NOT NULL AUTO_INCREMENT,fname VARCHAR(255),lname VARCHAR(255),`hashpassword` VARCHAR(255), `email` VARCHAR(255) NOT NULL, `referral_code` VARCHAR(255) NOT NULL,`referral_point` INT(20) DEFAULT(0),PRIMARY KEY (`id`) )";
//             tempConn.query(sql, function (err, result){
//                 tempConn.release();
//                 if(!!err){
//                     console.log('Error in the query at 2');
//                 }else{
//                     console.log('Successful query Table created');
//                 } 
//             })
//         } 
//     }); 
// });


app.use(bodyParser.json())
// Parse URL-encoded bodies (as sent by HTML forms)

app.use(express.urlencoded({ extended: false }));
// PArse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'hbs');

// db.connect( (error) => {
//     if(error) {
//         console.log(error)
//     } else {
//         console.log("MYSQL Connected...")
//     }
// })

// io.sockets.on('connection',function(socket){    
//     socket.on('join',function(room){
//         socket.join(room);
//     });
//     socket.on('room_message', function(data) {        
//         io.to('room_one').emit('room_message',{world:'world'});
//     });
// });

// var socket=io.on('connection',function(socket){
//     return socket;
// })
// app.post('/register',function(req,res,next){ 

//   let referrer =  req.body.referrer;

//   if(referrer){       //updating referal point if user had some valid referal code
//     console.log(referrer)
//     db.query(`SELECT id, referral_point from customer2 WHERE referral_code='${referrer}'`,(err,rows)=>{
//           console.log('check4')
//           if(err) console.log("error at geeting id");
//           var uid=rows[0].id;
//           var points=rows[0].referral_point; 
//           console.log('check5 ' + points)
          
//           console.log('check6')
//           socket.emit(uid,`User registered with your referal code. Token Count=${points}`)       //emitting msg
//         //   res.render({id:uid});
//           console.log('check7')
//       })
//     }
// })
//   }
//   else{
//       res.send('Wrong Code')
//   }



app.get('/public/notification', function(req, res, next) {
    res.render(__dirname+'/public/notification'); 
  });

  




//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    // ------------------- (OR) --------------------

    const { name, email, password, passwordConfirm } = req.body;

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

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
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
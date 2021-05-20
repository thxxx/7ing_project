const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../config/database.js');
const passport = require('passport');
const conn = db.init();
const router = express.Router();


//test
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

router.get('/signin', (req, res) => { // 로그인 라우터
    res.render('../views/User/Signin');
})

router.get('/signup', (req, res) => { // 회원가입 페이지이동
    res.render('../views/User/SignUp');
})

router.post('/signup', (req, res) => { // 회원가입 로직

    console.log(req.body);

    var Originalpassword = req.body.User_password;

    if(req.body.User_password == req.body.User_password2) {
        
        bcrypt.genSalt(saltRounds, function(err, salt) {

        if(err) return res.status(200).json({SignUp : false, message : "salt produce error"});

        bcrypt.hash(Originalpassword, salt, function(err, hash) {

            if(err) return res.status(200).json({SignUp : false, message : "password encoding error"});

            else {

                var sql = "Insert into User (User_name, User_country, User_nickname, User_id, User_password, User_sex, User_birth) values (?,?,?,?,?,?,?)";

                var params = [req.body.User_name, req.body.User_country, req.body.User_nickname, req.body.User_id, hash, req.body.User_gender, req.body.User_birth];

                conn.query(sql, params, function (err, rows, fields) {

                if(err) {
                    // return res.status(200).json({SignUp : false, message : "Query Error"});
                    console.log(err);
                }

                else {

                    return res.status(200).json({SignUp : true});

                };

                });

            }

        });

        });
    } else {

        return res.status(200).json({SignUp : false, message : "Please password confirm"});

    }

})

router.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
          return res.status(400).json({loginSuccess : false, message : info});
        }
      if (!user) {
        console.log("아이디가 없거나 틀림");
        return res.status(200).json({loginSuccess : false, message : info});
      }
      req.logIn(user, function(err) {
        if (err) {
            // return res.status(400).json({loginSuccess : false, message : "query error"});
            console.log(err);
        }
        else {
            return res.status(200).json({loginSuccess : true, user : user});
        }
      });
    })(req, res, next);
  });


  router.get('/logout', (req, res) => {
      req.logout();
      req.session.destroy();
      res.redirect('http://localhost:3000/');
  })

module.exports = router;
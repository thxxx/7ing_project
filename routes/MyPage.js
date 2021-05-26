const express = require('express');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const db = require('../config/database.js');
const passport = require('passport');
const conn = db.init();
const router = express.Router();

// mysql 접속이 끊어지는 단점이 있어서 주기적으로 신호 보내서 안끊기게 임시방편
setInterval(function() { conn.query('SELECT 1'); }, 5000);

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/MyPage', (req, res) => {
    console.log("알이큐 유저 : ", req.user)
    res.render('../views/User/MyPage', {
        user: req.user
    })
})


router.post('/modifymyinfo', (req, res) => {

    console.log(req.body)

    var sql = "UPDATE User SET User_name=?, User_nickname=?, User_sex=?, User_birth=?  WHERE User_code = ?;"

    var params = [req.body.User_name, req.body.User_nickname, req.body.User_gender, req.body.User_birth, req.user.User_code]

    conn.query(sql, params, (err, result) => {
        if (err) {
            throw err
        } else {
            var sql2 = "INSERT INTO InterestCountry (User_code, Country_name) VALUES (?,?);";
            var params2 = [req.user.User_code, req.body.prefer_nation1];
            conn.query(sql2, params2, (err, result2) => {
                if (err) {
                    throw err;
                } else {
                    return res.status(200).json({ ModifyInfoDone: true });
                }
            })
        }
    })
})


router.get('/MyApplyPid', (req, res) => {

    var sql = "SELECT * FROM Pid_apply LEFT JOIN Pid ON Pid_apply.Pid_code=Pid.Pid_code WHERE Pid_apply.Apply_User_code=?";

    var params = [req.user.User_code];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('../views/MyPage/MyApplyPid', {
                user: req.user,
                applypiddata: result
            });
        }
    })
})

router.get('/ReplyToMyPid', (req, res) => {

    var sql = "SELECT * FROM Pid LEFT JOIN Pid_reply ON Pid_reply.Pid_code=Pid.Pid_code WHERE Pid.User_code=?;";
    var params = [req.user.User_code];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('../views/MyPage/ReplyToMyPid', { replyToMyPid: result })
        }
    })
})


router.get('/ApplyToMyPid', (req, res) => {

    var sql = "SELECT * FROM Pid LEFT JOIN Pid_apply ON Pid_apply.Pid_code=Pid.Pid_code LEFT JOIN User ON Pid_apply.Apply_User_code=User.User_code WHERE Pid.User_code=?;";
    var params = [req.user.User_code];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Rrr", result);
            res.render('../views/MyPage/ApplyToMyPid', { applyToMyPid: result })
        }
    })
})

module.exports = router;
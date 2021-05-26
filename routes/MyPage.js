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

router.post('/rejectApply', (req, res) => {

    console.log("거절")

    var sql = "UPDATE Pid_apply SET Pa_enter=? WHERE Pa_code = ?;"

    var params = [1, req.body.Pa_code];

    conn.query(sql, params, (err, result) => {
        if (err) {
            throw err
        } else {
            return res.status(200).json({ rejectApplyDone: true });
        }
    })
})

router.post('/acceptApply', (req, res) => {

    console.log("수락")

    var sql = "UPDATE Pid_apply SET Pa_enter=? WHERE Pa_code = ?;"

    var params = [2, req.body.Pa_code];

    conn.query(sql, params, (err, result) => {
        if (err) {
            throw err
        } else {
            var sql2 = "SELECT * FROM Pid_apply WHERE Pa_code=?";
            var params2 = [req.body.Pa_code];
            conn.query(sql2, params2, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    var sql3 = "SELECT * FROM Pid WHERE Pid_code=?";
                    var params3 = [result2[0].Pid_code];
                    conn.query(sql3, params3, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            console.log("r3", result3);
                            var sql4 = "UPDATE Pid SET Pid_currentNumber=? WHERE Pid_code=?";
                            var params4 = [result3[0].Pid_currentNumber + 1, result2[0].Pid_code];
                            conn.query(sql4, params4, (err4, result4) => {
                                if (err4) throw err4;
                                else {
                                    return res.status(200).json({ acceptApplyDone: true });
                                }
                            })

                        }
                    })
                }
            })
        }
    })
})

router.get('/toMyReply', (req, res) => {

    var sql = "SELECT * FROM Pid LEFT JOIN Pid_reply ON Pid_reply.Pid_code=Pid.Pid_code WHERE Pid_reply.Pr_author=?";
    var params = [req.user.User_name];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Rrr", result);
            res.render('../views/MyPage/MyReply', { myReply: result })
        }
    })
})

module.exports = router;
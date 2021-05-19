const express = require('express');
const saltRounds = 10;
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

setInterval(function() { conn.query('SELECT 1'); }, 5000);

// router.get('/pid', (req, res) => { // 로그인 라우터
//     res.render('../views/User/Signin');
// })

// router.get('/signup', (req, res) => { // 회원가입 페이지이동
//     res.render('../views/User/SignUp');
// })

router.get('/writepid', (req, res) => { // 게시글작성 페이지 이동
    res.render('../views/Pid/WritePid', {
        user: req.user ? req.user : ""
    });
})

router.post('/writepid', (req, res) => { // 게시글작성
    console.log("유저코드 : ", req.user.User_code);
    var sql = "Insert into Pid (User_code, Pid_title, Pid_content, Pid_dday, Pid_recruitNumber, Pid_religion, Pid_finish) values (?,?,?,?,?,?,?)";

    var params = [req.user.User_code, req.body.Pid_title, req.body.Pid_content, req.body.Pid_dday, req.body.Pid_recruitNumber, req.body.Pid_religion, 0];

    conn.query(sql, params, function(err, rows, fields) {

        if (err) {
            // return res.status(200).json({SignUp : false, message : "Query Error"});
            console.log(err);
        } else {
            return res.status(200).json({ WritePidDone: true });
        };

    });

})

router.get(`/DetailPid`, (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Pid where Pid_code=?";

    var params = [req.query.pid_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        var sql2 = "SELECT * FROM User where User_code=?";

        var params2 = [result_pid[0].User_code];
        conn.query(sql2, params2, (err, result_user, fields) => {

            if (err) {
                console.log(err);
            } else {
                console.log("result", result_user[0]);
                console.log("result", result_pid[0]);
                res.render('../views/Pid/DetailPid', {
                    piddata: result_pid[0],
                    user: result_user[0]
                });
            }
        })
    })

})

router.post('/DetailPid', (req, res) => { // 게시글작성 페이지 이동
    res.render(`../views/Pid/DetailPid`);
})

router.post('/GoodUp', (req, res) => { // 게시글작성 페이지 이동

    var sql = "UPDATE Pid SET Pid_good=? WHERE Pid_code=?";

    var params = [req.body.Pid_good + 1, req.body.Pid_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        if (err) console.log(err);
        else {
            res.json({ GoodUpDone: True });
        }
    })
})

module.exports = router;
const express = require('express');
const saltRounds = 10;
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

// mysql 접속이 끊어지는 단점이 있어서 주기적으로 신호 보내서 안끊기게 임시방편
setInterval(function() { conn.query('SELECT 1'); }, 5000);

router.get('/writepid', (req, res) => { // 게시글작성 페이지 이동
    res.render('../views/Pid/WritePid', {
        user: req.user ? req.user : ""
    });
})

router.post('/writepid', (req, res) => { // 게시글작성
    var sql = "Insert into Pid (User_code, Pid_title, Pid_content, Pid_dday, Pid_recruitNumber, Pid_religion, Pid_finish) values (?,?,?,?,?,?,?)";

    var params = [req.user.User_code, req.body.Pid_title, req.body.Pid_content, req.body.Pid_dday, req.body.Pid_recruitNumber, req.body.Pid_religion, 0];

    // 입력 받은 내용대로 sql문 query 작성
    conn.query(sql, params, function(err, rows, fields) {

        if (err) {
            console.log(err);
        } else {
            return res.status(200).json({ WritePidDone: true });
        };

    });

})

router.get(`/DetailPid`, (req, res) => { // 게시글 하나 클릭시 거기로 이동 

    // 해당 Pid_code 와 일치하는 데이터를 읽어온다.
    var sql = "SELECT * FROM Pid where Pid_code=?";

    var params = [req.query.pid_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        // 해당 pid의 User_code와 일치하는 데이터를 불러온다.
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
    var sql = "SELECT * FROM Pid where Pid_code=?";

    var params = [req.body.pid_code];

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

router.post('/likeUp', (req, res) => { // 좋아요 클릭시.

    //console.log(req.body);

    var Pid_good = parseInt(req.body.Pid_good);
    var Pid_code_like = parseInt(req.body.Pid_code_like);

    var sql = "UPDATE Pid SET Pid_good=? WHERE Pid_code=?";

    var params = [Pid_good, Pid_code_like];

    conn.query(sql, params, (err, result_pid, fields) => {
        if (err) console.log(err);
        else {
            return res.status(200).json({ LikeUpDone: true });
        }
    })
})

module.exports = router;
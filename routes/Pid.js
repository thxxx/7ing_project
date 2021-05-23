const express = require('express');
const saltRounds = 10;
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

// mysql 접속이 끊어지는 단점이 있어서 주기적으로 신호 보내서 안끊기게 임시방편
setInterval(function() { conn.query('SELECT 1'); }, 5000);

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.piddata = req.piddata;
    next();
    // 미들웨어 개념에서 모든요청에 앞서서 다 실행되니까 여기에 next를 안써주면 반환값도 없어서 다음요청이 실행이 안된다.
    // next()는 로컬변수가 전역변수 느낌인데, locals use는 get, post 안가리고 다 받는다.
})


router.get('/DetailPid', (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Pid LEFT JOIN Pid_reply ON Pid.Pid_code=Pid_reply.Pid_code WHERE Pid_code=?";

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
                    pidcode: req.body.pid_code,
                    user: result_user[0]
                });
            }
        })
    })
})

router.post('/DetailPid', (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Pid LEFT JOIN Pid_reply ON Pid.Pid_code=Pid_reply.Pid_code WHERE Pid.Pid_code=?;";
    // 댓글이 하나도 없는 상태라면 Pid.Pid_code도 null이 되는 오류가 발생한다.

    var params = [req.body.pid_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        var sql2 = "SELECT * FROM User where User_code=?";

        var params2 = [result_pid[0].User_code];
        conn.query(sql2, params2, (err, result_user, fields) => {

            if (err) {
                console.log(err);
            } else {
                console.log("result user", result_user[0]);
                console.log("result pid", result_pid);
                res.render('../views/Pid/DetailPid', {
                    piddata: result_pid,
                    pidcode: req.body.pid_code,
                    user: result_user[0]
                });
            }
        })
    })
})


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

router.post('/likeUp', (req, res) => { // 좋아요 클릭시.

    //console.log(req.body);

    var Pid_good = parseInt(req.body.Pid_good);
    var Pid_code = parseInt(req.body.Pid_code);

    var sql = "UPDATE Pid SET Pid_good=? WHERE Pid_code=?";

    var params = [Pid_good + 1, Pid_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        if (err) console.log(err);
        else {
            console.log("Pid_good", Pid_good);
            return res.status(200).json({ LikeUpDone: true, Pid_good: Pid_good });
        }
    })
})


router.post('/applyPid', (req, res) => { // 좋아요 클릭시.

    console.log("pid code", req.body.Pid_code);

    var Pid_code = parseInt(req.body.Pid_code);

    var sql = "SELECT * FROM Pid WHERE Pid_code=?";

    var params = [Pid_code];

    conn.query("SELECT * FROM Pid WHERE Pid_code=?", [Pid_code], (err, result, fields) => {
        if (err) console.log(err);
        else {

            if (result[0].Pid_currentNumber >= result[0].Pid_recruitNumber) {
                var full_member = true;
                var add = result[0].Pid_currentNumber;
            } else {
                var full_member = false;
                var add = result[0].Pid_currentNumber + 1;
            }

            var sql2 = "UPDATE Pid SET Pid_currentNumber = ? WHERE Pid_code = ?";

            var params2 = [add, result[0].Pid_code];

            console.log(result[0]);

            conn.query(sql2, params2, (err, result_pid, fields) => {
                if (err) console.log(err);
                else {
                    if (full_member) {
                        return res.status(200).json({ ApplyPidDone: true, Pid_currentNumber: add });
                    } else {
                        return res.status(200).json({ ApplyPidDone: false, Pid_currentNumber: add });
                    }
                }
            })
        }
    })
})

router.post('/writeReply', (req, res) => {

    console.log("req user : ", req.user);

    console.log("req body : ", req.body);

    var sql = "INSERT INTO Pid_reply (Pid_code, Pr_writeDate, Pr_content, Pr_author) VALUES (?,Now(),?,?);"
    var params = [req.body.Pid_code, req.body.Pid_content, req.user.User_name];

    conn.query("INSERT INTO Pid_reply (Pid_code, Pr_writeDate, Pr_content, Pr_author) VALUES (?,Now(),?,?);", [req.body.Pid_code, req.body.Pid_content, req.user.User_name], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("결과 : ", result);
            return res.status(200).json({ WriteReplyDone: true });
        }
    })
})

module.exports = router;
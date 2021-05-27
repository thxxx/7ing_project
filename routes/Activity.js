const express = require('express');
const saltRounds = 10;
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

// mysql 접속이 끊어지는 단점이 있어서 주기적으로 신호 보내서 안끊기게 임시방편
setInterval(function() { conn.query('SELECT 1'); }, 5000);


router.get('/', (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Activity LEFT JOIN User ON Activity.User_code=User.User_code;";

    conn.query(sql, (err, result) => {
        if (err) console.log(err);
        else {
            var sql2 = "SELECT * FROM Activity LEFT JOIN User ON Activity.User_code=User.User_code ORDER BY Activity.At_currentNumber DESC;";
            conn.query(sql2, (err2, result2) => {
                if (err2) {
                    throw err2;
                } else {
                    res.render('../views/Activity/MainActivity', {
                        actdata: result, // 배열로 여러 액티비티가 다 날아갑니다
                        rank: result2
                    });
                }
            });
        }
    })
})

router.get('/WriteActivity', (req, res) => { // 게시글작성 페이지 이동
    res.render('../views/Activity/WriteActivity', {
        user: req.user ? req.user : ""
    });
})

router.post('/WriteActivity', (req, res) => { // 게시글작성
    var sql = "INSERT INTO Activity (User_code, At_title, At_content, At_recruitNumber, At_hostIntro, At_place, At_intro, At_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    var params = [req.user.User_code, req.body.At_title, req.body.At_content, req.body.At_recruitNumber, "what?", req.body.At_place, "인트로가 뭐야?", req.body.At_price];

    // 입력 받은 내용대로 sql문 query 작성
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            return res.status(200).json({ WriteActivityDone: true });
        };

    });

})

router.post('/DetailActivity', (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Activity WHERE At_code=?;";

    var params = [req.body.At_code];

    console.log("req body", req.body);

    conn.query(sql, params, (err, result_at, fields) => {
        var sql2 = "SELECT * FROM User where User_code=?";

        var params2 = [result_at[0].User_code];
        conn.query(sql2, params2, (err, result_user, fields) => {

            if (err) {
                console.log(err);
            } else {
                console.log("result user", result_user[0]);
                console.log("result At", result_at);
                res.render('../views/Activity/DetailActivity', {
                    atdata: result_at[0],
                    atcode: req.body.At_code,
                    user: result_user[0]
                });
            }
        })
    })
})


router.post('/applyActivity', (req, res) => { // 좋아요 클릭시.

    var At_code = parseInt(req.body.At_code);

    conn.query("SELECT * FROM Activity WHERE At_code=?", [At_code], (err, result, fields) => {
        if (err) console.log(err);
        else {

            if (result[0].At_currentNumber >= result[0].At_recruitNumber) {
                var full_member = true;
                var add = result[0].At_currentNumber;
            } else {
                var full_member = false;
                var add = result[0].At_currentNumber;
            }

            var sql2 = "Insert into At_apply (At_code, Aa_id, Apply_User_code) values (?,?,?);";
            var params2 = [result[0].At_code, "Aa_id", req.user.User_code];
            conn.query(sql2, params2, (err2, result_apply) => {
                if (full_member) {
                    return res.status(200).json({ ApplyActivityDone: false, At_currentNumber: add });
                } else {
                    return res.status(200).json({ ApplyActivityDone: true, At_currentNumber: add });
                }
            })
        }
    })
})


router.post('/likeUp', (req, res) => { // 좋아요 클릭시.

    var At_good = parseInt(req.body.At_good);
    var At_code = parseInt(req.body.At_code);

    var sql = "UPDATE Activity SET At_good=? WHERE At_code=?";

    var params = [At_good + 1, At_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        if (err) console.log(err);
        else {

            var sql2 = "INSERT INTO At_like (At_code, Atl_id) VALUES (?,?);";
            var params2 = [req.body.At_code, req.user.User_id];

            conn.query(sql2, params2, (err2, result2) => {
                if (err2) console.log(err2);
                else {
                    return res.status(200).json({ LikeUpDone: true });
                }
            })
        }
    })
})

router.post('/Payforactivity', (req, res) => { // 좋아요 클릭시.

    var At_code = parseInt(req.body.At_code);

    var sql = "UPDATE At_apply SET Aa_enter=3 WHERE At_code=? and Apply_user_code=?";

    var params = [At_code, req.user.User_code];

    conn.query(sql, params, (err, result_pid, fields) => {
        if (err) console.log(err);
        else {
            return res.status(200).json({ Done: true });
        }
    })
})


module.exports = router;
const express = require('express');
const saltRounds = 10;
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

// mysql 접속이 끊어지는 단점이 있어서 주기적으로 신호 보내서 안끊기게 임시방편
setInterval(function() { conn.query('SELECT 1'); }, 5000);


router.get('/', (req, res) => { // 게시글작성 페이지 이동

    var sql = "SELECT * FROM Activity LEFT JOIN User ON Activity.User_code=User.User_code;";

    console.log(req);

    conn.query(sql, (err, result) => {
        if (err) console.log(err);
        else {
            console.log("result 입니다", result)
            res.render('../views/Activity/MainActivity', {
                actdata: result // 배열로 여러 액티비티가 다 날아갑니다
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

module.exports = router;
const express = require('express');
const db = require('../config/database.js');
const conn = db.init();
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.data = req.data;
    next();
    // 미들웨어 개념에서 모든요청에 앞서서 다 실행되니까 여기에 next를 안써주면 반환값도 없어서 다음요청이 실행이 안된다.
    // next()는 로컬변수가 전역변수 느낌인데, locals use는 get, post 안가리고 다 받는다.
})


router.get('/', (req, res, next) => { // 시작
    // Pid 데이터와 User 데이터를 보낸다.
    conn.query("SELECT * FROM Pid LEFT JOIN User ON Pid.User_code=User.User_code ORDER BY Pid_good DESC LIMIT 4;", (err, sorted_result, fileds) => {
            if (err) console.log("err", err);
            else {
                conn.query("SELECT * FROM Pid LEFT JOIN User ON Pid.User_code=User.User_code;", function(err, result, fields) {
                    if (err) throw err;
                    else {
                        console.log(result);
                        res.render('../views/index', {
                            data: result, // Pid data 
                            user: req.user ? req.user : "", // 현재 로그인한 유저
                            sorted_good: sorted_result // 좋아요순으로 정렬된 Pid 4개의 데이터
                        });
                    }
                });
            }
        })
        // res.render('../views/index', { user: req.user ? req.user : "", data: req.data ? req.data : "" });
        // send는 보내주려고 하는 메시지만 보내고
        // 렌더는 실제 페이지로 이동하면서 정보까지 같이 보내준다.
})

module.exports = router;
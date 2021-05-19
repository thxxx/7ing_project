const passport = require('passport');
const local = require('./localStrategy');
const db = require('../config/database.js');
const conn = db.init();

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log("시리얼라이즈");
        done(null, user.User_code);
    });

    passport.deserializeUser((id, done) => {
        //성공한 정보갖고 활용할때 새로고침할때 계속 사용된다.
        // User_code가 id(첫번째 인자)로 넘어온다.
        console.log("Hello World", id);
        var sql = 'SELECT * FROM User where User_code = ?';
        conn.query(sql, id, function(err, rows, fields) {
            if (err) console.log('query is not excuted. select fail...\n' + err);
            else {
                //console.log("디시리얼라이즈", rows[0]);
                done(null, rows[0]);
            } //rows[0] 로 넘어간다.
        });
    })

    local();
}
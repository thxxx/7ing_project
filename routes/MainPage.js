const express = require('express');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const db = require('../config/database.js');
const passport = require('passport');
const conn = db.init();
const router = express.Router();

//const mainPage = fs.readFileSync('../views/index.ejs', 'utf8');

router.get('/getdata', (req, res) => { // 시작
    conn.query("SELECT * FROM Pid;", function(err, result, fields) {
        if (err) throw err;
        else {
            res.render('../views/index', {
                title: "Temporary Title",
                data: result,
            });
        }
    });
})

module.exports = router;
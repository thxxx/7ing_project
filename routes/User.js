const express = require('express');

const router = express.Router();

router.get('/signin', (req, res) => { // 로그인 라우터
    res.render('../views/User/Signin');
})

router.get('/signup', (req, res) => { // 회원가입 라우터
    res.render('../views/User/SignUp');
})

router.post('/signin', (req, res) => {
    console.log(req.body.User_id);

})
module.exports = router;
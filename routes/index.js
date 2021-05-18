const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})


router.get('/', (req, res, next) => { // 시작
    res.render('../views/index', {user : req.user ? req.user : ""});
})

module.exports = router;
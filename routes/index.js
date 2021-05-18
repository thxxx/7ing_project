const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { // 시작
    res.render('../views/index');
})

module.exports = router;
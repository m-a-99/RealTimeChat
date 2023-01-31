const router = require('express').Router();
const { get_login ,post_login ,get_signup, post_signup } = require('./../controllers/authcontroller.js')

router.get("/login",get_login)
router.post("/login", post_login)

router.get("/signup", get_signup)
router.post("/signup", post_signup)

module.exports = router;

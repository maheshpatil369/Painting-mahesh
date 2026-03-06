const express = require('express');
console.log("AUTH ROUTES LOADED");

const router = express.Router();
const { signup, login, refreshTokenHandler, logout, me } = require('../controllers/authcontroller');
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;

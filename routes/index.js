import { Router } from 'express';
const Router = require('');
const register = require('./../controllers/users');

const usersRouter = new Router();

usersRouter.post('/users/register', register);

module.exports = { usersRouter };
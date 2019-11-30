const Router = require('koa-router');

const user = require('./controller/user');

const router = new Router();

router.get('/users', user.getUsers);
router.get('/users/:id', user.getUser);
router.post('/users', user.createUser);
router.patch('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

module.exports = router;

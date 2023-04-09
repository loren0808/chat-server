var express = require('express');
var router = express.Router();
const { UserModel, ChatModel } = require('../db/models')
const md5 = require('blueimp-md5')
const filter = { password: 0, __v: 0 }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//注册路由
router.post('/register', (req, res) => {
  const { username, password, type } = req.body
  UserModel.findOne({ username }).then(user => {
    if (user) {
      res.json({ code: 1, msg: '此用户已存在' })
    } else {
      new UserModel({ username, password: md5(password), type }).save()
        .then(user => {
          const data = { username, type, _id: user._id }
          res.cookie('userid', user._id.toHexString(), { maxAge: 1000 * 60 * 60 * 24 })
          res.json({ code: 0, data })
        })
    }
  })
})

//登录路由

router.post('/login', (req, res) => {
  const { username, password } = req.body
  UserModel.findOne({ username, password: md5(password) }, filter).then(user => {
    if (user) {
      res.cookie('userid', user._id.toHexString(), { maxAge: 1000 * 60 * 60 * 24 })
      res.json({ code: 0, data: user })
    } else {
      res.json({ code: 1, msg: '用户名或密码不正确' })
    }
  })
})

//更新用户信息
router.post('/update', (req, res) => {
  const userid = req.cookies.userid
  if (!userid) {
    res.json({ code: 1, msg: '请先登录' })
  } else {
    const user = req.body
    UserModel.findByIdAndUpdate({ _id: userid }, user).then(oldUser => {
      if (!oldUser) {
        res.clearCookie('userid')
      } else {
        // console.log(oldUser)
        const { _id, username, type } = oldUser
        res.json({ code: 0, data: Object.assign(user, { _id, username, type }) })
      }
    })
  }
})

//根据cookie获取用户信息
router.get('/user', (req, res) => {
  const userid = req.cookies.userid
  if (!userid) {
    res.json({ code: 1, msg: '请先登录' })
  } else {
    UserModel.findOne({ _id: userid }, filter).then(user => {
      if (user) {
        res.json({ code: 0, data: user })
      } else {
        res.json({ code: 1, msg: '未查询到该用户' })
      }
    })
  }
})


//查询用户列表
router.get('/list', (req, res) => {
  const { type } = req.query
  UserModel.find({ type }, filter).then(users => {
    res.json({ code: 0, data: users })
  })
})


//获取当前用户聊天信息列表
router.get('/msglist', async(req, res) => {
  const userid = req.cookies.userid
  
  let chatMsgs = []
  const users = {}
  const query = ChatModel.find({}, { __v: 0 })
  query.or([{ from: userid }, { to: userid }])
  chatMsgs = await query
  UserModel.find({}, filter).then(docs => {
    docs.forEach(doc => {
      users[doc._id] = { username: doc.username, header: doc.header }
    })
    res.json({ code: 0, data: { users, chatMsgs } })
  })
})

//修改消息为已读
router.post('/readmsg', (req, res) => {
  const from = req.body.from
  const to = req.cookies.userid
  ChatModel.updateMany({ from, to, read: false }, { read: true }).then(
    doc => {
      res.json({ code: 0, data: doc.modifiedCount })
    }
  )
})

//测试：添加消息
router.post('/addmsg', (req, res) => {
  const { from, to, content } = req.body
  const chat_id = [from, to].sort().join('_')
  const create_time = Date.now()
  ChatModel({ chat_id, from, to, creat_time, content }).save().then(
    chatMsg => {
      res.json({ code: 0, data: chatMsg })
    }
  )
  // new ChatModel({ username, password: md5(password), type }).save()
  //   .then(user => {
  //     const data = { username, type, _id: user._id }
  //     res.cookie('userid', user._id.toHexString(), { maxAge: 1000 * 60 * 60 * 24 })
  //     res.json({ code: 0, data })
  //   })
})

//测试：删除全部用户
router.get('/users', (req, res) => {
  ChatModel.deleteMany().then(chats => {
    const data = chats
    res.json({ code: 0, data })
  })

  // UserModel.deleteMany().then(users => {
  //   const data = users
  //   res.json({ code: 0, data })
  // })
})


module.exports = router;

const mongoose = require('mongoose')

const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/test')

const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    type: { type: String, require: true },
    header: { type: String },
    post: { type: String },
    info: { type: String },
    company: { type: String },
    salary: { type: String }
})

const UserModel = connection.model('user', userSchema)

const chatSchema = mongoose.Schema({
    from: { type: String, require: true },
    to: { type: String, require: true },
    chat_id: { type: String, require: true },
    content: { type: String },
    read: { type: Boolean, default: false },
    create_time: { type: Number, require: true },
})

const ChatModel = connection.model('chat', chatSchema)

exports.ChatModel = ChatModel
exports.UserModel = UserModel
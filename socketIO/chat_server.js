
const { ChatModel } = require('../db/models')

const connectedUsers = new Map()

module.exports = function (server) { // 得到IO对象 
    const { Server } = require('socket.io')
    const io = new Server(server)



    // 监视连接(当有一个客户连接上时回调) 
    io.on('connection', (socket) => {
        console.log('连接了一个客户端',socket.id)
        // 保存id
        socket.on('login', userid => { connectedUsers.set(userid, socket.id) })
        socket.on('logout', userid => { connectedUsers.delete(userid) })

        // 绑定sendMsg监听, 接收客户端发送的消息 
        socket.on('sendMsg', function ({ from, to, content }) {
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()
            ChatModel({ chat_id, from, to, create_time, content }).save().then(
                chatMsg => {
                    if (connectedUsers.has(to)) {
                        const socketid = connectedUsers.get(to)
                        // 给对方发消息
                        socket.to(socketid).emit('receiveMsg', chatMsg)
                    }
                    // 给自己发消息
                    socket.emit('receiveMsg', chatMsg)
                }
            )
        })
    })
}
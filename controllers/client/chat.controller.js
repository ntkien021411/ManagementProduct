

// [GET] /chat
module.exports.index =  async (req, res) => {
    _io.on('connection', (socket) => {
        console.log('a user connected');
        console.log(socket.id);
      });
  res.render("client/pages/chat/index",{
    title:"Chat",
  });
};
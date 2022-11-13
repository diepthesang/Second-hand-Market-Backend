module.exports = {
  connection: (socket) => {
    console.log('***** a user connect', socket.id);
    socket.on('userBid', bid => {
      console.log(`userBid:::${bid}`);
      _io.emit('userBid', bid)
    });

    socket.on('coundoe', timer => {
      console.log('countdown time:::', timer);
      _io.emit('countdownTime', timer);
    })

  }
}

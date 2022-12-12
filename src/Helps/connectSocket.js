module.exports = {
  connection: (socket) => {
    console.log('***** a user connect', socket.id);
    socket.on('userBid', bid => {
      // console.log(`userBid:::${bid}`);
      _io.emit('userBid', bid)
    });

    socket.on('test', test => {
      // console.log('test socket:::', test);
      _io.emit('test', test);
    })

    socket.on('qtyBiddingPost', qty => {
      _io.emit('qtyBiddingPost', qty)
    })

    socket.on('qtyCart', qty => {
      _io.emit('qtyCart', qty)
    })

  }
}

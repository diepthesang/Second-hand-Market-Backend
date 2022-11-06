var fs = require('fs');

module.exports = {
  deleteMultiFiles: (arrFile) => {
    for (let item in arrFile) {
      fs.unlink(`${__dirBaseRoot}/${arrFile[item].path}`, (err) => {
        console.log(err);
      })

    }
  },

  validateEmail: (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  },
}
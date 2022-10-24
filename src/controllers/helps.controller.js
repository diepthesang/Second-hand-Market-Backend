var fs = require('fs');

module.exports = {
  deleteMultiFiles: (arrFile) => {
    for (let item in arrFile) {
      fs.unlink(`${__dirBaseRoot}/${arrFile[item].path}`, (err) => {
        console.log(err);
      })

    }
  }
}
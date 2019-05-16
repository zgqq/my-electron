const fileutil = {
  getFileType (filename) {
    const readChunk = require('read-chunk')
    const fileType = require('file-type')

    const buffer = readChunk.sync(filename, 0, fileType.minimumBytes)

    return fileType(buffer)
  },
  isGif (filename) {
    var type = this.getFileType(filename)
    return type.ext === 'gif'
  },
  downloadImage (uri, filename, callback) {
    var fs = require('fs')
    var request = require('request')
    request.head(uri, function (err, res, body) {
      if (err) throw err
      console.log('content-type:', res.headers['content-type'])
      console.log('content-length:', res.headers['content-length'])
      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on('close', callback)
    })
  }
}

export default fileutil

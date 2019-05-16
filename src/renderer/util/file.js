const fileutil = {
  getFileType (filename) {
    const readChunk = require('read-chunk')
    const fileType = require('file-type')

    const buffer = readChunk.sync(filename, 0, fileType.minimumBytes)

    return fileType(buffer)
  }
}

export default fileutil

const crypto = {
  md5 (text) {
    var crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(text)
      .digest('hex')
  }
}

export default crypto

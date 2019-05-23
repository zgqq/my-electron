const stringUtil = {
  toPinyin (string) {
    const pinyin = require('pinyin')
    return pinyin(string, {
      style: pinyin.STYLE_NORMAL
    })
  },
  toPinyinString (string) {
    return this.toPinyin(string).join('')
  },
  toPinyinAndJoinHyphen (string) {
    return this.toPinyin(string).join('-')
  }
}

export { stringUtil }

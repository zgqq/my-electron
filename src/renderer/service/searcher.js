const imageService = {
  lastSearchValue: '',
  lastSearcher: '',
  lastImgList: [],
  lastImgIndex: 1,
  search (
    value,
    callback,
    type = 'sogou',
    fetch = {
      columnCount: 3,
      rowCount: 2
    }
  ) {
    let queryUrl
    let patt
    if (type === 'sogou') {
      queryUrl =
        'https://pic.sogou.com/pics?query=' +
        value +
        ' 表情包&di=2&_asf=pic.sogou.com&w=05009900&sut=9393&sst0=1556705686429'
      patt = /"thumbUrl":"(.+?)"/g
    } else if (type === 'baidu') {
      queryUrl =
        'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=' +
        '&sf=1&fmq=1556729374609_R&pv=&ic=&nc=1&z=&hd=&latest=&copyright=&se=1&showtab=0&fb=0&width=&height=&face=0' +
        '&istype=2&ie=utf-8&ctd=1556729374611%5E00_617X698&sid=&word=' +
        value +
        ' 表情包'
      patt = /"thumbURL":"(.+?)"/g
    } else {
      console.log('unknown type')
      return
    }

    const reload = value !== this.lastSearchValue || type !== this.lastSearcher
    // const reload = true
    const axios = require('axios')

    const columnCount = fetch.columnCount
    const rowCount = fetch.rowCount

    this.lastSearchValue = value
    this.lastSearcher = type

    if (reload) {
      axios
        .get(queryUrl)
        .then(response => {
          let r = []
          let imgList = []
          let index = 0
          do {
            r = patt.exec(response.data)
            if (r) {
              console.log('url' + r[1])
              imgList[index++] = r[1]
            }
          } while (r)

          let result = this.fetchImage(imgList, columnCount, rowCount)
          this.lastImgList = imgList
          this.lastImgIndex = result.endIndex
          callback(result.imageItems)
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      let offset = this.lastImgIndex + 1
      if (offset >= this.lastImgList.length) {
        offset = 0
      }
      let result = this.fetchImage(
        this.lastImgList,
        columnCount,
        rowCount,
        offset
      )
      this.lastImgIndex = result.endIndex
      callback(result.imageItems)
    }
  },
  fetchImage (imgList, columnCount, rowCount, offset = 0) {
    let endIndex = imgList.length - 1
    let images = []
    let i = 0
    let imageIndex = 0
    let itemIndex = 0
    let imageItems = [images]
    for (let j = offset; j < imgList.length; j++) {
      const imgUrl = imgList[j]
      if (i % columnCount === 0 && i > 0) {
        images = []
        imageIndex = 0
        imageItems[++itemIndex] = images
      }
      images[imageIndex++] = { imgFile: imgUrl, filePath: '' }
      i++
      if (i >= columnCount * rowCount) {
        endIndex = j
        break
      }
    }
    return {
      endIndex: endIndex,
      imageItems: imageItems
    }
  }
}

export { imageService }

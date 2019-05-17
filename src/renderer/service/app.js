import fileutil from '../util/file.js'

const appService = {
  hideApp () {
    require('electron').ipcRenderer.send('hide-app')
  }
}
const clipboardService = {
  writeImage (filepath) {
    var fileType = fileutil.getFileType(filepath)
    var ext = fileType.ext
    console.log('fileType' + fileType.ext)
    // var ext = path.extname(obj.imgFile)
    const electron = require('electron')
    if (ext === 'gif') {
      electron.clipboard.writeBuffer(
        'NSFilenamesPboardType',
        Buffer.from(
          `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
      <array>
        <string>${filepath}</string>
      </array>
    </plist>
  `
        )
      )
    } else {
      // const filepath = testFolder + obj.filename
      // const filepath = obj.imgFile.replace('file://', '')
      const image = electron.nativeImage.createFromPath(filepath)
      console.log('filepath ' + filepath)
      electron.clipboard.writeImage(image)
    }
  }
}

export { appService, clipboardService }

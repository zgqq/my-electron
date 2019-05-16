const appService = {
  hideApp () {
    require('electron').ipcRenderer.send('hide-app')
  }
}

export default appService

import UI from './UI'

chrome.runtime.onMessage.addListener( (data) => {
  if (data.action) {
    switch (data.action) {
      case "force_login":
        let msg = data.msg || false
        UI.setup().error(msg).showLogin()
        break
      case 'save':
      case 'saving':
        UI.setup().saveProgress()
        break
      case 'saved':
        UI.setup().saveSuccess()
        break
    }
  }
})

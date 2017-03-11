import UI from './UI'

const ui = new UI()

chrome.runtime.onMessage.addListener( (data) => {
  if (data.action) {
    ui.setup()
    switch (data.action) {
      case "force_login":
        ui.showLogin()
        if (data.msg) {
          ui.error(data.msg)
        }
        break
      case 'saving':
        ui.saveProgress()
        break
      case 'saved':
        ui.saveSuccess().fadeOut()
        break
    }
  }
})

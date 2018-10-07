import UI from './UI'

export default function logout() {
  chrome.storage.local.get('token', (items) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (items.token) {
      chrome.storage.local.remove('token')
      UI.message({'action': 'logout'})
    }
  }
}

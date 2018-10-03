import 'logout' from './logout'

document.onLoad( function () {
  document.getElementById('logout').addEventListener('click', () => {
    logout()
  })
})

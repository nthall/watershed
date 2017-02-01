import Cookies from 'js-cookie'

function setup() {
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'))
      }
    }
  })
}
    
function jslog(str, component='', func='', err=false) {
  $.post("/jslog/",
    {str, component, func, err}
  );
}

export { setup, jslog }

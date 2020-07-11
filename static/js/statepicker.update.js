$(document).on('change', '#statePicker', function () {
  var e = document.getElementById('statePicker')
  var statePicked = e.options[e.selectedIndex].text

  document.getElementById('currentState').innerHTML = statePicked
  document.getElementById('pollCurrentSate').innerHTML = statePicked

  fetch('http://localhost:3000/api/poll_data', { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data)
    })
})

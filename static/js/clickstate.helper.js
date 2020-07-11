//reset lat and lng cookie
$(document).ready(function () {
  document.cookie = 'lat=undefined;'
  document.cookie = 'lng=undefined;'
})

//Interval Function
function coordsIntervalFunction() {
  var lat = findCookieValue('lat')
  var lng = findCookieValue('lng')

  if (lat === 'undefined' || lng === 'undefined') {
    console.log('skipped')
  } else {
    fetch('http://localhost:3000/api/state_geometry', { mode: 'cors' })
      .then((resp) => resp.json())
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].state)
        }
        clearInterval(getCoordsTimer)
      })
  }
}

//get new cookie set
var getCoordsTimer = setInterval(coordsIntervalFunction, 2000)

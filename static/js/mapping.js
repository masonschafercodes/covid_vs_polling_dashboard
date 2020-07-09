console.log('mapping!')

//Get date to search
var date_to_search = ''
$(document).on('change', '#covidPicker', function () {
  date_to_search = document
    .getElementById('covidPicker')
    .value.replace(/-|\s/g, '')
})

//creating Map View
var map = L.map('mapid').setView([37.8, -96], 4)
var accessToken =
  'pk.eyJ1IjoibWFzb25zY2hhZmVyY29kZXMiLCJhIjoiY2ticjJrZG1yMGFwcDJzb2Vyb2E4aDk3dCJ9.wreRh-9L43Pa35mn-cV0_w'

var layer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
    accessToken,
  {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
  },
).addTo(map)

var geojson = L.geoJson(statesData, {
  style: style(),
  onEachFeature: onEachFeature,
}).addTo(map)

//Sorting Array by State function
function SortByName(x, y) {
  return x.state == y.state ? 0 : x.state > y.state ? 1 : -1
}

//Function to add commas to numbers
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

//Fetch call and logic to dynamically serve the incoming data to the page
$(document).on('change', '#covidPicker', function () {
  var data_url = 'http://127.0.0.1:5000/api/state_data'
  var geo_url = 'http://127.0.0.1:5000/api/state_geometry'
  fetch(data_url + `/${parseInt(date_to_search)}`, { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      var arr2 = data
      var arr3 = arr2
        .sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
        .sort(SortByName)

      fetch(geo_url, { mode: 'cors' })
        .then((resp) => resp.json())
        .then(function (geoData) {
          var geo_arr = geoData.sort(SortByName)

          for (var z = 0; z < geo_arr.length; z++) {
            L.marker([geo_arr[z].lat, geo_arr[z].long])
              .addTo(map)
              .bindPopup(
                `State: ${arr3[z].state} <br /> Deaths: ${
                  arr3[z].deaths == null ? '0' : arr3[z].deaths
                } <br /> Cases: ${arr3[z].confirmed_cases}`,
              )
              .openPopup()
          }
        })

      var national_cases_total = 0
      var national_deaths_total = 0

      for (var j = 0; j < arr3.length; j++) {
        currentDataNode = arr3[j]

        national_cases_total += currentDataNode.confirmed_cases
        national_deaths_total += currentDataNode.deaths
      }

      document.getElementById(
        'natCaseSpan',
      ).innerHTML = `Cases: ${numberWithCommas(national_cases_total)}`
      document.getElementById(
        'natDeathSpan',
      ).innerHTML = `Deaths: ${numberWithCommas(national_deaths_total)}`
    })
})

console.log('mapping!')

//creating Map View
var map = L.map('mapid').setView([37.8, -96], 4)
var accessToken =
  'pk.eyJ1IjoibWFzb25zY2hhZmVyY29kZXMiLCJhIjoiY2ticjJrZG1yMGFwcDJzb2Vyb2E4aDk3dCJ9.wreRh-9L43Pa35mn-cV0_w'

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
    accessToken,
  {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
  },
).addTo(map)

//using geojson to outline the map
geojson = L.geoJson(statesData, {
  style: style,
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

var data_url = 'http://127.0.0.1:5000/api/state_data'
fetch(data_url, { mode: 'cors' })
  .then((resp) => resp.json())
  .then(function (data) {
    var arr2 = data
    var arr3 = arr2
      .sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })
      .sort(SortByName)

    var national_cases_total = 0
    var national_deaths_total = 0

    for (var j = 0; j < arr3.length; j++) {
      currentDataNode = arr3[j]

      national_cases_total += currentDataNode.confirmed_cases
      national_deaths_total += currentDataNode.deaths
    }
    console.log(
      `National Deaths ${numberWithCommas(
        national_deaths_total,
      )} | National Cases ${numberWithCommas(national_cases_total)}`,
    )
  })

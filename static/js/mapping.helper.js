function highlightFeature(e) {
  var layer = e.target

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7,
  })

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront()
  }
}
function resetHighlight(e) {
  geojson.resetStyle(e.target)
}

function findCookieValue(value) {
  var cookieToFind = document.cookie
    .split('; ')
    .find((row) => row.startsWith(value))
    .split('=')[1]

  return cookieToFind
}

function zoomToFeature(e) {
  var coords_clicked = e.target.getBounds()
  document.cookie = `lat=${coords_clicked._northEast.lat};`
  document.cookie = `lng=${coords_clicked._northEast.lng};`
  var lat = findCookieValue('lat')
  var lng = findCookieValue('lng')
  console.log(`Lat: ${lat}, Lng: ${lng}`)
  map.fitBounds(e.target.getBounds())
}
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  })
}

function getColor(arr) {
  for (var i = 0; i < arr.length; i++) {
    return arr[i].confirmed_cases > 21000
      ? '#800026'
      : arr[i].confirmed_cases <= 20000
      ? '#BD0026'
      : arr[i].confirmed_cases < 15000
      ? '#E31A1C'
      : arr[i].confirmed_cases < 10000
      ? '#FC4E2A'
      : arr[i].confirmed_cases < 5000
      ? '#FD8D3C'
      : arr[i].confirmed_cases < 2000
      ? '#FEB24C'
      : arr[i].confirmed_cases < 1000
      ? '#FED976'
      : '#FFEDA0'
  }
}

function style(feature) {
  return {
    fillColor: 'white',
    weight: 2,
    opacity: 1,
    color: 'blue',
    dashArray: '3',
    fillOpacity: 0.5,
  }
}

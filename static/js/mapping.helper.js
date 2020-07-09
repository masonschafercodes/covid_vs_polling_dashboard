//Created to control what happens when a user highlights over and of the bounds within the geojson
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

//Explains its self, just resets the highlighed region once the user removes thier mouse from those specefic bounds
function resetHighlight(e) {
  geojson.resetStyle(e.target)
}

//Gets the last stored cookie value, used for storing the last lat and lng the user clicked on
function findCookieValue(value) {
  var cookieToFind = document.cookie
    .split('; ')
    .find((row) => row.startsWith(value))
    .split('=')[1]

  return cookieToFind
}

//Zoom to Feature function that controls what happens when a user clicks with the bounds of a state
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

//Styling that is given to our map
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

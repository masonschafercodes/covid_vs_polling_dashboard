function style(feature) {
  return {
    fillColor: 'white',
    weight: 2,
    opacity: 0.5,
    color: 'blue',
    fillOpacity: 0.3,
  }
}

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
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds())
}
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  })
}

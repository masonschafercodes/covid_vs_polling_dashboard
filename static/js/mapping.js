console.log("mapping!")

//creating Map View
var mymap = L.map('mapid').setView([39.8333333, -98.585522], 4);

//adding Map to DOM
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFzb25zY2hhZmVyY29kZXMiLCJhIjoiY2ticjJrZG1yMGFwcDJzb2Vyb2E4aDk3dCJ9.wreRh-9L43Pa35mn-cV0_w'
}).addTo(mymap);

//Sorting Array by State function
function SortByName(x,y) {
    return ((x.state == y.state) ? 0 : ((x.state > y.state) ? 1 : -1 ));
  }

//Function to add commas to numbers 
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Fetching Data to display
const url = 'http://127.0.0.1:5000/api/state_geometry'
fetch(url, {mode: 'cors'})
    .then((resp) => resp.json())
    .then(function(data){
        var lat = []
        var lng = []
        var arr = data.sort(SortByName);
        for(var i = 0; i < arr.length; i++){
            let currentNode = arr[i];
            lat.push(currentNode.lat)
            lng.push(currentNode.long)
        }
        var data_url = 'http://127.0.0.1:5000/api/state_data'
        fetch(data_url, {mode: 'cors'})
            .then((resp) => resp.json())
            .then(function(data){
                var arr2 = data.sort(SortByName);
                var confirmed_cases_total = 0;
                for(var j = 0; j < lat.length; j++){
                    currentDataNode = arr2[j];

                    var deaths = L.circle([lat[j], lng[j]], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: currentDataNode.deaths
                    }).addTo(mymap);
                    var confirmed_cases = L.circle([lat[j], lng[j]], {
                        color: 'yellow',
                        fillColor: '#F5F679',
                        fillOpacity: 0.5,
                        radius: currentDataNode.confirmed_cases
                    }).addTo(mymap);
                    var marker = L.marker([lat[j], lng[j]]).addTo(mymap);
                    marker.bindTooltip(`State: ${currentDataNode.state} <br /> Confirmed Cases: ${currentDataNode.confirmed_cases} <br /> Deaths: ${currentDataNode.deaths}`);
                    console.log(currentDataNode.confirmed_cases + '-' + currentDataNode.state)
                    confirmed_cases_total += currentDataNode.confirmed_cases;
                }
                var confirmed_cases_display = document.getElementById('confirmed_cases_display');
                confirmed_cases_display.innerHTML = numberWithCommas(confirmed_cases_total);
            })
    })
$(document).ready(function () {
  //Sorting Array by State function
  function SortByName(x, y) {
    return x.state == y.state ? 0 : x.state > y.state ? 1 : -1
  }

  //Function to add commas to numbers
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  var data_url = 'http://127.0.0.1:3000/api/state_data'
  var geo_url = 'http://127.0.0.1:3000/api/state_geometry'
  var poll_url = 'http://127.0.0.1:3000/api/poll_data'
  fetch(data_url + `/${parseInt('20200710')}`, { mode: 'cors' })
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
          console.log(geo_arr)
          console.log(arr3)

          for (var z = 0; z < geo_arr.length; z++) {
            if (arr3[z].state == 'WA') {
              console.log('Washington is not welcome')
            } else {
              L.marker([geo_arr[z].lat, geo_arr[z].long])
                .addTo(map)
                .bindPopup(
                  `State: ${arr3[z].state} <br /> Deaths: ${
                    arr3[z].deaths == null ? '0' : arr3[z].deaths
                  } <br /> Cases: ${arr3[z].confirmed_cases}`,
                )
                .openPopup()
            }
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
  let encoded_date = encodeURIComponent(`${7}/${8}/${2020}`)
  let poll_uri = poll_url + '/' + encoded_date
  fetch(poll_uri, { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      var poll_arr = data
        .sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
        .sort(SortByName)

      console.log(poll_arr)

      var national_poll_trump_total = []
      var national_poll_biden_total = []

      for (var j = 0; j < poll_arr.length; j++) {
        currentDataNode = poll_arr[j]

        if (currentDataNode.candidate === 'Joseph R. Biden Jr.') {
          national_poll_biden_total.push(currentDataNode.pct)
        } else {
          national_poll_trump_total.push(currentDataNode.pct)
        }
      }
      var biden_total = 0
      for (var i = 0; i < national_poll_biden_total.length; i++) {
        if (national_poll_biden_total.length < 1) {
          biden_total = 0
        } else {
          biden_total += parseInt(national_poll_biden_total[i])
        }
      }
      var biden_avg =
        biden_total == 0 ? 0 : biden_total / national_poll_biden_total.length
      document.getElementById(
        'natBidenResults',
      ).innerHTML = `Biden: ${Math.floor(biden_avg)}%`

      var trump_total = 0
      for (var i = 0; i < national_poll_trump_total.length; i++) {
        if (national_poll_trump_total.length < 1) {
          trump_total = 0
        } else {
          trump_total += parseInt(national_poll_trump_total[i])
        }
      }
      var trump_avg =
        trump_total == 0 ? 0 : trump_total / national_poll_trump_total.length

      document.getElementById(
        'natTrumpResults',
      ).innerHTML = `Trump: ${Math.floor(trump_avg)}%`
    })
})

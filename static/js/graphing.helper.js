function findStateAbbr(pickedState) {
  let stateToFind = ''
  if (pickedState == 'Kentucky') {
    stateToFind = 'KY'
  } else if (pickedState == 'Arizona') {
    stateToFind = 'AZ'
  } else if (pickedState == 'Alaska') {
    stateToFind = 'AK'
  } else if (pickedState == 'Connecticut') {
    stateToFind = 'CO'
  } else if (pickedState == 'District of Columbia') {
    stateToFind = 'DC'
  } else if (pickedState == 'Georgia') {
    stateToFind = 'GA'
  } else if (pickedState == 'Hawaii') {
    stateToFind = 'HI'
  } else if (pickedState == 'Iowa') {
    stateToFind = 'IA'
  } else if (pickedState == 'Kansas') {
    stateToFind = 'KS'
  } else if (pickedState == 'Louisiana') {
    stateToFind = 'LA'
  } else if (pickedState == 'Maine') {
    stateToFind = 'ME'
  } else if (pickedState == 'Maryland') {
    stateToFind = 'MD'
  } else if (pickedState == 'Minnesota') {
    stateToFind = 'MN'
  } else if (pickedState == 'Mississippi') {
    stateToFind = 'MS'
  } else if (pickedState == 'Missouri') {
    stateToFind = 'MO'
  } else if (pickedState == 'Montana') {
    stateToFind = 'MT'
  } else if (pickedState == 'Nevada') {
    stateToFind = 'NV'
  } else if (pickedState == 'New Hampshire') {
    stateToFind = 'NH'
  } else if (pickedState == 'New Jersey') {
    stateToFind = 'NJ'
  } else if (pickedState == 'New Mexico') {
    stateToFind = 'NM'
  } else if (pickedState == 'New York') {
    stateToFind = 'NY'
  } else if (pickedState == 'North Carolina') {
    stateToFind = 'NC'
  } else if (pickedState == 'North Dakota') {
    stateToFind = 'ND'
  } else if (pickedState == 'Pennsylvania') {
    stateToFind = 'PA'
  } else if (pickedState == 'Rhode Island') {
    stateToFind = 'RI'
  } else if (pickedState == 'South Carolina') {
    stateToFind = 'SC'
  } else if (pickedState == 'South Dakota') {
    stateToFind = 'SD'
  } else if (pickedState == 'Tennessee') {
    stateToFind = 'TN'
  } else if (pickedState == 'Texas') {
    stateToFind = 'TX'
  } else if (pickedState == 'Vermont') {
    stateToFind = 'VT'
  } else if (pickedState == 'Virginia') {
    stateToFind = 'VA'
  } else if (pickedState == 'West Virginia') {
    stateToFind = 'WV'
  } else {
    stateToFind = pickedState.toString().substring(0, 2).toUpperCase()
  }
  return stateToFind
}

function addHyphens(n) {
  n = n.toString()
  let year = n.substring(0, 4)
  let month = n.substring(4, 6)
  let day = n.substring(6, 8)
  let dateWithHyphens = year + '-' + month + '-' + day
  return dateWithHyphens
}

$(document).on('change', '#statePicker', function () {
  var e = document.getElementById('statePicker')
  var statePicked = e.options[e.selectedIndex].text

  fetch('http://localhost:3000/api/poll/' + statePicked, { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      var poll_arr = data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })

      let state_biden_pct = []
      let state_trump_pct = []

      for (var i = 0; i < poll_arr.length; i++) {
        if (poll_arr[i].candidate == 'Joseph R. Biden Jr.') {
          state_biden_pct.push(poll_arr[i].pct)
        } else {
          state_trump_pct.push(poll_arr[i].pct)
        }
      }
      let stateToFind = findStateAbbr(statePicked)
      fetch('http://localhost:3000/api/state/' + stateToFind, { mode: 'cors' })
        .then((resp) => resp.json())
        .then(function (data) {
          var state_arr = data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
          })

          let state_covid_data = []
          let dates = []

          for (var i = 0; i < state_arr.length; i++) {
            state_covid_data.push(state_arr[i].deaths)
            let date_base = state_arr[i].date.toString()
            let date_year = date_base.substring(0, 4)
            let date_month = date_base.substring(4, 6)
            let date_day = date_base.substring(6, 8)
            let new_date = new Date(date_year, date_month, date_day)
            console.log(new_date)
            dates.push(new_date)
          }

          var chart = c3.generate({
            bindto: '#chart',
            size: {
              height: 1020,
              width: 1220,
            },
            data: {
              x: 'x',
              xFormat: '%Y-%m-%d',
              json: {
                x: dates.reverse(),
                Trump: state_trump_pct.reverse(),
                Biden: state_biden_pct.reverse(),
                Covid_Cases: state_covid_data.reverse(),
              },
              axes: {
                x: 'x',
                Trump: 'y',
                Biden: 'y',
                Covid_Cases: 'y2', // ADD
              },
              types: {
                Trump: 'line',
                Biden: 'line',
                Covid_Cases: 'area-spline',
              },
              colors: {
                Trump: '#FF0000',
                Biden: '#0000ff',
                Covid: '#808080',
              },
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
                label: 'Date',
              },
              y2: {
                show: true,
                label: {
                  text: 'COVID CASES',
                  position: 'outer-middle',
                },
              },
              y: {
                label: {
                  text: 'Approval Rate (%)',
                  position: 'outer-middle',
                },
              },
            },
          })
        })
    })
})

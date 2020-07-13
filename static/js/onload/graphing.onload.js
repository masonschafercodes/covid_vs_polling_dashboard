function addHyphens(n) {
  n = n.toString()
  let year = n.substring(0, 4)
  let month = n.substring(4, 6)
  let day = n.substring(6, 8)
  let dateWithHyphens = year + '-' + month + '-' + day
  return dateWithHyphens
}
$(document).ready(function () {
  fetch('http://localhost:3000/api/poll/Indiana', { mode: 'cors' })
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
      fetch('http://localhost:3000/api/state/IN', { mode: 'cors' })
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

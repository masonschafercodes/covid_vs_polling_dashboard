function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

$(document).ready(function () {
  document.getElementById('currentState').innerHTML = 'Indiana'
  document.getElementById('pollCurrentSate').innerHTML = 'Indiana'

  fetch('http://localhost:3000/api/poll/Indiana', { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      var poll_arr = data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })
      console.log(poll_arr)

      let state_biden_pct = []
      let state_trump_pct = []

      for (var i = 0; i < poll_arr.length; i++) {
        if (poll_arr[i].candidate == 'Joseph R. Biden Jr.') {
          state_biden_pct.push(poll_arr[i].pct)
        } else {
          state_trump_pct.push(poll_arr[i].pct)
        }
      }

      var biden_total = 0
      for (var i = 0; i < state_biden_pct.length; i++) {
        if (state_biden_pct.length < 1) {
          biden_total = 0
        } else {
          biden_total += parseInt(state_biden_pct[i])
        }
      }
      var biden_avg =
        biden_total == 0 ? 0 : biden_total / state_biden_pct.length
      document.getElementById(
        'natBidenResults',
      ).innerHTML = `Biden: ${Math.floor(biden_avg)}%`

      var trump_total = 0
      for (var i = 0; i < state_trump_pct.length; i++) {
        if (state_trump_pct.length < 1) {
          trump_total = 0
        } else {
          trump_total += parseInt(state_trump_pct[i])
        }
      }
      var trump_avg =
        trump_total == 0 ? 0 : trump_total / state_trump_pct.length

      document.getElementById(
        'natTrumpResults',
      ).innerHTML = `Trump: ${Math.floor(trump_avg)}%`
    })

  fetch('http://localhost:3000/api/state/IN', { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      state_covid_arr = data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })

      var state_cases_total = 0
      var state_deaths_total = 0

      for (var j = 0; j < state_covid_arr.length; j++) {
        currentDataNode = state_covid_arr[j]

        state_cases_total += currentDataNode.confirmed_cases
        state_deaths_total += currentDataNode.deaths
      }

      document.getElementById(
        'natCaseSpan',
      ).innerHTML = `Cases: ${numberWithCommas(state_cases_total)}`
      document.getElementById(
        'natDeathSpan',
      ).innerHTML = `Deaths: ${numberWithCommas(state_deaths_total)}`
    })
})

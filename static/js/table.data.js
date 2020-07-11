var state_data_url = 'http://localhost:3000/api/state_data'

function numberWithCommas(x) {
  if (x == null || x == undefined) {
    return '0'
  } else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

fetch(state_data_url)
  .then((resp) => resp.json())
  .then(function (data) {
    d3.select('tbody')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .html(function (d) {
        return `<td>${numberWithCommas(
          d.confirmed_cases,
        )}</td><td>${d.state}</td>`
      })
  })

fetch(state_data_url)
  .then((resp) => resp.json())
  .then(function (data) {
    d3.select('#deaths_by_state_table')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .html(function (d) {
        return `<td>${numberWithCommas(d.deaths)}</td><td>${d.state}</td>`
      })
  })

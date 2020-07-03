var state_data_url = 'http://localhost:5000/api/state_data'

fetch(state_data_url)
    .then((resp) => resp.json())
    .then(function (data) {
        var labels = []
        var data_arr = []
        for (var i = 0; i < data.length; i++) {
            currentNode = data[i];
            labels.push(currentNode.state);
            data_arr.push(currentNode.confirmed_cases);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cases   ',
                    data: data_arr,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                      gridLines: {
                        display: false,
                        drawBorder: false
                      }
                    }]
                  }
            }
        });

    });
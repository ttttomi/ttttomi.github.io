// Load the Visualization API and the corechart package.
google.charts.load("current", { packages: ["annotationchart"], language: "es" });

// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);

//[new Date(subeData.data[0][0]), subeData.data[0][1]];

function drawChart(subeData) {
  var data = new google.visualization.DataTable();

  //Agrega la columna "Fecha"
  data.addColumn("datetime", "Fecha");

  //Agrega las columnas con la descripción del tipo de transacción
  for (let i = 1; i < subeData.data[0].length; i++) {
    data.addColumn("number", subeData.tipo[i - 1]);
  }

  //Agrega la información (filas)
  data.addRows(subeData.data);

  var chart = new google.visualization.AnnotationChart(document.getElementById("chart_div"));

  var options = {
    width: 1600,
    height: 700,
    hAxis: {
      format: "d/M/yy",
    },
    vAxis: {
      format: "d/M/yy",
    },
    displayZoomButtons: false,
    dateFormat: "EE dd 'de' MMMM, yyyy (z)",
    colors: ["#0545af", "#f6010a", "#01a141", "#ff8d0a"],
    legendPosition: "newRow",
    allowHTML: true,
  };

  chart.draw(data, options);

  document.getElementById("chart_div").className = "";
}

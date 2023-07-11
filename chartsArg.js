function dibujarChart() {
  TSComponents.Graphic.render("chart_div", {
    // Llamada a la API de Series de Tiempo
    graphicUrl: "https://apis.datos.gob.ar/series/api/series/?ids=s9v4z3od&format=json&metadata=none", //LLamado a la api de Strapi
    title: "Transacciones de sube",
    source: "Ministerio de Transporte de la Nación",
  });
}

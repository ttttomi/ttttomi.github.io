/*$(document).ready(() => {
    let tipos = getTipo();
    console.log(tipos);
});
*/

function cargando(flag) {
  let txt = document.getElementById("cargando");
  txt.style.visibility = "visible";

  switch (flag) {
    case "iniciar":
      txt.innerHTML = "Cargando";
      carg = setInterval(() => {
        if (txt.innerHTML != "Cargando...") {
          txt.innerHTML += ".";
        } else {
          txt.innerHTML = "Cargando";
        }
      }, 200);
      break;

    case "exito":
      clearInterval(carg);
      txt.innerHTML = "Consultado con éxito";
      txt.style.color = "var(--success-color)";
      setTimeout(() => {
        txt.style.visibility = "hidden";
        txt.style.color = "black";
      }, 2000);
      break;

    case "error":
      clearInterval(carg);
      txt.innerHTML = "Error en la consulta";
      txt.style.color = "var(--error-color)";
      setTimeout(() => {
        txt.style.visibility = "hidden";
        txt.style.color = "black";
      }, 2000);
      break;
  }
}

//Valida las fechas. Si hay algún error da aviso al usuario y retorna 0, si no hay errores retorna 1

function validarFecha(elemento) {
  let hoy = new Date().toISOString().slice(0, 10); //Obtengo la fecha de hoy

  if (Date.parse(elemento.value) > Date.parse(hoy)) {
    //Valida que la fecha para consultar no supere la fecha de hoy
    elemento.style.color = "var(--error-color)";
    document.getElementById("error-msg").style.display = "block";
    document.getElementById("error-msg").innerHTML = "*las fechas deben ser anteriores al día de hoy";
    return 0;
  } else {
    //Valida que la fecha *desde* la cual se quiere consultar sea menor a la fecha *hasta* la cual se quiere consultar
    if (Date.parse(document.getElementById("fecha-hasta").value) < Date.parse(document.getElementById("fecha-desde").value)) {
      elemento.style.color = "var(--error-color)";
      document.getElementById("error-msg").style.display = "block";
      document.getElementById("error-msg").innerHTML = '*la fecha "desde" debe ser anterior a "hasta"';
      return 0;
    } else {
      //Si la fecha es válida muestra por defecto
      document.getElementById("fecha-desde").style.color = "var(--main-color)";
      document.getElementById("fecha-hasta").style.color = "var(--main-color)";
      document.getElementById("error-msg").innerHTML = "";
      return 1;
    }
  }
}

//Da una ayuda visual al usuario para solucionar un error

function resaltarError(elemento) {
  let parpadeo = setInterval(() => {
    elemento.style.visibility = elemento.style.visibility === "hidden" ? "visible" : "hidden";
  }, 100);
  setTimeout(() => {
    clearInterval(parpadeo);
    elemento.style.visibility = "visible";
  }, 1300);
}

//Manejador del evento "click" del botón *consultar*

function consultarBtn() {
  let fechaIni = document.getElementById("fecha-desde");
  let fechaFin = document.getElementById("fecha-hasta");

  //Si hay error resalta el mensaje de error, si no, ejecuta la APIRequest
  if (validarFecha(fechaIni) && validarFecha(fechaFin)) {
    requestAPI();
  } else {
    resaltarError(document.getElementById("error-msg"));
  }
}

//Manejador del evento "click" del botón *mostrar*

function mostrarBtn(elemento) {
  //Si el botón está desactivado, resalta el botón "consultar"
  if (elemento.classList.contains("disabled")) {
    resaltarError(document.getElementById("btn-consultar"));
  } else {
    //Si el boton "mostrar" está activado, actualizo los botones
    document.getElementById("btn-consultar").style.display = "none";
    document.getElementById("btn-nueva").style.display = "block";
    //Muestro el chart y oculto los fields
    document.getElementById("contenedor-charts").style.display = "grid";
    document.getElementById("contenedor-fechas").style.display = "none";
    document.getElementById("contenedor-tipo-transporte").style.display = "none";
  }
}

//Manejador del evento "click" del botón *generar nueva consulta*

function nuevaConsultaBtn() {
  //Muestro las cosas del main
  document.getElementById("btn-nueva").style.display = "block";
  document.getElementById("contenedor-fechas").style.display = "grid";
  document.getElementById("contenedor-tipo-transporte").style.display = "grid";
  //Oculto el chart
  document.getElementById("contenedor-charts").style.display = "none";

  //Actualizo los botones
  document.getElementById("btn-nueva").style.display = "none";
  document.getElementById("btn-consultar").style.display = "block";
  document.getElementById("btn-mostrar").classList.toggle("disabled");
}

//Esto hay que pasarlo a apiRequests.js
//Por ahora es solo para testear los charts
function requestAPI() {
  cargando("iniciar"); //Inicia la animación de carga

  let transpSelec = transportesSeleccionados();
  let ids = new Array();

  //Si no hay transportes seleccionados, utilizo por defecto el id de "todo"
  if (transpSelec.length == 0) {
    ids.push("npogi2im");
  } else {
    //Si hay transp. seleccionados guardo en un Array sus "id", que los necesita la API para la consulta
    transpSelec.forEach((e) => {
      switch (e.id) {
        case "check-todo":
          ids.push("npogi2im");
          break;

        case "check-tren":
          ids.push("678arlyc");
          break;

        case "check-subte":
          ids.push("s9v4z3od");
          break;

        case "check-bondi":
          ids.push("twsi8s3j");
          break;

        default:
          ids.push("npogi2im");
          break;
      }
    });
  }

  //Construyo la url
  let url = "https://apis.datos.gob.ar/series/api/series?&format=json&limit=5000";
  let fechaIni = document.getElementById("fecha-desde").value;
  let fechaFin = document.getElementById("fecha-hasta").value;

  url += "&ids=" + ids.toString();
  url += "&start_date=" + fechaIni;
  url += "&end_date=" + fechaFin;

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: (response) => {
      //Muestro mensaje de éxito
      cargando("exito");
      //Habilito el botón "mostrar"
      document.getElementById("btn-mostrar").classList.toggle("disabled", 0);

      let subeData = generarSubeData(response);

      /*ACÁ IRÍA EL POST DE SUBEDATA AL STRAPI*/

      //Genero el chart
      drawChart(subeData);
      console.log(subeData);
    },
    error: (error) => {
      cargando("error");
      console.log(error);
    },
  });
}

//Retrona un array con los checkboxes seleccionados
function transportesSeleccionados() {
  //checkColl:HTMLCollection -> obtengo todos los Checkboxes de los tipos transportes
  let checkColl = document.getElementsByClassName("check");

  let seleccionados = new Array();
  for (let i = 0; i < checkColl.length; i++) {
    if (checkColl.item(i).checked) {
      seleccionados.push(checkColl.item(i));
    }
  }
  return seleccionados;
}

function generarSubeData(response) {
  //Creo un arreglo ordenado con la descripción de los Datasets seleccionados (ej: 'Cantidad de tarjetas que registraron transacciones SUBE en subte.')
  let nombreTipo = new Array();
  for (let i = 1; i < response.meta.length; i++) {
    nombreTipo.push(response.meta[i].field.description);
  }

  //Convierto la fecha al formato UTC
  response.data.forEach((e) => {
    var fecha = new Date(e[0]);
    fecha.setTime(fecha.getTime() + fecha.getTimezoneOffset() * 60 * 1000);
    e[0] = new Date(fecha);
  });

  var fecha = new Date(response.data[0][0]);
  fecha.setTime(fecha.getTime() + fecha.getTimezoneOffset() * 60 * 1000);
  var fechaAjustada = new Date(fecha);
  console.log(fechaAjustada);

  console.log(response.data[0][0]);

  //subeData es cada consulta que voy a guardar en el Strapi
  let subeData = {
    data: response.data,
    tipo: nombreTipo,
    fechaInicio: response.meta[0].start_date,
    fechaFin: response.meta[0].end_date,
  };

  return subeData;
}

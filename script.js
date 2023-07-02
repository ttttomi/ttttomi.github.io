function cargando(flag) {
    let txt = document.getElementById("cargando")
    txt.style.visibility = "visible"

    if (flag == "end") {
        clearInterval(carg)
        txt.innerHTML = "Consultado con éxito"
        txt.style.color = "var(--success-color)"
        setTimeout(() => {
            txt.style.visibility = "hidden"
            txt.style.color = "black"
        }, 2000)
    } else {
        txt.innerHTML = "Cargando"
        carg = setInterval(() => {
            if (txt.innerHTML != "Cargando...") {
                txt.innerHTML += "."
            } else {
                txt.innerHTML = "Cargando"
            }
        }, 200)    
    }
}

function requestAPI(){
    cargando() //Muestro la animación que está cargando

    //en la HTMLCollection "checkColl" obtengo todos los Checkboxes de los tipos transportes
    let checkColl = document.getElementsByClassName("check")
    
    //En el Array "seleccionados" guardo solo los Checkboxes de los transportes seleccionados 
    let seleccionados = new Array
    for (let i = 0; i < checkColl.length; i++) {
        if (checkColl.item(i).checked) {
            seleccionados.push(checkColl.item(i))
        }
    }

    //Si no hay transportes seleccionados, utilizo por defecto el "id" de "todo"
    let ids = new Array;
    if (seleccionados.length == 0) {
        ids.push("npogi2im")
    } else {
        //Si hay transp. seleccionados guardo en un Array sus "id", que los necesita la API para la consulta
        seleccionados.forEach(e => {
            switch (e.id) {
                case "check-todo":
                    ids.push("npogi2im")
                    break;
                    
                case "check-tren":
                    ids.push("678arlyc")
                    break;
                    
                case "check-subte":
                    ids.push("s9v4z3od")
                    break;
                    
                case "check-bondi":
                    ids.push("twsi8s3j")
                    break;

                default:
                    ids.push("npogi2im")
                    break;
            }
        });
    }

    //Construyo la url
    let url = "https://apis.datos.gob.ar/series/api/series?&format=json&metadata=none"
    let fechaIni = document.getElementById("fecha-desde").value
    let fechaFin = document.getElementById("fecha-hasta").value

    url += "&ids=" + ids.toString()
    url += "&start_date=" + fechaIni
    url += "&end_date=" + fechaFin

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: (response) => {
            cargando("end")
            document.getElementById("btn-mostrar").classList.toggle("disabled",0)
            console.log(response);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function validarFecha(elemento){
    let today = new Date().toISOString().slice(0,10) //Fecha de hoy
    
    //Valida que la fecha para consultar no supere la fecha de hoy
    if (Date.parse(elemento.value) > Date.parse(today)) {
        //Si la fecha es inválida muestra error
        elemento.style.color = "var(--error-color)"
        document.getElementById("error").style.display = "block"
        document.getElementById("error").innerHTML = "*las fechas deben ser anteriores al día de hoy"
        return 1
    } else {
        if (Date.parse(document.getElementById("fecha-hasta").value) < Date.parse(document.getElementById("fecha-desde").value)) {
            elemento.style.color = "var(--error-color)"
            document.getElementById("error").style.display = "block"
            document.getElementById("error").innerHTML = "*la fecha \"desde\" debe ser anterior a \"hasta\""
            return 1
        } else {
            //Si la fecha es válida muestra por defecto 
            document.getElementById("fecha-desde").style.color = "var(--main-color)"
            document.getElementById("fecha-hasta").style.color = "var(--main-color)"
            document.getElementById("error").innerHTML = ""
            return 0
        }
    }
}

function resaltarError(elemento) { 
    let parpadeo = setInterval(() => {
        elemento.style.visibility = elemento.style.visibility === "hidden" ? "visible" : "hidden"
    }, 100)
    setTimeout(() => {
        clearInterval(parpadeo)
        elemento.style.visibility = "visible"
    }, 1300);
}

function displayHijos(display, tagName){
    for (let i = 0; i < document.getElementsByTagName(tagName)[0].childElementCount; i++){
        document.getElementsByTagName(tagName)[0].children.item(i).style.display = display
    }
}

function consultarBtn(elemento){
    let fechaIni = document.getElementById("fecha-desde")
    let fechaFin = document.getElementById("fecha-hasta")
    
    //Si hay error resalta el mensaje de error, si no, ejecuta la APIRequest
    if (validarFecha(fechaIni) || validarFecha(fechaFin)){
        resaltarError(document.getElementById("error"))
    } else {
        requestAPI()
    }
}

function mostrarBtn(elemento){;
    //Si el botón "mostrar" está desactivado, resalta el botón "consultar"
    if (elemento.classList.contains("disabled")){
        resaltarError(document.getElementById("btn-consultar"))
    }else {
        //Oculto las cosas del main
        displayHijos("none", "main")
        //Actualizo los botones
        document.getElementById("btn-consultar").style.display = "none"
        document.getElementById("btn-nueva").style.display = "block"
    }
}

function nuevaConsultaBtn() {
    //Muestro las cosas del main
    displayHijos("grid","main")
    //Actualizo los botones
    document.getElementById("btn-nueva").style.display = "none"
    document.getElementById("btn-consultar").style.display = "block"
    document.getElementById("btn-mostrar").classList.toggle("disabled")
}

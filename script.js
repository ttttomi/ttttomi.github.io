function cargando(flag) {
    let txt = document.getElementById("cargando")
    txt.style.visibility = "visible"

    if (flag == "end") {
        clearInterval(carg)
        txt.innerHTML = "Consultado con éxito"
        setTimeout(() => {
            txt.style.visibility = "hidden"
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
    cargando()
    //en la HTMLCollection "checkColl" obtengo todos los Checkboxes de los tipos transportes
    let checkColl = document.getElementsByClassName("check")
    
    //En el Array "seleccionados" guardo solo los Checkboxes de los transportes que esten seleccionados 
    let seleccionados = new Array
    for (let i = 0; i < checkColl.length; i++) {
        if (checkColl.item(i).checked) {
            seleccionados.push(checkColl.item(i))
        }
    }

    //Guardo en un Array los "id" de los tipos de transportes seleccionados, que necesita la API para la consulta
    let ids = new Array;
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
        }
    });

    //Si no hay transportes seleccionados, utilizo por defecto el "id" de "todo"
    if (seleccionados.length == 0) {
        ids.push("npogi2im")
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
            document.getElementById("btn-mostrar").disabled = false
            console.log(response);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function fechaValidacion(elemento){
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

function consultar(){
    let fechaIni = document.getElementById("fecha-desde")
    let fechaFin = document.getElementById("fecha-hasta")

    //Si hay error resalta el mensaje de error, si no, ejecuta la APIRequest
    if (fechaValidacion(fechaIni) || fechaValidacion(fechaFin)){
        resaltarError()
    } else {
        requestAPI()
    }
    
}

function resaltarError() { 
    let err = document.getElementById("error")
    let parpadeo = setInterval(() => {
        err.style.visibility = err.style.visibility === "hidden" ? "visible" : "hidden"
    }, 80)
    setTimeout(() => {
        clearInterval(parpadeo)
        err.style.visibility = "visible"
    }, 800);
}


function mostrar(){
    document.getElementsByTagName("main")[0].children.item(0).style.display = "none"
    document.getElementsByTagName("main")[0].children.item(1).style.display = "none"
    document.getElementById("btn-consultar").style.display = "none"
    document.getElementById("btn-nueva").style.display = "block"
}

function nuevaConsulta() {
    document.getElementById("btn-nueva").style.display = "none"
    document.getElementById("btn-consultar").style.display = "block"
    document.getElementById("btn-mostrar").disabled = true
    document.getElementsByTagName("main")[0].children.item(0).style.display = "grid"
    document.getElementsByTagName("main")[0].children.item(1).style.display = "grid"
}

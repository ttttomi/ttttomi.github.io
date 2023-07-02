function requestAPI(){
    //en la HTMLCollection "checkColl" obtengo todos los Checkboxes de los tipos transportes
    let checkColl = document.getElementsByClassName("check")
    
    //En el Array "seleccionados" guardo solo los transportes que esten seleccionados 
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

    let url = "https://apis.datos.gob.ar/series/api/series?&format=json&metadata=none"
    let fechaIni = document.getElementById("fecha-desde").value
    let fechaFin = document.getElementById("fecha-hasta").value

    //Construyo la url
    url += "&ids=" + ids.toString()
    url += "&start_date=" + fechaIni
    url += "&end_date=" + fechaFin

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: (response) => {
            console.log(response);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

//Valida que la fecha para consultar no supere la fecha de hoy
function fechaValidacion(elemento){
    let today = new Date().toISOString().slice(0,10)

    if (Date.parse(elemento.value) > Date.parse(today)) {
        //Si la fecha es inválida aplica un estilo de error
        elemento.style.color = "var(--error-color)"
        document.getElementById("error").style.display = "block"
    } else {
        //Si la fecha es válida aplica el estilo por defecto 
        elemento.style.color = "var(--main-color)"
        document.getElementById("error").style.display = "none"
    }
}

function consultar(){
    document.getElementById("btn-mostrar").disabled = false
    requestAPI();
}

function mostrar(){
    document.getElementById("btn-consultar").style.display = "none"
    document.getElementById("btn-nueva").style.display = "block"
    document.getElementsByTagName("main")[0].children.item(0).style.display = "none"
    document.getElementsByTagName("main")[0].children.item(1).style.display = "none"
}

function nuevaConsulta() {
    document.getElementById("btn-nueva").style.display = "none"
    document.getElementById("btn-consultar").style.display = "block"
    document.getElementById("btn-mostrar").disabled = true
    document.getElementsByTagName("main")[0].children.item(0).style.display = "grid"
    document.getElementsByTagName("main")[0].children.item(1).style.display = "grid"
}

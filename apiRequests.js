/*
function getTipo (url) {
    $.ajax({
        type: "GET",
        url: "https://gestionweb.frlp.utn.edu.ar/api/g16-tipos",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg4NzAzNjMxLCJleHAiOjE2OTEyOTU2MzF9.rG6JmBerppavmGmN1sIgu8hp2rjSvBwB2M2567OVCGs"
        },
        success: function (response) {
            console.log("getTipo(): " + response);
        },
        error: (error) => {
            console.log("Error en la request getTipo: " + error);
        }
    });
}

function getFecha(url, tipo) {
    if (tipo == "desde" || tipo == "hasta"){
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (response) {
                console.log("getFecha(): " + response);
            },
            error: (error) => {
                console.log("Error en la request getFecha: " + error);
            }
        });
    } else { 
        console.log('El tipo de fecha debe ser "desde" o "hasta"') 
    }
}

function postFecha(url, data){
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: function (response) {
            console.log("postFecha() exitoso: " + response);
        },
        error: (error) => {
            console.log("Error en postFecha(): " + error);
        }
    });
}

function postTipo(url, tipo) {
    $.ajax({
        method: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: (response) => {
            console.log("postTipo() exitoso: " + response);
        },
        error: (e) => {
            console.log("Error en postTipo(): " + e);
        }
    });
}
*/

/*API SUBE*/

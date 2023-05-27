
//Al cargar la venana 
window.onload = (e) => {
    const frases = ["console.log('hola mundo')", "que feo es programar en C", "git commit -m 'primer commit'"]
    const clase = ["frase1", "frase2", "frase3"] //Nombre de las clases con los estilos para cada frase 

    const index = Math.round(Math.random()*10) % 3; //Retorna un entero aleatorio entre 0 y 2 para usarlo como índice

    document.getElementById("frase").innerHTML = frases[index] //Aplica la frase aleatoria
    document.getElementById("frase").className = clase[index]  //Aplica la clase que le dará el estilo
}


//Api de la NASA que devuelve la fotografía astronómica del día
function apiNASA(){
    fetch("https://api.nasa.gov/planetary/apod?api_key=LFvpOZF2x3aVqgtkcnyT7aEagWjBMIrM1AmoEapu", {method: "GET"})
    .then(resp => resp.json())
    .then((r) => { 
        document.getElementById("main").innerHTML = ""  //Quito los elementos que hay en el main
        document.getElementById("main").appendChild(document.createElement("h1")).innerHTML = `${r.title}` //Titulo de la fotografía
        document.getElementById("main").appendChild(document.createElement("img")).src = `${r.url}` //Al main le agrego una etiqueta img con la url que recupero del JSON
        document.getElementById("main").appendChild(document.createElement("p")).innerHTML = `${r.explanation}` //Descripción de la fotografía
        document.getElementById("home").style.visibility= "visible"
        //Cambio el estilo de los botones para que aparezca presionado
        document.getElementById("api2").className = "clicked";
        document.getElementById("api1").className = "";
    })
}


//Api de OpenWeather que retorna características del clima 
function apiClima(){
    
    //Le envío como parámetros la latitud y longitud de La Plata, el idioma y el formato de las unidades (métrico)
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=-34.92&lon=-57.95&appid=a13df24921a2b9f0449648b341a424ce&lang=es&units=metric", {method: "GET"})
    .then(resp => resp.json())
    .then ((r) => {
        document.getElementById("main").innerHTML = `<p>El clima en <b style="color:blue"> ${r.name} </b> es ${r.weather[0].description} y la temperatura es de ${r.main.temp} ºC.</p>`
        document.getElementById("main").appendChild(document.createElement("img")).src = `https://openweathermap.org/img/wn/${r.weather[0].icon}@2x.png`
        document.getElementById("home").style.visibility = "visible"

        //Cambio el estilo de los botones para que aparezca presionado
        document.getElementById("api1").className = "clicked";
        document.getElementById("api2").className = "";
    });
}


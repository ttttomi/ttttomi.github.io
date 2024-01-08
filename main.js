import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const objLoader = new OBJLoader();
const MODEL_PATH = "./assets/tomi.obj";
const ENVIRONMENT_PATH = "./assets/env.hdr";

// Carga un objeto .obj
objLoader.load(
  MODEL_PATH, //URL del recurso 3D
  whenLoaded, //Callback cuando se termina de cargar el recurso
  whenLoading, //Se ejecuta mientras carga el recurso
  ifError //Se ejecuta en caso de error al cargar el recurso
);

function whenLoaded(modelo) {
  console.log(modelo);

  let scene, camera, renderer;
  let mouse = { x: 0, y: 0 };
  let material = {
    metalness: 1,
    roughness: 0,
    color: 0xffec00,
    wireframe: false,
  };

  //Escalo el modelo
  const SCALE = 1 / 3;
  modelo.scale.multiplyScalar(SCALE);

  //Material
  modelo.children.forEach((child) => {
    //El forEach es para que se aplique a cada hijo (subgrupo) del modelo
    child.material = new THREE.MeshStandardMaterial(material);
  });

  init();
  animate();

  function init() {
    //Escena *******************************************
    scene = new THREE.Scene();

    //Ejes *********************************************
    scene.add(new THREE.AxesHelper(500));

    //Cámara *******************************************
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let viewAngle = 40;
    let nearDistance = 0.1;
    let farDistance = 1000;

    camera = new THREE.PerspectiveCamera(
      viewAngle,
      screenWidth / screenHeight,
      nearDistance,
      farDistance
    );

    scene.add(camera);
    camera.position.set(100, 0, 0);
    camera.lookAt(scene.position);

    //Luces *******************************************
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 1000);
    pointLight.position.set(100, 0, 20);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Motor de renderizado ***************************
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(screenWidth, screenHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    // Texturas ***************************************
    let envMapLoader = new THREE.PMREMGenerator(renderer);

    new RGBELoader().load(ENVIRONMENT_PATH, (texture) => {
      modelo.children.forEach((child) => {
        child.material.envMap = envMapLoader.fromCubemap(texture).texture;
      });
    });

    //Agrego el modelo a la escena
    scene.add(modelo);
    // Trackeo del movimiento del mouse
    document.addEventListener("mousemove", onMouseMove, false);
  }

  function onMouseMove(event) {
    //Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Rotación de la objeto
    modelo.rotation.set(mouse.y, mouse.x * 2, mouse.x * mouse.y);

    //Permite que el modelo siga el cursor
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.x / dir.x; //('x' es eje normal a la pantalla)
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    modelo.position.copy(pos);
  }

  // Animate the elements
  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  // Rendering function
  function render() {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.render(scene, camera);
  }
}

function whenLoading(xhr) {
  console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
}
function ifError(err) {
  console.log("An error happened", err);
}

function alternarModelo() {}

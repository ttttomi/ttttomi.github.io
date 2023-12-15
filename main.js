import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const loader = new OBJLoader();

// load a resource
loader.load(
  // resource URL
  "assets/moneda.obj",
  // called when resource is loaded
  (moneda) => {
    // Define the standard global variables
    var container, scene, camera, renderer;

    console.log(moneda);

    //Cambio la escala de la moneda
    const SCALE = 1 / 3;
    moneda.scale.multiplyScalar(SCALE);

    //Material metálico
    moneda.children[0].material = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      color: 0xfffff0,
    });

    // Custom global variables
    var mouse = { x: 0, y: 0 };

    init();
    animate();

    function init() {
      //Escena
      scene = new THREE.Scene();
      //Ejes
      scene.add(new THREE.AxesHelper(500));

      //Camara
      var screenWidth = window.innerWidth;
      var screenHeight = window.innerHeight;
      var viewAngle = 40;
      var nearDistance = 0.1;
      var farDistance = 1000;

      camera = new THREE.PerspectiveCamera(
        viewAngle,
        screenWidth / screenHeight,
        nearDistance,
        farDistance
      );

      scene.add(camera);
      camera.position.set(100, 0, 0);
      camera.lookAt(scene.position);

      //Luces
      var lightAmb = new THREE.AmbientLight(0xffffff, 1);
      scene.add(lightAmb);

      var point = new THREE.PointLight(0xffffff, 5000);
      point.position.set(100, 0, 20);
      point.castShadow = true;
      scene.add(point);

      // Renderer engine together with the background
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(screenWidth, screenHeight);
      document.getElementById("container").appendChild(renderer.domElement);

      let envMapLoader = new THREE.PMREMGenerator(renderer);

      new RGBELoader().load("./assets/env.hdr", (texture) => {
        moneda.children[0].material.envMap =
          envMapLoader.fromCubemap(texture).texture;
      });

      scene.add(moneda);

      // When the mouse moves, call the given function
      document.addEventListener("mousemove", onMouseMove, false);
    }

    function onMouseMove(event) {
      // Update the mouse variable
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      //Rotación de la moneda
      moneda.rotation.set(mouse.y, mouse.x * 2, mouse.x * mouse.y);

      // Make the sphere follow the mouse
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
      vector.unproject(camera);
      var dir = vector.sub(camera.position).normalize();
      var distance = -camera.position.x / dir.x; //Cambiar al eje que sale de la pantalla
      var pos = camera.position.clone().add(dir.multiplyScalar(distance));
      moneda.position.copy(pos);
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
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  // called when loading has errors
  function (error) {
    console.log("An error happened", error);
  }
);

function mouseSpeed(event) {
  const SENSITIVITY = 1 / 2;
  console.log(
    Math.abs(event.movementX * SENSITIVITY) + 1,
    Math.abs(event.movementY * SENSITIVITY) + 1
  );
  return {
    x: Math.abs(event.movementX * SENSITIVITY) + 1,
    y: Math.abs(event.movementY * SENSITIVITY) + 1,
  };
}

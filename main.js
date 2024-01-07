import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const loader = new OBJLoader();
const OBJECT = "./assets/moneda.obj";
const ENVIRONMENT = "./assets/env.hdr";

// load a resource
loader.load(
  // URL del asset
  OBJECT,
  // Callback cuando se carga
  (moneda) => {
    console.log(moneda);

    // Define the standard global variables
    let scene, camera, renderer;
    let mouse = { x: 0, y: 0 };

    //Escala de la moneda
    const SCALE = 1 / 3;
    moneda.scale.multiplyScalar(SCALE);

    //Material metálico
    moneda.children[0].material = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.1,
      color: 0xffec00,
    });

    init();
    animate();

    function init() {
      //Escena
      scene = new THREE.Scene();
      //Ejes
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
      /*************************************************/

      //Luces *******************************************
      var lightAmb = new THREE.AmbientLight(0xffffff, 1);
      scene.add(lightAmb);

      var point = new THREE.PointLight(0xffffff, 5000);
      point.position.set(100, 0, 20);
      point.castShadow = true;
      scene.add(point);
      /*************************************************/

      // Motor de renderizado
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(screenWidth, screenHeight);
      document.getElementById("container").appendChild(renderer.domElement);

      // Texturas
      let envMapLoader = new THREE.PMREMGenerator(renderer);

      new RGBELoader().load(ENVIRONMENT, (texture) => {
        moneda.children[0].material.envMap =
          envMapLoader.fromCubemap(texture).texture;
      });
      /*************************************************/

      scene.add(moneda);

      // Trackeo movimiento de mouse
      document.addEventListener("mousemove", onMouseMove, false);
    }

    function onMouseMove(event) {
      // Update the mouse variable
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      //Rotación de la moneda
      moneda.rotation.set(mouse.y, mouse.x * 2, mouse.x * mouse.y);

      // Moneda sigue mouse
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
      vector.unproject(camera);
      var dir = vector.sub(camera.position).normalize();
      var distance = -camera.position.x / dir.x; //(eje normal a la pantalla)
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

  //Loading
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  //Función que se ejecuta en caso de error
  function (error) {
    console.log("An error happened", error);
  }
);

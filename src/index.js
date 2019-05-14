import { mat4 } from "gl-matrix";
import * as THREE from "three";

import { initGraphics, Colors } from "./utils";
import { Bird, Cactus } from "./objects";
import OrbitControls from "three-orbitcontrols";

import renderHTML from "./html";
import "./stylesheets/fonts.css";
import "./stylesheets/index.css";

const CONSTANTS = {
  PLANE_WIDTH: 50,
  PLANE_LENGTH: 1000,
  PADDING: 20
};

const GAME = {
  renderer: null,
  scene: null,
  axesHelper: null,
  camera: null,
  player: null,
  controls: null,
  floor: null,
  containerWidth: 0,
  containerHeight: 0,
  obstacles: [],
  light: {
    directional: null,
    hemishphere: null
  }
};

function Hero() {
  var hero = {},
    heroGeometry = {},
    heroMaterial = {};

  heroGeometry = new THREE.CylinderGeometry(0, 2, 5, 10);
  heroMaterial = new THREE.MeshLambertMaterial({
    color: 0xe91e63,
    shading: THREE.FlatShading
  });
  hero = new THREE.Mesh(heroGeometry, heroMaterial);
  hero.castShadow = true;
  hero.position.set(0, 5, CONSTANTS.PLANE_LENGTH / 2);
  hero.rotation.x = 0.785;

  window.addEventListener("keydown", function() {
    if (
      event.keyCode === 37 &&
      hero.position.x !== -(CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2
    ) {
      hero.position.x -= (CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2;
    } else if (
      event.keyCode === 39 &&
      hero.position.x !== (CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2
    ) {
      hero.position.x += (CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2;
    }
  });

  return hero;
}

function main(mount) {
  const container = document.getElementById("root");
  GAME.containerWidth = window.innerWidth;
  GAME.containerHeight = window.innerHeight;
  GAME.renderer = initGraphics().renderer;
  GAME.renderer.setSize(GAME.containerWidth, GAME.containerHeight);
  GAME.renderer.setClearColor(0xfffafa, 1);
  GAME.renderer.shadowMap.enabled = true;
  mount.appendChild(GAME.renderer.domElement);

  GAME.scene = new THREE.Scene();

  GAME.axesHelper = new THREE.AxesHelper(CONSTANTS.PLANE_LENGTH / 2);
  // CAMERA
  GAME.camera = new THREE.PerspectiveCamera(
    45,
    GAME.containerWidth / GAME.containerHeight,
    1,
    3000
  );
  GAME.camera.position.set(
    0,
    CONSTANTS.PLANE_LENGTH / 125,
    CONSTANTS.PLANE_LENGTH / 2 + CONSTANTS.PLANE_LENGTH / 25
  );

  GAME.controls = new OrbitControls(GAME.camera, GAME.renderer.domElement);
  GAME.controls.enableKeys = false;
  GAME.controls.enablePan = false;
  GAME.controls.enableZoom = false;
  GAME.controls.minPolarAngle = 1.55;
  GAME.controls.maxPolarAngle = 1.55;
  GAME.controls.minAzimuthAngle = 0;
  GAME.controls.maxAzimuthAngle = 0;

  // LIGHTING
  GAME.light.directional = new THREE.DirectionalLight(0xffffff, 1);
  GAME.light.directional.position.set(0, 1, 0);
  GAME.light.hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  GAME.light.hemisphere.position.y = 500;

  // FLOOR
  const floorGeometry = new THREE.BoxGeometry(
    CONSTANTS.PLANE_WIDTH,
    CONSTANTS.PLANE_LENGTH + CONSTANTS.PLANE_LENGTH / 10,
    1
  );
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0x7b1113
  });
  GAME.floor = new THREE.Mesh(floorGeometry, floorMaterial);
  GAME.floor.rotation.x = 1.57;
  GAME.floor.receiveShadow = true;
  createCactus();
  GAME.player = new Hero();
  GAME.scene.add(
    GAME.camera,
    GAME.light.directional,
    GAME.light.hemisphere,
    GAME.floor,
    GAME.player
  );
  function animate() {
    requestAnimationFrame(animate);
    GAME.obstacles.forEach(obstacle => {
      if (
        obstacle.object.position.z <
        CONSTANTS.PLANE_LENGTH / 2 + CONSTANTS.PLANE_LENGTH / 10
      ) {
        obstacle.object.position.z += 10;
      }
    });
    GAME.controls.update();
    GAME.renderer.render(GAME.scene, GAME.camera);
  }
  animate();
}

function createCactus() {
  const cactus = new Cactus();

  const xPositionValues = [
    -(CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2,
    0,
    (CONSTANTS.PLANE_WIDTH - CONSTANTS.PADDING) / 2
  ];
  const zPositionValues = [-(CONSTANTS.PLANE_LENGTH - CONSTANTS.PADDING) / 2];
  console.log(xPositionValues);
  const xPosition =
    xPositionValues[getRandomInteger(0, xPositionValues.length - 1)];
  const yPosition = 3;
  const zPosition =
    zPositionValues[getRandomInteger(0, zPositionValues.length - 1)];
  cactus.render(GAME.scene, xPosition, yPosition, zPosition);
  GAME.obstacles.push(cactus);
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
renderHTML(main);

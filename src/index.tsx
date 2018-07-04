import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const texture = new THREE.TextureLoader().load("textures/1.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);

const geometry = new THREE.CubeGeometry(4, 4, 4, 50, 50, 50);
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: texture, side: THREE.DoubleSide });
const cube = new THREE.Mesh(geometry, material);

const light = new THREE.PointLight(0xffffff, 13, 4, 2);
light.position.set(0, 0, 4);
scene.add(light);

scene.add(cube);
cube.position.setZ(4)
cube.rotateX(30)
camera.position.z = 5;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

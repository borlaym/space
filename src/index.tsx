import { uniq } from 'lodash';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.onclick = () => {
	renderer.domElement.requestPointerLock();
}

const texture = new THREE.TextureLoader().load("textures/1.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);

const geometry = new THREE.CubeGeometry(4, 4, 10, 50, 50, 50);
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: texture, side: THREE.DoubleSide });
const cube = new THREE.Mesh(geometry, material);

const light = new THREE.PointLight(0xffffff, 13, 5, 2);
light.position.set(0, 1.5, 2.5);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 13, 5, 2);
light2.position.set(0, 1.5, 0);
scene.add(light2);

const light3= new THREE.PointLight(0xffffff, 13, 5, 2);
light3.position.set(0, 1.5, -2.5);
scene.add(light3);

scene.add(cube);
camera.position.z = 4;

const SPEED = 0.1;
const TURN_SPEED = 4;

const colliders: THREE.Object3D[] = [cube];

interface InterfaceState {
	keysDown: string[],
	mouseMovement: {
		x: number,
		y: number
	}
};

const state: InterfaceState = {
	keysDown: [],
	mouseMovement: {
		x: 0,
		y: 0
	}
};

document.addEventListener('keydown', (event) => {
	state.keysDown = uniq(state.keysDown.concat(event.key));
});

document.addEventListener('keyup', (event) => {
	state.keysDown = state.keysDown.filter(key => key !== event.key);
});

const onMouseMove = (event: MouseEvent) => {
	global.console.log(event);
	state.mouseMovement.x += event.movementX;
	state.mouseMovement.y += event.movementY;
};

const lockChangeAlert = () => {
	if (document.pointerLockElement === renderer.domElement) {
			global.console.log('locked to canvas');
			document.addEventListener("mousemove", onMouseMove, false);
		} else {
			document.removeEventListener("mousemove", onMouseMove, false);
		}
	}
document.addEventListener('pointerlockchange', lockChangeAlert, false);

function animate() {
	if (state.mouseMovement.x || state.mouseMovement.y) {
		const dx = state.mouseMovement.x || 0;
		camera.rotation.y -= dx / window.innerWidth * TURN_SPEED;

		const dy = state.mouseMovement.y || 0;
		camera.rotation.x -= dy / window.innerHeight * TURN_SPEED;
		camera.rotation.x = Math.min(camera.rotation.x, 0.75);
		camera.rotation.x = Math.max(camera.rotation.x, -0.75);
		camera.rotation.order = 'YXZ'
	}
	const motion = new THREE.Vector3(0, 0, 0);
	if (state.keysDown.indexOf('w') > -1) {
		motion.z -= SPEED;
	}
	if (state.keysDown.indexOf('s') > -1) {
		motion.z += SPEED;
	}
	if (state.keysDown.indexOf('a') > -1) {
		motion.x -= SPEED;
	}
	if (state.keysDown.indexOf('d') > -1) {
		motion.x += SPEED;
	}
	motion.applyEuler(new THREE.Euler(0, camera.rotation.y, 0));

	const raycaster = new THREE.Raycaster(camera.position, motion.clone().normalize());
	const results = raycaster.intersectObjects(colliders);
	const collisions = results.filter(result => result.distance < 1);
	if (!collisions.length) {
		camera.position.add(motion);
	}

	// light.position.set(camera.position.x, camera.position.y, camera.position.z);
	state.mouseMovement.x = 0;
	state.mouseMovement.y = 0;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

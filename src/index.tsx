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

const geometry = new THREE.CubeGeometry(4, 4, 6, 50, 50, 50);
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: texture, side: THREE.DoubleSide });
const cube = new THREE.Mesh(geometry, material);

const light = new THREE.PointLight(0xffffff, 13, 4, 2);
light.position.set(0, 0, 4);
scene.add(light);

scene.add(cube);
cube.position.setZ(4)
camera.position.z = 5;

const SPEED = 0.1;
const TURN_SPEED = 4;

interface InterfaceState {
	keysDown: string[],
	mouseMovement: {
		x?: number,
		y?: number
	}
};

const state: InterfaceState = {
	keysDown: [],
	mouseMovement: {}
};

document.addEventListener('keydown', (event) => {
	state.keysDown = uniq(state.keysDown.concat(event.key));
});

document.addEventListener('keyup', (event) => {
	state.keysDown = state.keysDown.filter(key => key !== event.key);
});

const onMouseMove = (event: MouseEvent) => {
	global.console.com(event);
	state.mouseMovement.x = event.movementX;
	state.mouseMovement.y = event.movementY;
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
	}
	let moveLength = 0;
	if (state.keysDown.indexOf('w') > -1) {
		moveLength = -SPEED;
	}
	if (state.keysDown.indexOf('s') > -1) {
		moveLength = SPEED;
	}
	// if (state.keysDown.indexOf('a') > -1) {
	// 	camera.position.x -= SPEED;
	// }
	// if (state.keysDown.indexOf('d') > -1) {
	// 	camera.position.x += SPEED;
	// }
	const motion = new THREE.Vector3(0, 0, moveLength)
	camera.position.add(motion.applyEuler(camera.rotation));

	// light.position.set(camera.position.x, camera.position.y, camera.position.z);

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

import { uniq } from 'lodash';
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
const TURN_SPEED = 0.05;

interface InterfaceState {
	keysDown: string[],
	lastMousePos: {
		x?: number,
		y?: number
	}
	mousePos: {
		x?: number,
		y?: number
	}
};

const state: InterfaceState = {
	keysDown: [],
	lastMousePos: {},
	mousePos: {}
};

document.addEventListener('keydown', (event) => {
	state.keysDown = uniq(state.keysDown.concat(event.key));
});

document.addEventListener('keyup', (event) => {
	state.keysDown = state.keysDown.filter(key => key !== event.key);
});

document.addEventListener('mousemove', (event) => {
	state.mousePos.x = event.x;
	state.mousePos.y = event.y;

})

function animate() {
	if (state.mousePos.x && state.mousePos.y) {
		if (!state.lastMousePos.x || !state.lastMousePos.y) {
			state.lastMousePos.x = state.mousePos.x;
			state.lastMousePos.y = state.mousePos.y;
		}
		const dx = state.mousePos.x - state.lastMousePos.x;
		if (dx > 0) {
			camera.rotation.y -= TURN_SPEED;
		}
		if (dx < 0) {
			camera.rotation.y += TURN_SPEED;
		}
		state.lastMousePos = {
			x: state.mousePos.x,
			y: state.mousePos.y
		}
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
	const iranyVektor = new THREE.Vector3(0, 0, moveLength)
	camera.position.add(iranyVektor.applyEuler(camera.rotation));
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();


import * as THREE from 'three';

const playerGeometry = new THREE.CubeGeometry(0.5, 2, 0.5);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

const headGeometry = new THREE.ConeGeometry(0.25, 0.4, 10);

export default function createPlayerMesh() {
	const body = new THREE.Mesh(playerGeometry, playerMaterial);
	body.position.y = -1;
	const head = new THREE.Mesh(headGeometry, playerMaterial);
	head.position.set(0, 0.75, -0.4);
	head.rotateX(-Math.PI / 2)
	body.add(head);
	return body;
}




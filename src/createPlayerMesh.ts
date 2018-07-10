
import * as THREE from 'three';

const playerGeometry = new THREE.CubeGeometry(0.5, 2, 0.5);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

export default function createPlayerMesh() {
	return new THREE.Mesh(playerGeometry, playerMaterial);
}




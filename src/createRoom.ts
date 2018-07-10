import * as THREE from 'three';

export default function createRoom(scene: THREE.Scene) {
	const roomTexture = new THREE.TextureLoader().load("textures/1.jpg");
	roomTexture.wrapS = THREE.RepeatWrapping;
	roomTexture.wrapT = THREE.RepeatWrapping;
	roomTexture.repeat.set(4, 4);
	
	const roomGeometry = new THREE.CubeGeometry(4, 4, 10, 50, 50, 50);
	const roomMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: roomTexture, side: THREE.DoubleSide });
	const room = new THREE.Mesh(roomGeometry, roomMaterial);

	scene.add(room);

	
	const light = new THREE.PointLight(0xffffff, 13, 5, 2);
	light.position.set(0, 1.5, 2.5);
	scene.add(light);
	
	const light2 = new THREE.PointLight(0xffffff, 13, 5, 2);
	light2.position.set(0, 1.5, 0);
	scene.add(light2);
	
	const light3= new THREE.PointLight(0xffffff, 13, 5, 2);
	light3.position.set(0, 1.5, -2.5);
	scene.add(light3);

	return room;
}




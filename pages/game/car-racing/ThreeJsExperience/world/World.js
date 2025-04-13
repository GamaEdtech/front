import * as THREE from "three"
import Experience from '../Experience.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time


        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        )
        this.scene.add(mesh)
    }


    update() {
    }
}
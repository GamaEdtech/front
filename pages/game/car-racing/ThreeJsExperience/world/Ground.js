import * as THREE from "three"
import Experience from '../Experience.js'


export default class Ground {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.groundColor = "#70b449"
        this.groundSize = 100


        this.setGeometry()
        this.setMaterial()
        this.setMesh()


        this.setDebug()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(this.groundSize, this.groundSize)
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: this.groundColor
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.position.x = this.groundSize / 2
        this.mesh.position.z = this.groundSize / 2
        this.scene.add(this.mesh)
    }


    update() {
    }
    setDebug() {
        const GroundFolder = this.debug.ui.addFolder("Ground")
        GroundFolder.addColor(this, "groundColor").name("ground Color").onChange((value) => {
            this.material.color = new THREE.Color(value)
        })
        // GroundFolder.add(this.texture.repeat, "x").name("x reapet").min(1).max(100).step(1)
        // GroundFolder.add(this.texture.repeat, "y").name("y reapet").min(1).max(100).step(1)

    }
}
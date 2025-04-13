import * as THREE from 'three'
import Experience from './Experience.js'
// import { OrbitControls } from 'three/addons/controls/OrbitControls';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js').default;


export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time


        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(10, 10, 10)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true

    }


    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }



    update() {
        this.controls.update()
        this.instance.updateProjectionMatrix();
    }
}
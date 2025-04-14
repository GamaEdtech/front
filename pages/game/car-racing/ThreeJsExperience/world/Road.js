import * as THREE from "three"
import Experience from '../Experience.js'

import vertex from "../shaders/road/vertex.glsl"
import fragment from "../shaders/road/fragment.glsl"

export default class Road {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.options = this.experience.options



        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setDebug()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(this.options.roadSize, this.options.roadWidth, this.options.roadSize, this.options.roadWidth)
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uColor: new THREE.Uniform(new THREE.Color(this.options.colorRoad)),
                uDistortionX: new THREE.Uniform(new THREE.Vector2(this.options.roadAmplitudeX, this.options.roadFrequencyX)),
                uWidthLineArround: new THREE.Uniform(this.options.widthLineArround),
                uWidthLineSeperator: new THREE.Uniform(this.options.widthLineSeperator),
                uCountLine: new THREE.Uniform(this.options.countLine),
                uColorLineSeperator: new THREE.Uniform(new THREE.Color(this.options.colorLineSeperator)),
                uColorLineArround: new THREE.Uniform(new THREE.Color(this.options.colorLineArround))
            }
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.position.set(
            this.options.roadSize / 2,
            0.5,
            (this.options.groundSize + this.options.roadWidth) / 2
        )
        this.scene.add(this.mesh)
    }


    update() {
    }
    setDebug() {
        const RoadFolder = this.debug.ui.addFolder("Road")
        RoadFolder.add(this.options, "roadAmplitudeX").min(-40).max(40).step(0.1).name("Road X Amplitude").onChange(() => {
            this.material.uniforms.uDistortionX.value.x = this.options.roadAmplitudeX
        })
        RoadFolder.add(this.options, "roadFrequencyX").min(-1).max(1).step(0.001).name("Road X Frequency").onChange(() => {
            this.material.uniforms.uDistortionX.value.y = this.options.roadFrequencyX
        })

        RoadFolder.addColor(this.options, "colorRoad").name("Road color").onChange(() => {
            this.material.uniforms.uColor.value = new THREE.Color(this.options.colorRoad)
        })

        RoadFolder.addColor(this.options, "colorLineSeperator").name("Line Seperator color").onChange(() => {
            this.material.uniforms.uColorLineSeperator.value = new THREE.Color(this.options.colorLineSeperator)
        })

        RoadFolder.addColor(this.options, "colorLineArround").name("Line Arround color").onChange(() => {
            this.material.uniforms.uColorLineArround.value = new THREE.Color(this.options.colorLineArround)
        })

        RoadFolder.add(this.options, "widthLineArround").min(-1).max(1).step(0.001).name("Width Line Arround").onChange(() => {
            this.material.uniforms.uWidthLineArround.value = this.options.widthLineArround
        })
        RoadFolder.add(this.options, "widthLineSeperator").min(-1).max(1).step(0.001).name("Width Line Seperator").onChange(() => {
            this.material.uniforms.uWidthLineSeperator.value = this.options.widthLineSeperator
        })

        RoadFolder.add(this.options, "countLine").min(0).max(10).step(1).name("Count Line").onChange(() => {
            this.material.uniforms.uCountLine.value = this.options.countLine
        })
    }
}
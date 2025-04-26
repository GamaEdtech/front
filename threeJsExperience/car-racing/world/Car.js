import * as THREE from "three"
import Experience from '../Experience.js'


export default class Car {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.options = this.experience.options
        this.resourses = this.experience.resources

        this.laneCount = this.options.countLine
        this.currentLane = 1
        this.targetLane = this.currentLane
        this.laneWidth = this.options.roadWidth / this.laneCount
        this.positionX = this.options.offsetXStart
        this.speed = this.options.carBaseSpeed
        this.positionMiddleRoad = this.options.mountainWidth + (this.options.groundWidth / 2)
        this.wheelCircumference = 2 * Math.PI * 0.4
        this.laneLerpSpeed = this.options.laneLerpSpeed



        window.addEventListener("keydown", (event) => {
            if (event.code === "ArrowUp") {
                this.moveForward()
            } else if (event.code === "ArrowLeft") {
                this.changeLane(-1)
            } else if (event.code === "ArrowRight") {
                this.changeLane(1)
            } else if (event.code === "ArrowDown") {
                this.moveBackward()
            }
        })

        this.setMesh()
        this.setDebug()
    }

    getLaneZOffset(laneNumber) {
        const center = (this.laneCount + 1) / 2;
        return -((center - laneNumber) * this.laneWidth) + this.positionMiddleRoad;
    }

    getRoadZOffset(positionX) {
        return Math.cos(positionX * this.options.roadFrequencyX) * this.options.roadAmplitudeX
    }

    getFinalZ(positionX, currentLane) {
        return this.getRoadZOffset(positionX) + this.getLaneZOffset(currentLane)
    }

    updateRotation() {
        const deltaX = 0.1
        const currentZ = this.getFinalZ(this.positionX, this.currentLane)
        const nextZ = this.getFinalZ(this.positionX - deltaX, this.currentLane)

        const dz = nextZ - currentZ
        const angle = Math.atan2(dz, deltaX)

        const laneChangeProgress = Math.abs(this.targetLane - this.currentLane)
        const direction = Math.sign(this.targetLane - this.currentLane)
        const laneTurnFactor = Math.sin(laneChangeProgress * Math.PI)
        const laneTurnAngle = direction * laneTurnFactor * 0.75

        this.wheels.pivotFront.rotation.y = -laneTurnAngle * 0.7 + Math.PI / 2
        this.mesh.rotation.y = angle - laneTurnAngle
    }


    moveForward() {
        this.positionX += this.speed
        const z = this.getFinalZ(this.positionX, this.currentLane)
        this.mesh.position.set(this.positionX, 0.5, z)
        this.updateRotation()
    }

    moveBackward() {
        this.positionX -= this.speed
        const z = this.getFinalZ(this.positionX, this.currentLane)
        this.mesh.position.set(this.positionX, 0.5, z)
        this.updateRotation()
    }

    changeLane(direction) {
        const newLane = this.targetLane + direction
        if (newLane > 0 && newLane <= this.laneCount) {
            this.targetLane = newLane
        }
    }

    setMesh() {
        this.mesh = this.resourses.items.carGLTFModel.scene

        this.mesh.scale.set(0.8, 0.8, 0.8)
        this.mesh.position.x = this.positionX
        this.mesh.position.z = this.getFinalZ(this.positionX, this.currentLane)
        this.mesh.position.y = 0.6
        this.scene.add(this.mesh)
        this.wheels = {}
        this.mesh.traverse((child) => {
            if (child.name == 'backWheel') {
                this.wheels.back = child.children[0]
            } else if (child.name == 'frontWheel') {
                this.wheels.front = child.children[0]
                this.wheels.pivotFront = child
            }
        })
    }


    update() {
        const distancePerFrame = this.speed * (this.time.delta / 1000)
        this.positionX += distancePerFrame
        this.currentLane = THREE.MathUtils.lerp(this.currentLane, this.targetLane, (this.time.delta / 1000) * this.laneLerpSpeed)
        this.mesh.position.set(this.positionX, 0.5, this.getFinalZ(this.positionX, this.currentLane))

        this.updateRotation()

        if (this.wheels) {
            const rotationAngle = (distancePerFrame / this.wheelCircumference) * Math.PI * 2
            this.wheels.front.rotation.x += rotationAngle
            this.wheels.back.rotation.x += rotationAngle
        }
    }
    setDebug() {
        const CarFolder = this.debug.ui.addFolder("Car")
        CarFolder.add(this, "speed").min(0).max(40).step(0.01).name("Base Speed Car")
    }
}

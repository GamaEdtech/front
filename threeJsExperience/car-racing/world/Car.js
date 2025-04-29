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

        this.currentQuestionIndex = 0
        this.checkThreshold = 2
        this.questionPositions = this.options.questions.map((q, index) => {
            return (this.options.roadSize / (this.options.questions.length + 1)) * (index + 1)
        })


        this.isReversing = false
        this.reverseStartX = 0
        this.reverseDistance = this.options.reverseDistanceWrongAnswer
        this.reverseSpeed = this.options.reverseSpeedWrongAnswer
        this.reverseRotationSpeed = this.options.reverseRotationSpeedWrongAnswer
        this.wrongAnswerRotationY = 0


        this.isJumping = false
        this.jumpStartY = 0.6
        this.jumpHeight = this.options.jumpHeightCorrectAnswer
        this.jumpProgress = 0
        this.jumpDuration = this.options.jumpDurationCorrectAnswer
        this.correctAnswerRotationY = 0


        this.laneChangeProgress = 0;
        this.laneChangeDirection = 0;
        this.isChangingLane = false;


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

        if (this.isChangingLane) {
            const targetProgress = Math.abs(this.targetLane - this.currentLane);
            this.laneChangeProgress = THREE.MathUtils.lerp(this.laneChangeProgress, targetProgress, 0.1);
            if (Math.abs(this.currentLane - this.targetLane) < 0.01) {
                this.currentLane = this.targetLane;
                this.isChangingLane = false;
                this.laneChangeProgress = 0;
            }
        }

        const smoothProgress = this.laneChangeProgress * this.laneChangeProgress * (3 - 2 * this.laneChangeProgress);
        const laneTurnAngle = this.laneChangeDirection * smoothProgress * 0.75;

        this.wheels.pivotFront.rotation.y = -laneTurnAngle * 0.9 + Math.PI / 2
        this.mesh.rotation.y = angle - laneTurnAngle + this.wrongAnswerRotationY + this.correctAnswerRotationY
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
        const newLane = this.targetLane + direction;
        if (newLane > 0 && newLane <= this.laneCount) {
            this.targetLane = newLane;
            this.laneChangeDirection = direction;
            this.isChangingLane = true;
            this.laneChangeProgress = 0;
        }
    }

    reset() {
        this.positionX = this.options.offsetXStart
        this.currentQuestionIndex = 0
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


    checkQuestionCollision() {
        if (this.currentQuestionIndex >= this.questionPositions.length) {
            const result = {
                status: "success"
            }
            this.experience.callBacks.onResultGameChange(result)
            return
        };

        const targetX = this.questionPositions[this.currentQuestionIndex];
        const distance = Math.abs(this.positionX - targetX);


        if (distance < this.checkThreshold) {
            const correctLane = this.options.questions[this.currentQuestionIndex].indexAnswer + 1

            if (this.targetLane === correctLane) {
                if (!this.isJumping) {
                    this.isJumping = true
                    this.jumpStartY = 0.6
                    this.jumpProgress = 0
                }
                this.currentQuestionIndex += 1
                this.experience.callBacks.onQuestionChange()
                this.experience.callBacks.onQuestionStatusChange("success")
                this.experience.callBacks.onScoreChange(1)
            } else {
                if (!this.isReversing) {
                    this.reverseStartX = this.positionX
                    this.isReversing = true
                    this.wrongAnswerRotationY = 0
                }
                this.experience.callBacks.onQuestionStatusChange("error")
            }
        }
    }

    reverseStep() {
        if (this.positionX > this.reverseStartX - this.reverseDistance) {
            this.positionX -= this.reverseSpeed
            this.wrongAnswerRotationY += this.reverseRotationSpeed
            if (this.wrongAnswerRotationY >= Math.PI * 2 * 3) {
                this.wrongAnswerRotationY = 0
            }
        } else {
            this.isReversing = false
            this.wrongAnswerRotationY = 0
        }
    }

    jumpStep() {
        this.jumpProgress += 1

        const t = this.jumpProgress / this.jumpDuration
        const jumpCurve = Math.sin(Math.PI * t)
        this.mesh.position.y = this.jumpStartY + jumpCurve * this.jumpHeight
        this.correctAnswerRotationY = Math.PI * 2 * t

        if (this.jumpProgress >= this.jumpDuration) {
            this.isJumping = false
            this.mesh.position.y = this.jumpStartY
            this.correctAnswerRotationY = 0
        }
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

        this.checkQuestionCollision()

        if (this.isReversing) {
            this.reverseStep()
        }

        if (this.isJumping) {
            this.jumpStep()
        }
    }
    setDebug() {
        const CarFolder = this.debug.ui.addFolder("Car")
        CarFolder.add(this, "speed").min(0).max(40).step(0.01).name("Base Speed Car")
    }
}

import * as THREE from "three"
import Experience from '../Experience.js'
import Ground from './Ground.js'
import Road from "./Road.js"
import Mountain from "./Mountain.js"
import Lighting from "./Lighting.js"
import Clouds from "./Clouds.js"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.lighting = new Lighting()
        this.ground = new Ground()
        this.road = new Road()
        this.mountain = new Mountain()
        this.clouds = new Clouds()
    }


    update() {
        this.clouds.update()
    }
}
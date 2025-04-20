import * as THREE from "three"
import Experience from '../Experience.js'

export default class Trees {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.options = this.experience.options
        this.resources = this.experience.resources

        this.treeCount = 30

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setDebug()
    }

    setGeometry() {
        this.gltgModel = this.resources.items.treeGLTFModel.scene
        this.geometry = this.gltgModel.children.find(child => child.isMesh).geometry
    }

    setMaterial() {
        this.resources.items.treeBakedTexture.flipY = false
        this.resources.items.treeBakedTexture.colorSpace = THREE.SRGBColorSpace
        this.material = new THREE.MeshBasicMaterial({
            map: this.resources.items.treeBakedTexture
        })
    }

    setMesh() {
        this.meshes = new THREE.InstancedMesh(this.geometry, this.material, this.treeCount)
        this.meshes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        this.dummy = new THREE.Object3D()

        for (let i = 0; i < this.treeCount; i++) {
            const x = Math.random() * 200
            const y = 2.7
            const z = i < this.treeCount / 2 ? this.options.mountainWidth - 2 + Math.random() * 4 : this.options.mountainWidth + this.options.groundWidth - 4 + Math.random() * 4
            const scale = 0.5 + Math.random() * 0.2

            this.dummy.position.set(x, y, z)
            this.dummy.scale.set(scale, scale, scale)
            this.dummy.updateMatrix()
            this.meshes.setMatrixAt(i, this.dummy.matrix)
        }

        this.meshes.instanceMatrix.needsUpdate = true
        this.scene.add(this.meshes)
    }

    update() {
    }

    setDebug() {
        const TreesFolder = this.debug.ui.addFolder("TreesFolder")
    }
}

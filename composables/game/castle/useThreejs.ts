// composables/useThreejs.ts
import * as THREE from 'three'
import { ref, shallowRef } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function useThreeJS() {
    const scene = shallowRef(new THREE.Scene())
    const camera = shallowRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
    const animationFrameId = ref<number | null>(null)
    const material2006Objects = shallowRef<THREE.Object3D[]>([])
    const modelLoaded = ref(false)
    const castle = shallowRef<THREE.Object3D | null>(null)

    // Setup scene
    const setupScene = (container: HTMLDivElement) => {
        scene.value.background = new THREE.Color(0x0d001a)

        // Setup renderer
        renderer.value = new THREE.WebGLRenderer({ antialias: true })
        renderer.value.setPixelRatio(window.devicePixelRatio)
        renderer.value.setSize(window.innerWidth, window.innerHeight)
        renderer.value.outputColorSpace = THREE.SRGBColorSpace
        container.appendChild(renderer.value.domElement)

        // Add lights
        addLights()

        // Handle window resize
        window.addEventListener('resize', onWindowResize)
    }

    // Add lights to scene
    const addLights = () => {
        const ambientLight = new THREE.AmbientLight(0x909090, 1)
        scene.value.add(ambientLight)

        const pointLight = new THREE.PointLight(0x3333ff, 1.2, 200)
        pointLight.position.set(0, 15, 10)
        scene.value.add(pointLight)
    }

    // Load castle model
    const loadCastleModel = () => {
        const loader = new GLTFLoader()
        loader.load('/game/castle/castle-v2.glb', (gltf) => {
            castle.value = gltf.scene
            castle.value.scale.set(1, 1, 1)
            scene.value.add(castle.value)

            modelLoaded.value = true
        })
    }

    // Animation loop
    const startAnimationLoop = () => {
        const animate = () => {
            if (renderer.value) {
                renderer.value.render(scene.value, camera.value)
            }
            animationFrameId.value = requestAnimationFrame(animate)
        }
        animate()
    }

    // Handle window resize
    const onWindowResize = () => {
        if (renderer.value) {
            camera.value.aspect = window.innerWidth / window.innerHeight
            camera.value.updateProjectionMatrix()
            renderer.value.setSize(window.innerWidth, window.innerHeight)
        }
    }

    // Cleanup
    const cleanup = () => {
        if (animationFrameId.value !== null) {
            cancelAnimationFrame(animationFrameId.value)
        }
        window.removeEventListener('resize', onWindowResize)
    }

    return {
        scene,
        camera,
        renderer,
        setupScene,
        loadCastleModel,
        startAnimationLoop,
        cleanup,
        modelLoaded,
        castle
    }
}
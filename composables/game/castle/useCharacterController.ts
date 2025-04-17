// composables/useCharacterController.ts
import * as THREE from 'three'
import { shallowRef } from 'vue'

export function useCharacterController(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
) {
    const character = shallowRef<THREE.Object3D | null>(null)
    const characterBox = shallowRef<THREE.Box3 | null>(null)
    const moveSpeed = 1.5
    const rotationSpeed = 0.02

    // Movement state
    const moveState = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        mouseX: 0,
        mouseY: 0
    }

    // Create character
    const createCharacter = () => {
        // Create a character container
        const characterContainer = new THREE.Object3D()

        // Create character body (temporary box)
        const geometry = new THREE.BoxGeometry(2, 4, 2)
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        const body = new THREE.Mesh(geometry, material)
        body.position.y = 2 // Half the height
        characterContainer.add(body)

        // Add to scene and store reference
        scene.add(characterContainer)
        character.value = characterContainer

        // Set up character position and rotation
        characterContainer.position.set(0, 50, 450) // Starting position

        // Create bounding box for collision detection
        characterBox.value = new THREE.Box3().setFromObject(characterContainer)

        // Add camera to character
        characterContainer.add(camera)
        camera.position.set(0, 7, 0) // Camera above character head
        camera.lookAt(0, 7, -10) // Look forward

        return characterContainer
    }

    // Setup input controls
    const setupControls = () => {
        // Keyboard events
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        // Mouse events for rotation
        window.addEventListener('mousemove', onMouseMove)

        // Lock pointer for better control
        document.addEventListener('click', () => {
            document.body.requestPointerLock()
        })
    }

    // Handle key down
    const onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'KeyW':
                moveState.forward = true
                break
            case 'KeyS':
                moveState.backward = true
                break
            case 'KeyA':
                moveState.left = true
                break
            case 'KeyD':
                moveState.right = true
                break
        }
    }

    // Handle key up
    const onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'KeyW':
                moveState.forward = false
                break
            case 'KeyS':
                moveState.backward = false
                break
            case 'KeyA':
                moveState.left = false
                break
            case 'KeyD':
                moveState.right = false
                break
        }
    }

    // Handle mouse movement for head rotation
    const onMouseMove = (event: MouseEvent) => {
        if (document.pointerLockElement === document.body) {
            moveState.mouseX += event.movementX * 0.1
            moveState.mouseY += event.movementY * 0.1

            // Limit vertical rotation
            moveState.mouseY = Math.max(-45, Math.min(45, moveState.mouseY))

            // Apply rotation to camera
            if (character.value) {
                character.value.rotation.y = -moveState.mouseX * rotationSpeed
                camera.rotation.x = -moveState.mouseY * rotationSpeed * 0.5
            }
        }
    }

    // Update character position with collision detection focused on Material2006 objects
    const updateCharacter = () => {
        if (!character.value || !characterBox.value) return

        const direction = new THREE.Vector3()

        // Calculate movement direction based on character's facing direction
        if (moveState.forward) {
            direction.z -= moveSpeed
        }
        if (moveState.backward) {
            direction.z += moveSpeed
        }
        if (moveState.left) {
            direction.x -= moveSpeed
        }
        if (moveState.right) {
            direction.x += moveSpeed
        }

        // Normalize for consistent speed in all directions
        if (direction.length() > 0) {
            direction.normalize().multiplyScalar(moveSpeed)
        }

        // Transform direction to world space based on character's rotation
        direction.applyQuaternion(character.value.quaternion)

        // Test movement for collision
        const potentialPosition = character.value.position.clone().add(direction)

        // Update character bounding box for new position
        const potentialBox = characterBox.value.clone()
        potentialBox.translate(direction)

        // Check for collisions specifically with Material2006 objects
        let collision = false

        console.log(potentialPosition);


        // Define the boundaries
        const boundaries = {
            leftWall: {
                x: -78,
                z: -478.139803
            },
            rightWall: {
                x: 70,
                z: -478.139803
            },
            backWall: {
                z: 490
            },
            frontWall: {
                z: -812
            },
            corridorRightWall: {
                leftX: 2.4774,
                rightX: 85,
                z: -478.139803
            },
            corridorLeftWall: {
                leftX: -107.58,
                rightX: -34.8965,
                z: -478.139803
            },
            roomLeftWall: {
                x: -145.62,
                z: -577
            },
            roomRightWall: {
                x: 38.5,
                z: -577
            },
            door1: {
                leftX: 24,
                rightX: 62,
                z: 248.79,

                leftWall: {
                    leftX: -78,
                    rightX: 24
                },
                rightWall: {
                    leftX: 62,
                    rightX: 72
                }
            },
            door2: {
                leftX: -76,
                rightX: -36,
                z: 3.10,

                leftWall: {
                    leftX: -79,
                    rightX: -72
                },
                rightWall: {
                    leftX: -36,
                    rightX: 62
                }
            },
            door3: {
                leftX: 24,
                rightX: 62,
                z: -242.20,

                leftWall: {
                    leftX: -78,
                    rightX: 24
                },
                rightWall: {
                    leftX: 62,
                    rightX: 72
                }
            },
        }

        // Check if the potential position is within the boundaries
        if (
            (potentialPosition.x < boundaries.leftWall.x && potentialPosition.z > boundaries.leftWall.z)
            || (potentialPosition.x > boundaries.rightWall.x && potentialPosition.z > boundaries.rightWall.z)
            || (potentialPosition.z > boundaries.backWall.z)
            || (potentialPosition.z < boundaries.frontWall.z)
            || ((potentialPosition.x < boundaries.corridorRightWall.rightX && potentialPosition.x > boundaries.corridorRightWall.leftX) && (potentialPosition.z < boundaries.corridorRightWall.z && potentialPosition.z > boundaries.corridorRightWall.z - 100))
            || ((potentialPosition.x < boundaries.corridorLeftWall.rightX && potentialPosition.x > boundaries.corridorLeftWall.leftX) && (potentialPosition.z < boundaries.corridorLeftWall.z && potentialPosition.z > boundaries.corridorLeftWall.z - 100))
            || (potentialPosition.x < boundaries.roomLeftWall.x && potentialPosition.z < boundaries.roomLeftWall.z)
            || (potentialPosition.x > boundaries.roomRightWall.x && potentialPosition.z < boundaries.roomRightWall.z)
            || ((potentialPosition.x < boundaries.door1.leftWall.rightX && potentialPosition.x > boundaries.door1.leftWall.leftX) && (potentialPosition.z < boundaries.door1.z && potentialPosition.z > boundaries.door1.z - 5))
            || ((potentialPosition.x < boundaries.door1.rightWall.rightX && potentialPosition.x > boundaries.door1.rightWall.leftX) && (potentialPosition.z < boundaries.door1.z && potentialPosition.z > boundaries.door1.z - 5))
            || ((potentialPosition.x < boundaries.door2.rightWall.rightX && potentialPosition.x > boundaries.door2.rightWall.leftX) && (potentialPosition.z < boundaries.door2.z && potentialPosition.z > boundaries.door2.z - 5))
            || ((potentialPosition.x < boundaries.door2.leftWall.rightX && potentialPosition.x > boundaries.door2.leftWall.leftX) && (potentialPosition.z < boundaries.door2.z && potentialPosition.z > boundaries.door2.z - 5))
            || ((potentialPosition.x < boundaries.door3.leftWall.rightX && potentialPosition.x > boundaries.door3.leftWall.leftX) && (potentialPosition.z < boundaries.door3.z && potentialPosition.z > boundaries.door3.z - 5))
            || ((potentialPosition.x < boundaries.door3.rightWall.rightX && potentialPosition.x > boundaries.door3.rightWall.leftX) && (potentialPosition.z < boundaries.door3.z && potentialPosition.z > boundaries.door3.z - 5))) {
            collision = true
        }

        // If there's a collision, try to move in other directions
        if (collision) {
            // Try moving forward/backward
            if (moveState.forward || moveState.backward) {
                const forwardDirection = new THREE.Vector3(0, 0, moveState.forward ? -moveSpeed : moveSpeed)
                forwardDirection.applyQuaternion(character.value.quaternion)
            }

            // Try moving left/right
            if (moveState.left || moveState.right) {
                const sideDirection = new THREE.Vector3(moveState.left ? -moveSpeed : moveSpeed, 0, 0)
                sideDirection.applyQuaternion(character.value.quaternion)
            }
        } else {
            // Move character if no collision
            character.value.position.copy(potentialPosition)
            characterBox.value.setFromObject(character.value)
        }
    }

    // Cleanup event listeners
    const cleanup = () => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
        window.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('click', () => { })
    }

    return {
        createCharacter,
        setupControls,
        updateCharacter,
        cleanup,
        character
    }
}
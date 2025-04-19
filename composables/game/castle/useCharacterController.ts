// composables/useCharacterController.ts
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { shallowRef, ref } from 'vue'
import { nearDoor, openedDoors} from '@/store/doorStatus'
import { watch } from 'vue'
import { doorModels } from '~/store/doorModels'
import { animate } from 'animejs'

// Define types for better code organization
interface MoveState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    mouseX: number;
    mouseY: number;
}

interface BoundaryWall {
    x: number;
    z: number;
    leftX: number;
    rightX: number;
}

interface DoorBoundary {
    leftX: number;
    rightX: number;
    z: number;
    leftWall: {
        leftX: number;
        rightX: number;
    };
    rightWall: {
        leftX: number;
        rightX: number;
    };
}

interface CastleBoundaries {
    leftWall: BoundaryWall;
    rightWall: BoundaryWall;
    backWall: BoundaryWall;
    frontWall: BoundaryWall;
    corridorRightWall: BoundaryWall;
    corridorLeftWall: BoundaryWall;
    roomLeftWall: BoundaryWall;
    roomRightWall: BoundaryWall;
    door1: DoorBoundary;
    door2: DoorBoundary;
    door3: DoorBoundary;
}


export function useCharacterController(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    container: HTMLDivElement
) {
    // Character references
    const character = shallowRef<THREE.Object3D | null>(null)
    const characterBox = shallowRef<THREE.Box3 | null>(null)

    // Interaction state
    const isNearDoor = ref(false)
    const doorPositions: Record<string, THREE.Vector3> = {
        door001: new THREE.Vector3(43, 55, 248), // Estimated position for Door.001
        door002: new THREE.Vector3(-56, 55, 3), // Estimated position for Door.002
        door003: new THREE.Vector3(43, 55, -242) // Position of Door.003
    }
    const INTERACTION_DISTANCE = 50 // Distance to show interaction prompt

    // Movement constants
    const MOVE_SPEED = 1.5
    const ROTATION_SPEED = 0.02

    // Movement state
    const moveState: MoveState = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        mouseX: 0,
        mouseY: 0
    }

    // Castle boundaries for collision detection
    const boundaries: CastleBoundaries = {
        leftWall: {
            x: -78,
            z: -478.139803,
            leftX: -79,
            rightX: -77
        },
        rightWall: {
            x: 70,
            z: -478.139803,
            leftX: 69,
            rightX: 71
        },
        backWall: {
            z: 490,
            x: 0,
            leftX: -78,
            rightX: 70
        },
        frontWall: {
            z: -812,
            x: 0,
            leftX: -78,
            rightX: 70
        },
        corridorRightWall: {
            leftX: 2.4774,
            rightX: 85,
            z: -478.139803,
            x: 43.7387
        },
        corridorLeftWall: {
            leftX: -160.58,
            rightX: -31.8965,
            z: -478.139803,
            x: -71.2383
        },
        roomLeftWall: {
            x: -145.62,
            z: -577,
            leftX: -146,
            rightX: -145
        },
        roomRightWall: {
            x: 38.5,
            z: -577,
            leftX: 38,
            rightX: 39
        },
        door1: {
            leftX: 24,
            rightX: 62,
            z: 248.79,
            leftWall: {
                leftX: -78,
                rightX: 28
            },
            rightWall: {
                leftX: 58,
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
                leftX: -40,
                rightX: 70
            }
        },
        door3: {
            leftX: 24,
            rightX: 62,
            z: -242.20,
            leftWall: {
                leftX: -78,
                rightX: 30
            },
            rightWall: {
                leftX: 58,
                rightX: 72
            }
        },
    }

    watch(openedDoors, (newVal) => {
        if(newVal.door001 == true) {
            if (doorModels.door001.model) {
                animate(doorModels.door001.model.rotation, {
                    z: -3.2,
                    duration: 1000,
                    easing: 'easeInOutSine'
                })
            }
        }
        if(newVal.door002 == true) {
            if (doorModels.door002.model) {
                animate(doorModels.door002.model.rotation, {
                    z: -3.2,
                    duration: 1000,
                    easing: 'easeInOutSine'
                })
            }
        }
        if(newVal.door003 == true) {
            if (doorModels.door003.model) {
                animate(doorModels.door003.model.rotation, {
                    z: -3.2,
                    duration: 1000,
                    easing: 'easeInOutSine'
                })
            }
        }
        
    }, { deep: true })

    /**
     * Updates interaction state based on proximity to doors
     */
    const updateInteractions = () => {
        if (!character.value) return

        let nearAnyDoor = false;

        // Check distance to each door
        for (const doorKey in doorPositions) {
            const doorPosition = doorPositions[doorKey];
            const distanceToDoor = character.value.position.distanceTo(doorPosition);
            
            if ((distanceToDoor < INTERACTION_DISTANCE) && !openedDoors[doorKey as "door001" | "door002" | "door003"]) {
                nearAnyDoor = true;
                nearDoor.value = doorKey as "door001" | "door002" | "door003";
                break;
            }
        }

        // Update door proximity state (only log when state changes)
        const wasNearDoor = isNearDoor.value;
        isNearDoor.value = nearAnyDoor;

        if (wasNearDoor !== isNearDoor.value) {
            console.log(`Door proximity changed: ${isNearDoor.value ? "Near door" : "Away from door"}`);
        }
    }

    /**
     * Creates and sets up the character in the scene
     */
    const createCharacter = () => {
        // Create a character container
        const characterContainer = new THREE.Object3D()

        // Create character body
        const geometry = new THREE.BoxGeometry(2, 4, 2)
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        const body = new THREE.Mesh(geometry, material)
        body.position.y = 2 // Half the height
        characterContainer.add(body)

        // Add to scene and store reference
        scene.add(characterContainer)
        character.value = characterContainer

        // Set up character position
        characterContainer.position.set(0, 50, 450) // Starting position

        // Create bounding box for collision detection
        characterBox.value = new THREE.Box3().setFromObject(characterContainer)

        // Add camera to character
        characterContainer.add(camera)
        camera.position.set(0, 7, 0) // Camera above character head
        camera.lookAt(0, 7, -10) // Look forward

        return characterContainer
    }

    /**
     * Sets up input controls for character movement
     */
    const setupControls = () => {
        // Keyboard events
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        // Mouse events for rotation
        window.addEventListener('mousemove', onMouseMove)

        // Lock pointer for better control
        container.addEventListener('click', () => {
            container.requestPointerLock()
        })
    }

    /**
     * Handles keydown events for movement
     */
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

    /**
     * Handles keyup events for movement
     */
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

    /**
     * Handles mouse movement for camera rotation
     */
    const onMouseMove = (event: MouseEvent) => {
        if (document.pointerLockElement === container) {
            moveState.mouseX += event.movementX * 0.1
            moveState.mouseY += event.movementY * 0.1

            // Limit vertical rotation
            moveState.mouseY = Math.max(-45, Math.min(45, moveState.mouseY))

            // Apply rotation to character and camera
            if (character.value) {
                character.value.rotation.y = -moveState.mouseX * ROTATION_SPEED
                camera.rotation.x = -moveState.mouseY * ROTATION_SPEED * 0.5
            }
        }
    }

    /**
     * Calculates movement direction based on input
     */
    const calculateMovementDirection = (): THREE.Vector3 => {
        const direction = new THREE.Vector3()

        if (moveState.forward) direction.z -= MOVE_SPEED
        if (moveState.backward) direction.z += MOVE_SPEED
        if (moveState.left) direction.x -= MOVE_SPEED
        if (moveState.right) direction.x += MOVE_SPEED

        // Normalize for consistent speed in all directions
        if (direction.length() > 0) {
            direction.normalize().multiplyScalar(MOVE_SPEED)
        }

        return direction
    }

    /**
     * Checks if a position collides with castle boundaries
     */
    const checkCollision = (position: THREE.Vector3): boolean => {
        const { x, z } = position
        const b = boundaries;

        // Check main walls
        if ((x < b.leftWall.x && z > b.leftWall.z) ||
            (x > b.rightWall.x && z > b.rightWall.z) ||
            (z > b.backWall.z) ||
            (z < b.frontWall.z)) {
            return true;
        }

        // Check corridor walls
        if ((x < b.corridorRightWall.rightX && x > b.corridorRightWall.leftX) &&
            (z < b.corridorRightWall.z && z > b.corridorRightWall.z - 100)) {
            return true;
        }

        if ((x < b.corridorLeftWall.rightX && x > b.corridorLeftWall.leftX) &&
            (z < b.corridorLeftWall.z && z > b.corridorLeftWall.z - 100)) {
            return true;
        }

        // Check room walls
        if ((x < b.roomLeftWall.x && z < b.roomLeftWall.z) ||
            (x > b.roomRightWall.x && z < b.roomRightWall.z)) {
            return true;
        }

        // Check doors
        const checkDoorWalls = (door: DoorBoundary) => {
            
            return ((x < door.leftWall.rightX && x > door.leftWall.leftX) &&
                (z < door.z && z > door.z - 5)) ||
                ((x < door.rightWall.rightX && x > door.rightWall.leftX) &&
                    (z < door.z && z > door.z - 5));
        };

        const checkDoor = (door: DoorBoundary, doorName: string) => {
            return ((x > door.leftX && x < door.rightX) &&
                (z > door.z && z < door.z + 5)) && !openedDoors[doorName as "door001" | "door002" | "door003"];
        };

        if (checkDoorWalls(b.door1) || checkDoorWalls(b.door2) || checkDoorWalls(b.door3)) {
            return true;
        }

        if (checkDoor(b.door1, "door001") || checkDoor(b.door2, "door002") || checkDoor(b.door3, "door003")) {
            return true;
        }

        return false;
    }

    /**
     * Checks collisions for a single component (x or z)
     */
    // const checkComponentCollision = (currentPos: THREE.Vector3, newPos: THREE.Vector3): boolean => {
    //     // Create a test position that only moves in one component
    //     const testPosX = currentPos.clone();
    //     testPosX.x = newPos.x;

    //     const testPosZ = currentPos.clone();
    //     testPosZ.z = newPos.z;

    //     return checkCollision(testPosX) || checkCollision(testPosZ);
    // }

    /**
     * Updates character position with collision detection and wall sliding
     */
    const updateCharacter = () => {
        if (!character.value || !characterBox.value) return

        // Calculate movement direction
        const direction = calculateMovementDirection()

        // Transform direction to world space based on character's rotation
        if (character.value) {
            direction.applyQuaternion(character.value.quaternion)
        }

        // Current position
        const currentPosition = character.value.position.clone()

        // Test movement for collision (full movement)
        const potentialPosition = currentPosition.clone().add(direction)

        // Check for collisions
        const collision = checkCollision(potentialPosition)

        if (!collision) {
            // No collision, move normally
            character.value.position.copy(potentialPosition)
        } else {
            // Try moving only in X direction
            const xOnlyPosition = currentPosition.clone()
            xOnlyPosition.x += direction.x

            // Try moving only in Z direction
            const zOnlyPosition = currentPosition.clone()
            zOnlyPosition.z += direction.z

            const xCollision = checkCollision(xOnlyPosition)
            const zCollision = checkCollision(zOnlyPosition)

            // Allow sliding along walls
            if (!xCollision) {
                character.value.position.x = xOnlyPosition.x
            }

            if (!zCollision) {
                character.value.position.z = zOnlyPosition.z
            }
        }

        // Update character bounding box
        characterBox.value.setFromObject(character.value)

        // Update interaction states
        updateInteractions()
    }

    /**
     * Cleans up event listeners
     */
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
        character,
        isNearDoor
    }
}
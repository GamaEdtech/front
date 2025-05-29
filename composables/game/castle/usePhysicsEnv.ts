import * as THREE from 'three'

const createGround = (scene: THREE.Scene) => {
    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1500, 3, 1500), // 15x bigger
        new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0 })
    )
    groundMesh.position.set(0, -1.5, 0) // 15x bigger
    scene.add(groundMesh)
    return groundMesh
}

// const spawnerBox = (): {
//     create: () => { boxSize: { x: number, y: number, z: number } },
// } => {
//     // let blueBox: THREE.Mesh;
//     // const create = () => {
//         const boxSize = { x: 25, y: 25, z: 25 } // 15x bigger
//         // blueBox = new THREE.Mesh(
//         //     new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z),
//         //     new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 })
//         // )
//         // blueBox.position.set(-72.580, 2.140, -182.249)
//         // blueBox.rotation.set(0, 3.14, 0)
//         // blueBox.scale.y = 0.640
//         // scene.add(blueBox)

//         return { boxSize }
//     // }

//     // const cleanup = () => {
//     //     scene.remove(blueBox)
//     //     blueBox.geometry.dispose()
//     //     if (Array.isArray(blueBox.material)) {
//     //         blueBox.material.forEach(mat => mat.dispose())
//     //     } else {
//     //         blueBox.material.dispose()
//     //     }
//     // }

//     // return {
//     //     create
//     // }
// }

export {
    createGround,
    // spawnerBox
}
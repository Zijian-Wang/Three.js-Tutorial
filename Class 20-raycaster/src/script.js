import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Raycaster } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add( new THREE.AxesHelper( 5 ) )

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Ray Caster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3( -1, 0, 0 )
// const rayDirection = new THREE.Vector3( 1, 0, 0 )
// rayDirection.normalize()

// raycaster.set( rayOrigin, rayDirection )

// const intersects = raycaster.intersectObjects( [object1, object2, object3] )
// const intersect = raycaster.intersectObject( object2 )

// console.log(intersects, intersect)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    // console.log(mouse.x, mouse.y)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 1.5) * 1
    object2.position.y = Math.cos(elapsedTime * 0.8) * 1
    object3.position.y = Math.sin(elapsedTime * 1.2) * 1

    // // Detect intersections each frame
    // const rayOrigin = new THREE.Vector3( -5, 0, 0 )
    // const rayDirection = new THREE.Vector3( 1, 0, 0 )
    // rayDirection.normalize()
    // raycaster.set( rayOrigin, rayDirection )

    // const objectTestGroup = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects( objectTestGroup )

    // // console.log(intersects.length)
    
    // // Change intersected objects' color (! Need to change not hitted obje  cts' color back)
    // for( const object in objectTestGroup)
    // {
    //     objectTestGroup[object].material.color.set('#BA68C8')
    // }

    // for( const intersect in intersects )
    // {
    //     intersects[intersect].object.material.color.set('#00ff00')
    // }

    // Ray Test from camera and mouse
    raycaster.setFromCamera(mouse, camera)
    const objectTestGroup = [object1, object2, object3]
    const intersects = raycaster.intersectObjects( objectTestGroup )

    // console.log(intersects.length)
    
    // Change intersected objects' color (! Need to change not hitted obje  cts' color back)
    for( const object in objectTestGroup)
    {
        objectTestGroup[object].material.color.set('#BA68C8')
    }

    for( const intersect in intersects )
    {
        intersects[intersect].object.material.color.set('#00ff00')
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const aspectRatio = sizes.width / sizes.height

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const axesHelper = new THREE.AxesHelper(2)
scene.add(mesh, axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 5000)
// camera.position.x = 2
// camera.position.y = 2
camera.position.set( 0, 2, 4 )
camera.lookAt(mesh.position)
scene.add(camera)

//cursor
const cursor = {
    x: 0,
    y: 0
}

//collect mouse move
window.addEventListener('mousemove', (event) => {
    
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - event.clientY / sizes.height + 0.5

    // console.log(`X = ${cursor.x} Y = ${cursor.y}`)
})

//add control
const controls = new OrbitControls( camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.2
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//make responsive window
window.addEventListener( 'resize', () => {
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize( sizes.width, sizes.height )
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) )
})

//add full screen function
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    //update camera
    const amplify = 3

    //xy plane animation
    // camera.position.x = - cursor.x * amplify
    // camera.position.y = - cursor.y * amplify

    //xz plane animation
    // camera.position.x = Math.cos( cursor.x * Math.PI * 1 ) * amplify
    // camera.position.z = Math.sin( cursor.x * Math.PI * 1 ) * amplify
    // camera.position.y = cursor.y * amplify
    //camera.lookAt(mesh.position)

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

// debug
const gui = new GUI()

const debugObject = {
    color: 0x175fff, 
    spin: () => {
        gsap.to( geometry.rotation, { duration: 2, y: geometry.rotation.y + Math.PI * 2})
    }
}

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
const geometry = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, debugObject.geoSubD, debugObject.geoSubD, debugObject.geoSubD),
    new THREE.MeshBasicMaterial({ color: debugObject.color })
)
const axesHelper = new THREE.AxesHelper(2)
scene.add(geometry, axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 5000)
// camera.position.x = 2
// camera.position.y = 2
camera.position.set( 0, 2, 4 )
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

// debug pannel add
gui.add(geometry.position, 'x', -5, 5, 0.1 ).name('X Pos')
gui.add(geometry.position, 'y', -5, 5, 0.1 ).name('Height')
gui.add(geometry.position, 'z', -5, 5, 0.1 ).name('Z Pos')

//another way to write method chaining
gui
    .add(geometry, 'visible')
    .name('Show: ')
    
gui
    .add(geometry.material, 'wireframe')

gui
    .addColor(debugObject, 'color')
    .onChange( () => {
        geometry.material.color.set(debugObject.color)
    })

gui
    .add(debugObject, 'spin')

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

    camera.lookAt(geometry.position)
    camera.updateProjectionMatrix()

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
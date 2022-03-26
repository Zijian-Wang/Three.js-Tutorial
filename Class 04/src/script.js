import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

//create scene
const scene = new THREE.Scene()

const group = new THREE.Group()
scene.add(group)

//red cube
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial( {color: 'green' }),
)
cube1.position.x = -2
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'red'})
)
cube2.position.x = 0
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'purple'})
)
cube3.position.x = 2
group.add( cube1, cube2, cube3 )
group.rotation.y = Math.PI * 0.3
group.rotation.z = Math.PI * -0.1

//define fixed size
const size = {
    width: 800,
    height: 600
}

//add a camera
const cam1 = new THREE.PerspectiveCamera( 36, size.width / size.height, 0.1, 1000)
cam1.position.z = 5
cam1.position.y = 1
cam1.lookAt(group.position)
scene.add( cam1 )


//axis helper
const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)

//create renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//set render size
renderer.setSize(size.width, size.height)

const clock = new THREE.Clock()

//gsap is a library for doing animation
gsap.to(group.position, { 
    x: 1, 
    duration: 2,
    delay: 3
})

gsap.to(group.position, { 
    x: -5,
    y: 2, 
    duration: 1,
    delay: 1
})

//animations!!!
const tick = () =>
{
    //time 
    // const currenttTime = Date.now()
    // const deltaTime = currenttTime - time
    // time = currenttTime
    // console.log(deltaTime)

    //clock method
    // const elapsedTime = clock.getElapsedTime()
    // // console.log(elapsedTime)

    // //update objects
    // group.rotation.y = 1 * elapsedTime
    // group.rotation.z = Math.sin(elapsedTime * Math.PI * 0.5)
    // group.position.x = Math.sin(-elapsedTime)
    // group.position.y = Math.cos(-elapsedTime)
    // cam1.lookAt(group.position)

    //render
    renderer.render(scene, cam1)

    window.requestAnimationFrame(tick)
}

tick()
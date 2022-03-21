import './style.css'
import * as THREE from 'three'

//create scene
const scene = new THREE.Scene()

//red cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'fff'})
const cube = new THREE.Mesh( geometry, material)
scene.add( cube )

//define fixed size
const size = {
    width: 800,
    height: 600
}

//add a camera
const cam1 = new THREE.PerspectiveCamera( 36, size.width / size.height, 0.1, 1000)
cam1.position.z = 5
scene.add( cam1 )


//axis helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//create renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas
})
//set render size
renderer.setSize(size.width, size.height)

renderer.render(scene, cam1)

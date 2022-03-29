import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { PCFShadowMap, PCFSoftShadowMap } from 'three'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight()
// ambientLight.color = new THREE.Color('white')
// ambientLight.intensity = 0.3
// scene.add(ambientLight)

// const areaLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1)
// areaLight.position.set( 1, 1, 1)
// areaLight.lookAt(new THREE.Vector3(0, 0, 0))
// scene.add(areaLight)
// // areaLight.castShadow = true
// const arealightHelper = new RectAreaLightHelper(areaLight)
// scene.add(arealightHelper)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.width = 2048
// directionalLight.shadow.mapSize.height = 2048
// directionalLight.shadow.radius = 5
// directionalLight.shadow.blurSamples = 32
// directionalLight.shadow.camera.far = 2
// directionalLight.shadow.camera.top = 2
// directionalLight.shadow.camera.left = -2
// directionalLight.shadow.camera.right = 2
// directionalLight.shadow.camera.bottom = -2
// scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

const spotLight = new THREE.SpotLight(0xffffff, 2, 8, Math.PI*0.3, 1, 1)
spotLight.position.set(0, 3, 3)
spotLight.target.position.set(0, 0, -3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048
spotLight.shadow.radius = 5
spotLight.shadow.blurSamples = 32
spotLight.shadow.camera.far = 5
spotLight.shadow.camera.near = 3
// window.addEventListener('mousemove', (event) => {
//     spotLight.target.position.x = (event.clientX/window.innerWidth - 0.5) * 10
//     // spotLight.target.position.y = event.clientY
//     window.requestAnimationFrame( () => {
//         spotlightHelper.update()
//     })
// })
scene.add(spotLight, spotLight.target)

const spotlightHelper = new THREE.SpotLightHelper(spotLight)
const spotlightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotlightCameraHelper.visible = false
spotlightHelper.visible = false
scene.add(spotlightHelper, spotlightCameraHelper)
window.requestAnimationFrame( () => {
    spotlightHelper.update()
})

const pointLight = new THREE.PointLight(0xffffff, 0.3, 8, 1)
pointLight.position.set(1, 1, 0)
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 2048
pointLight.shadow.mapSize.height = 2048
pointLight.shadow.radius = 32
pointLight.shadow.camera.far = 8
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLight, pointLightCameraHelper)

// const shadowMap = {
//     resolution: 0
// }
// gui.add( shadowMap, 'resolution' ).min(0).max(4).step(1)
// gui.onChange( () => {
//     directionalLight.shadow.mapSize.width = Math.pow(2, 9 + shadowMap.resolution),
//     directionalLight.shadow.mapSize.height = Math.pow(2, 9 + shadowMap.resolution),
//     console.log(directionalLight.shadow.mapSize)
// })

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
sphere.castShadow = true

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true

scene.add(sphere, cube, torus, plane)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false
// renderer.shadowMap.type = PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
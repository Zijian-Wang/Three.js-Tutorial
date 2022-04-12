import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random(),
        {
            x: Math.random() * 3 - 1.5,
            y: Math.random() * 3 + 1,
            z: Math.random() * 3 - 1.5,
        }
    )
}
debugObject.createBox = () => {
    const boxSize = Math.random() + 0.1
    createBox(
        boxSize,
        boxSize,
        boxSize,
        {
            x: Math.random() * 3 - 1.5,
            y: Math.random() * 3 + 1,
            z: Math.random() * 3 - 1.5,
        }
    )
}
debugObject.reset = () => {
    console.log('reset')
    for(const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        scene.remove(object.mesh)
    }
    objectsToUpdate.slice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    // console.log(collision)
    const strength = collision.contact.getImpactVelocityAlongNormal()
    // console.log(strength)

    if(strength > 1){
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Physics material
const concreteMaterial = new CANNON.Material('concreteMaterial')
const plasticMaterial = new CANNON.Material('plasticMaterial')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.5,
        restitution: 0.8,
    }
)
world.addContactMaterial(concretePlasticContactMaterial)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// Create floor for colision detection
const floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: concreteMaterial,
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - Math.PI * 0.5)
world.addBody(floorBody)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.25

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

// Sphere Geo and Material
const sphere = new THREE.SphereBufferGeometry(1, 32, 32)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

// Function to create a sphere, both in threejs and cannonjs
const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(sphere, material)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // cannonjs body
    const shape = new CANNON.Sphere(1)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: plasticMaterial,
    })
    body.position.copy(position)    
    world.addBody(body)
    body.addEventListener('collide', playHitSound)
    // Add to objects to update
    objectsToUpdate.push({
        mesh,
        body,
    })
}

// Box Geo and Material
const box = new THREE.BoxBufferGeometry(1, 1, 1)

// Function to create a sphere, both in threejs and cannonjs
const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(box, material)
    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    scene.add(mesh)

    // cannonjs body
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: plasticMaterial,
    })
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)
    // Add to objects to update
    objectsToUpdate.push({
        mesh,
        body,
    })
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElaspedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElaspedTime
    oldElaspedTime = elapsedTime

    // Update physics world
    world.step(1 / 60, deltaTime, 3)

    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
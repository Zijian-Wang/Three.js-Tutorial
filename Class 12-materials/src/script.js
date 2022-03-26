import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColor = textureLoader.load('textures/door/color.jpg')
const doorAlpha = textureLoader.load('textures/door/alpha.jpg')
const doorHeight = textureLoader.load('textures/door/height.jpg')
const doorRoughness = textureLoader.load('textures/door/roughness.jpg')
const doorMetalness = textureLoader.load('textures/door/metalness.jpg')
const doorNormal = textureLoader.load('textures/door/normal.jpg')
const doorAO = textureLoader.load('textures/door/ambientOcclusion.jpg')

const matcap = textureLoader.load('textures/matcaps/8.png')
const gradientMat = textureLoader.load('textures/gradients/5.jpg')
gradientMat.minFilter = THREE.NearestFilter
gradientMat.magFilter = THREE.NearestFilter
gradientMat.generateMipmaps = false

const hdr = cubeTextureLoader.load([
    'textures/environmentMaps/1/px.jpg',
    'textures/environmentMaps/1/nx.jpg',
    'textures/environmentMaps/1/py.jpg',
    'textures/environmentMaps/1/ny.jpg',
    'textures/environmentMaps/1/pz.jpg',
    'textures/environmentMaps/1/nz.jpg'
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Materials
 */

// Door Material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColor 
// material.alphaMap = doorAlpha
// material.transparent = true
// material.aoMap = doorAO
// material.normalMap = doorNormal
// material.heightMap = doorHeight

//Normal Material
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

//Mat Cap
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcap

//Mesh Depth
// const material = new THREE.MeshDepthMaterial()


//Lambert Mat
// const material = new THREE.MeshLambertMaterial()

//Phong Mat
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color('red')

//Cartoon Mat
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientMat

//Standard Mat
const material = new THREE.MeshStandardMaterial()
material.map = doorColor
material.alphaMap = doorAlpha
material.transparent = true
material.aoMap = doorAO
material.normalMap = doorNormal
material.heightMap = doorHeight
material.metalnessMap = doorMetalness
material.roughnessMap = doorRoughness

material.displacementMap = doorHeight
material.displacementScale = 0.1
material.displacementBias = 0.5

material.envMap = hdr
material.envMapIntensity = 2

// gui.add(material, 'metalness')
//     .min(0)
//     .max(1)
//     .step(0.1)

// gui.add(material, 'roughness')
//     .min(0)
//     .max(1)
//     .step(0.1)

material.side = THREE.DoubleSide


/**
 * Meshes
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -2

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 32, 32),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry( 0.3, 0.18, 64, 128),
    material
)
torus.position.x = 2

//add another uv channel for AO map to work
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add( sphere, plane, torus )

/**
 * Lights
 */
const white = new THREE.Color('white')
const ambientLight = new THREE.AmbientLight(white, 0.5)
const pointLight = new THREE.PointLight(white, 1)
pointLight.position.x = 5
pointLight.position.y = 3

// scene.add(ambientLight, pointLight)

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
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 10
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

    //update objects
    const ySpeed = .2
    sphere.rotation.y = ySpeed * elapsedTime
    plane.rotation.y = ySpeed * elapsedTime
    torus.rotation.y = ySpeed * elapsedTime

    const xSpeed = 0.6
    sphere.rotation.x = xSpeed * elapsedTime
    plane.rotation.x = xSpeed * elapsedTime
    torus.rotation.x = xSpeed * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
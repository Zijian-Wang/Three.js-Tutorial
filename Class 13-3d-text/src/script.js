import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typefaceFont from '/static/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // console.log('font loaded')
        const textGeo = new TextGeometry(
            'Hellow Three.js!',
            {
                font: font,
                size: 0.5,
                height: 0.1,
                // curveSegments: number,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.01,
                // bevelOffset: number,
                bevelSegments: 3
            }
        )
        //Center text the hard way
        // textGeo.computeBoundingBox()
        // // console.log(textGeo.boundingBox)
        // textGeo.translate(
        //     - textGeo.boundingBox.max.x * 0.5,
        //     - textGeo.boundingBox.max.y * 0.5,
        //     - textGeo.boundingBox.max.z * 0.5
        // )
        textGeo.center()
        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        // fontMaterial.wireframe = true
        const text = new THREE.Mesh(textGeo, material)
        scene.add(text)

        const donutGeo = new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32)

        console.time('donuts')
        for(let i = 0; i < 1000; i++){
            
            const donut = new THREE.Mesh(donutGeo, material)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale) 

            scene.add(donut)
        }
        console.timeEnd('donuts')
    }
)

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
const axesHelper = new THREE.AxesHelper()

scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
//create scene
const scene = new THREE.Scene()

//red cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red'})
const cube = new THREE.Mesh( geometry, material)
scene.add( cube )

//define fixed size
const size = {
    width: 800,
    height: 600
}

//add a camera
const cam1 = new THREE.PerspectiveCamera( 36, size.width / size.height)
cam1.position.z = 5
scene.add( cam1 )


//create renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//set render size
renderer.setSize(size.width, size.height)

renderer.render(scene, cam1)

// Data for the Planets
const planetData = {
    mercury: { color: 0x999999, size: 0.8, temp: "167°C", moons: "0", desc: "The smallest planet in the Solar System, Mercury is closest to the Sun." },
    venus:   { color: 0xe6c229, size: 1.5, temp: "464°C", moons: "0", desc: "Spinning in the opposite direction to most planets, Venus is the hottest planet." },
    earth:   { color: 0x2e86de, size: 1.6, temp: "15°C", moons: "1", desc: "Our home planet is the only place we know of so far that’s inhabited by living things." },
    mars:    { color: 0xd35400, size: 1.2, temp: "-65°C", moons: "2", desc: "Mars is a dusty, cold, desert world with a very thin atmosphere." },
    jupiter: { color: 0xd38c5e, size: 3.5, temp: "-110°C", moons: "79", desc: "Jupiter is more than twice as massive than the other planets of our solar system combined." },
    saturn:  { color: 0xf4d03f, size: 3.0, temp: "-140°C", moons: "82", desc: "Adorned with a dazzling, complex system of icy rings." },
    uranus:  { color: 0x74b9ff, size: 2.2, temp: "-195°C", moons: "27", desc: "It rotates at a nearly 90-degree angle from the plane of its orbit." },
    neptune: { color: 0x341f97, size: 2.1, temp: "-200°C", moons: "14", desc: "Neptune is dark, cold, and whipped by supersonic winds." }
};

// --- THREE.JS SETUP --- //
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 1. Create the Planet (Sphere)
// We start with Earth
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshPhongMaterial({ 
    color: 0x2e86de,
    shininess: 20,
    specular: 0x111111 
});
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Position Planet to the right
planet.position.x = 2; 

// 2. Create Starfield Background
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const posArray = new Float32Array(starCount * 3);

for(let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50; // Spread stars
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 3. Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 3, 5);
scene.add(pointLight);

// Camera Position
camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Planet
    planet.rotation.y += 0.002;
    
    // Rotate Stars slowly
    stars.rotation.y -= 0.0005;

    renderer.render(scene, camera);
}
animate();

// --- UI INTERACTION --- //

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Search Functionality
const searchInput = document.getElementById('searchBar');
const searchBtn = document.getElementById('searchBtn');

// DOM Elements to update
const domName = document.getElementById('planet-name');
const domDesc = document.getElementById('planet-desc');
const domTemp = document.getElementById('planet-temp');
const domMoons = document.getElementById('planet-moons');

function updatePlanet(name) {
    const key = name.toLowerCase();
    const data = planetData[key];

    if (data) {
        // Update 3D Model
        planet.material.color.setHex(data.color);
        
        // Animate Scale (Simple transition)
        // We reset scale first to avoid accumulation issues
        planet.scale.set(1, 1, 1); 
        planet.scale.multiplyScalar(data.size);

        // Update Text
        domName.innerText = name.toUpperCase();
        domDesc.innerText = data.desc;
        domTemp.innerText = data.temp;
        domMoons.innerText = data.moons;
    } else {
        alert("Planet not found! Try 'Mars' or 'Jupiter'.");
    }
}

searchBtn.addEventListener('click', () => {
    updatePlanet(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updatePlanet(searchInput.value);
    }
});

// Click on Planet (Raycasting)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Raycast
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([planet]);

    if (intersects.length > 0) {
        // Spin faster on click
        planet.rotation.y += 0.5;
        alert(`You clicked on ${domName.innerText}!`);
    }
});

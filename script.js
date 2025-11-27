const planetData = {
    mercury: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/mercury.jpg', 
        size: 0.8, 
        temp: "167°C", moons: "0", dist: "57.9 M km", dia: "4,879 km",
        desc: "The smallest planet in the Solar System and the closest to the Sun." 
    },
    venus: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/venus.jpg', 
        size: 1.5, 
        temp: "464°C", moons: "0", dist: "108.2 M km", dia: "12,104 km",
        desc: "Spinning in the opposite direction to most planets, Venus is the hottest planet." 
    },
    earth: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/earth.jpg', 
        size: 1.6, 
        temp: "15°C", moons: "1", dist: "149.6 M km", dia: "12,742 km",
        desc: "Our home planet is the only place we know of so far that’s inhabited by living things." 
    },
    mars: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/mars.jpg', 
        size: 1.2, 
        temp: "-65°C", moons: "2", dist: "227.9 M km", dia: "6,779 km",
        desc: "Mars is a dusty, cold, desert world with a very thin atmosphere." 
    },
    jupiter: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/jupiter.jpg', 
        size: 3.2, 
        temp: "-110°C", moons: "79", dist: "778.5 M km", dia: "139,820 km",
        desc: "Jupiter is more than twice as massive than the other planets of our solar system combined." 
    },
    saturn: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/saturn.jpg', 
        size: 2.9, 
        temp: "-140°C", moons: "82", dist: "1.4 B km", dia: "116,460 km",
        desc: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our Solar System." 
    },
    uranus: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/uranus.jpg', 
        size: 2.2, 
        temp: "-195°C", moons: "27", dist: "2.9 B km", dia: "50,724 km",
        desc: "It rotates at a nearly 90-degree angle from the plane of its orbit." 
    },
    neptune: { 
        texture: 'https://raw.githubusercontent.com/yuruy/solar-system/master/images/neptune.jpg', 
        size: 2.1, 
        temp: "-200°C", moons: "14", dist: "4.5 B km", dia: "49,244 km",
        desc: "Neptune is dark, cold, and whipped by supersonic winds." 
    }
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.2);
sunLight.position.set(-50, 20, 50);
scene.add(sunLight);

const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshStandardMaterial({ 
    map: textureLoader.load(planetData.earth.texture) 
});
const planet = new THREE.Mesh(geometry, material);

planet.position.set(2.5, 0, 0); 
scene.add(planet);

const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const posArray = new Float32Array(starCount * 3);
for(let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff, transparent: true, opacity: 0.8 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.0015;
    stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
}
animate();

const domName = document.getElementById('planet-name');
const domDesc = document.getElementById('planet-desc');
const domTemp = document.getElementById('planet-temp');
const domMoons = document.getElementById('planet-moons');
const domDia = document.getElementById('planet-dia');
const domDist = document.getElementById('planet-dist');

function updatePlanet(name) {
    const key = name.toLowerCase().trim();
    const data = planetData[key];

    if (data) {
        textureLoader.load(data.texture, (texture) => {
            planet.material.map = texture;
            planet.material.needsUpdate = true;
        });

        gsap.to(planet.scale, { duration: 0.3, x: 0, y: 0, z: 0, onComplete: () => {
            gsap.to(planet.scale, { duration: 0.8, x: data.size, y: data.size, z: data.size, ease: "elastic.out(1, 0.5)" });
        }});

        gsap.fromTo(planet.rotation, {y: planet.rotation.y}, {duration: 1, y: planet.rotation.y + 2, ease: "power2.out"});

        domName.innerText = name.toUpperCase();
        domDesc.innerText = data.desc;
        domTemp.innerText = data.temp;
        domMoons.innerText = data.moons;
        domDia.innerText = data.dia;
        domDist.innerText = data.dist;

    } else {
        alert("Planet not found! Try 'Earth', 'Mars', or 'Saturn'.");
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    updatePlanet(document.getElementById('searchBar').value);
});

document.getElementById('searchBar').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') updatePlanet(e.target.value);
});

planet.scale.set(1.6, 1.6, 1.6);

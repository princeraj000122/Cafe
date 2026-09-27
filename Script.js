/* =========================
   THREE.JS 3D SCENE
========================= */

const container = document.getElementById("three-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1, 7);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

container.appendChild(renderer.domElement);


/* LIGHTING */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.2
);

scene.add(ambientLight);


const pointLight = new THREE.PointLight(
    0xc89b63,
    12,
    20
);

pointLight.position.set(3, 3, 4);

scene.add(pointLight);


/* COFFEE CUP */

const cupGeometry = new THREE.CylinderGeometry(
    1.15,
    1,
    1.4,
    64
);

const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b2420,
    roughness: .25,
    metalness: .15
});

const cup = new THREE.Mesh(
    cupGeometry,
    cupMaterial
);

cup.position.set(2,0,0);

scene.add(cup);


/* COFFEE */

const coffeeGeometry = new THREE.CylinderGeometry(
    .98,
    .98,
    .08,
    64
);

const coffeeMaterial = new THREE.MeshStandardMaterial({
    color: 0x160d08,
    roughness: .1
});

const coffee = new THREE.Mesh(
    coffeeGeometry,
    coffeeMaterial
);

coffee.position.set(2,.72,0);

scene.add(coffee);


/* CUP HANDLE */

const handleCurve = new THREE.TorusGeometry(
    .6,
    .12,
    20,
    50,
    Math.PI * 1.5
);

const handle = new THREE.Mesh(
    handleCurve,
    cupMaterial
);

handle.rotation.y = Math.PI / 2;

handle.position.set(
    3.05,
    0,
    0
);

scene.add(handle);


/* FLOATING PARTICLES */

const particleGeometry =
    new THREE.BufferGeometry();

const particleCount = 700;

const positions =
    new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++){

    positions[i] =
        (Math.random() - .5) * 15;

}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);

const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xc89b63,

        size: .025,

        transparent: true,

        opacity: .6

    });

const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* MOUSE MOVEMENT */

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
    "mousemove",
    event => {

        mouseX =
            (event.clientX / window.innerWidth - .5);

        mouseY =
            (event.clientY / window.innerHeight - .5);

    }
);


/* ANIMATION */

function animate(){

    requestAnimationFrame(animate);

    cup.rotation.y += .003;

    particles.rotation.y += .0005;

    cup.position.y =
        Math.sin(Date.now() * .001) * .08;

    camera.position.x +=
        (mouseX * .5 - camera.position.x) * .02;

    camera.position.y +=
        (-mouseY * .3 + 1 - camera.position.y) * .02;

    camera.lookAt(1,0,0);

    renderer.render(scene,camera);
}

animate();


/* RESPONSIVE */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================
   RESERVATION SYSTEM
========================= */

const reservationForm =
    document.getElementById(
        "reservationForm"
    );

reservationForm.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const phone =
            document.getElementById("phone").value;

        const date =
            document.getElementById("date").value;

        const time =
            document.getElementById("time").value;

        const guests =
            document.getElementById("guests").value;


        const reservation = {

            name,
            phone,
            date,
            time,
            guests,

            createdAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "lumoraReservation",
            JSON.stringify(reservation)
        );


        document.getElementById(
            "reservationMessage"
        ).innerHTML = `

        ✓ Reservation confirmed for
        <strong>${name}</strong><br>

        ${date} at ${time}<br>

        ${guests}

        `;

        reservationForm.reset();

    }
);


/* =========================
   CART
========================= */

let cart = [];

function addToCart(name, price){

    cart.push({
        name,
        price
    });

    updateCart();

    document
        .getElementById("cart")
        .classList.add("open");

}


function updateCart(){

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(
        (item,index) => {

            total += item.price;

            const div =
                document.createElement("div");

            div.className =
                "cart-item";

            div.innerHTML = `

                <span>
                    ${item.name}
                </span>

                <strong>
                    ₹${item.price}
                </strong>

            `;

            cartItems.appendChild(div);

        }
    );


    cartCount.textContent =
        cart.length;

    cartTotal.textContent =
        `₹${total}`;

}


function toggleCart(){

    document
        .getElementById("cart")
        .classList.toggle("open");

}


function checkout(){

    if(cart.length === 0){

        alert(
            "Your cart is empty."
        );

        return;

    }

    alert(
        "Demo order placed successfully! ☕"
    );

    cart = [];

    updateCart();

}


/* =========================
   NAVIGATION
========================= */

function scrollToReservation(){

    document
        .getElementById("reservation")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   DATE RESTRICTION
========================= */

const dateInput =
    document.getElementById("date");

const today =
    new Date().toISOString()
        .split("T")[0];

dateInput.min = today;

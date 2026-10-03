const productContainer =
    document.getElementById("product-container");

const connectionStatus =
    document.getElementById("connection-status");

const API_URL =
    "https://jsonplaceholder.typicode.com/posts";


if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")

            .then((registration) => {

                console.log(
                    "Service Worker registrado:",
                    registration.scope
                );

            })

            .catch((error) => {

                console.error(
                    "Error al registrar Service Worker:",
                    error
                );

            });

    });

}

async function loadProducts() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "No se pudieron obtener los productos."
            );

        }
        const products = await response.json();
        const catalog = products.slice(0, 12);
        renderProducts(catalog);
    }

    catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );


        productContainer.innerHTML = `
            <div class="error-message">

                <h3>Catálogo no disponible</h3>

                <p>
                    No fue posible cargar los productos.
                    Comprueba tu conexión a Internet.
                </p>

            </div>
        `;

    }

}


function renderProducts(products) {

    productContainer.innerHTML = "";


    products.forEach((product) => {

        const card =
            document.createElement("article");


        card.classList.add("product-card");


        card.innerHTML = `
            <h3>
                Producto ${product.id}
            </h3>

            <p>
                <strong>
                    ${product.title}
                </strong>
            </p>

            <p>
                ${product.body}
            </p>
        `;


        productContainer.appendChild(card);

    });

}

function updateConnectionStatus() {

    if (navigator.onLine) {

        connectionStatus.textContent =
            "En línea";

        connectionStatus.classList.remove(
            "offline"
        );

        connectionStatus.classList.add(
            "online"
        );

    }

    else {

        connectionStatus.textContent =
            "Sin conexión";

        connectionStatus.classList.remove(
            "online"
        );

        connectionStatus.classList.add(
            "offline"
        );

    }

}

window.addEventListener(
    "online",
    updateConnectionStatus
);


window.addEventListener(
    "offline",
    updateConnectionStatus
);

updateConnectionStatus();

loadProducts();
// Zet hier je API-keys
const ALIEXPRESS_API_KEY = "JOUW_ALIEXPRESS_API_KEY";
const STRIPE_PUBLIC_KEY = "JOUW_STRIPE_PUBLIC_KEY";

// Stripe initialiseren
const stripe = Stripe(STRIPE_PUBLIC_KEY);

// Producten ophalen van AliExpress API
async function fetchProducts() {
    try {
        const res = await fetch(`https://api-sandbox.aliexpress.com/items?apikey=${ALIEXPRESS_API_KEY}`);
        const data = await res.json();
        displayProducts(data.items || []);
    } catch (error) {
        console.error("Fout bij ophalen producten:", error);
    }
}

function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product";
        card.innerHTML = `
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Prijs: €${product.price}</p>
            <button onclick="buyProduct('${product.id}')">Koop nu</button>
        `;
        container.appendChild(card);
    });
}

// Stripe betaalproces starten
function buyProduct(productId) {
    stripe.redirectToCheckout({
        lineItems: [{ price: productId, quantity: 1 }],
        mode: 'payment',
        successUrl: window.location.origin + '/success.html',
        cancelUrl: window.location.origin + '/cancel.html',
    }).then(function (result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
}

// Laden bij start
fetchProducts();

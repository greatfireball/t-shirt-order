// Produktdaten mit Preisen und Bildern
const products = {
    tshirt: {
        basePrice: 15.00,
        colors: {
            Weiß: 0,
            Schwarz: 2,
            Blau: 1,
            Rot: 1.5,
        },
        sizes: {
            S: 0,
            M: 0,
            L: 1,
            XL: 1.5,
        },
        image: "https://via.placeholder.com/150?text=T-Shirt",
    },
    pullover: {
        basePrice: 25.00,
        colors: {
            Weiß: 0,
            Grau: 2,
            Blau: 3,
            Rot: 3.5,
        },
        sizes: {
            S: 0,
            M: 0,
            L: 2,
            XL: 3,
        },
        image: "https://via.placeholder.com/150?text=Pullover",
    },
    cap: {
        basePrice: 10.00,
        colors: {
            Schwarz: 0,
            Weiß: 0,
            Blau: 1,
        },
        image: "https://via.placeholder.com/150?text=Mütze",
    },
};

// Referenzen auf DOM-Elemente
const productType = document.getElementById("productType");
const colorSelect = document.getElementById("color");
const sizeSelect = document.getElementById("size");
const nameInput = document.getElementById("nameInput");
const nameSection = document.getElementById("nameSection");
const sizeSection = document.getElementById("sizeSection");
const productImage = document.getElementById("productImage");
const basePriceDisplay = document.getElementById("basePrice");
const cart = document.getElementById("cart");
const totalPriceDisplay = document.getElementById("totalPrice");
const addToCartButton = document.getElementById("addToCart");
const finalizeOrderButton = document.getElementById("finalizeOrder");
const paymentInfo = document.getElementById("paymentInfo");
const qrCodeCanvas = document.getElementById("qrCode");

// Warenkorb-Logik
let cartItems = [];
let totalPrice = 0;

// Produkt- und Farbwechsel
function updateProductDetails() {
    const selectedProduct = productType.value;
    const productData = products[selectedProduct];

    // Setze Basispreis
    basePriceDisplay.textContent = productData.basePrice.toFixed(2);

    // Aktualisiere Bild
    productImage.src = productData.image;
    productImage.classList.remove("hidden");

    // Aktualisiere Farben
    colorSelect.innerHTML = "";
    Object.keys(productData.colors).forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = `${color} (+${productData.colors[color].toFixed(2)} €)`;
        colorSelect.appendChild(option);
    });

    // Aktualisiere Größen oder Name
    if (selectedProduct === "cap") {
        sizeSection.classList.add("hidden");
        nameSection.classList.remove("hidden");
    } else {
        sizeSection.classList.remove("hidden");
        nameSection.classList.add("hidden");

        sizeSelect.innerHTML = "";
        Object.keys(productData.sizes).forEach((size) => {
            const option = document.createElement("option");
            option.value = size;
            option.textContent = `${size} (+${productData.sizes[size].toFixed(2)} €)`;
            sizeSelect.appendChild(option);
        });
    }
}

// Warenkorb aktualisieren
function updateCart() {
    cart.innerHTML = "";
    cartItems.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">${item.product}</td>
            <td class="border border-gray-300 px-4 py-2">${item.options}</td>
            <td class="border border-gray-300 px-4 py-2">${item.quantity}</td>
            <td class="border border-gray-300 px-4 py-2">${item.price.toFixed(2)} €</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
                <button class="text-red-600" onclick="removeFromCart(${index})">Entfernen</button>
            </td>
        `;
        cart.appendChild(row);
    });

    totalPriceDisplay.textContent = totalPrice.toFixed(2);
}

// Artikel zum Warenkorb hinzufügen
function addToCart() {
    const selectedProduct = productType.value;
    const productData = products[selectedProduct];

    const color = colorSelect.value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    let options = `Farbe: ${color}`;
    let price = productData.basePrice + productData.colors[color];

    if (selectedProduct === "cap") {
        const name = nameInput.value.trim();
        if (name) {
            options += `, Name: ${name}`;
        }
    } else {
        const size = sizeSelect.value;
        options += `, Größe: ${size}`;
        price += productData.sizes[size];
    }

    price *= quantity;

    cartItems.push({ product: selectedProduct, options, quantity, price });
    totalPrice += price;

    updateCart();
}

// Artikel aus dem Warenkorb entfernen
function removeFromCart(index) {
    totalPrice -= cartItems[index].price;
    cartItems.splice(index, 1);
    updateCart();
}

// Bestellung abschließen
function finalizeOrder() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || (!email && !phone)) {
        alert("Bitte füllen Sie alle notwendigen Felder aus.");
        return;
    }

    paymentInfo.classList.remove("hidden");

    // QR-Code generieren
    const qrCodeUrl = `https://www.paypal.me/username/${totalPrice.toFixed(2)}`;
    QRCode.toCanvas(qrCodeCanvas, qrCodeUrl, (error) => {
        if (error) console.error(error);
    });
}

// Event-Listener
productType.addEventListener("change", updateProductDetails);
addToCartButton.addEventListener("click", addToCart);
finalizeOrderButton.addEventListener("click", finalizeOrder);

// Initiale Details laden
updateProductDetails();

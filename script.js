// Produktdaten mit Preisen und Bildern
const products = {
    tshirt: {
        basePrice: 13.00,
        colors: {
            "Rot (Aufdruck schwarz)": 0,
            "Dunkelblau (Aufdruck schwarz)": 0,
            "Dunkelblau (Aufdruck weiß)": 0,
            "Grün (Aufdruck schwarz)": 0,
            "Pink (Aufdruck schwarz)": 0,
            "Neongelb (Aufdruck schwarz)": 0,
        },
        sizes: {
            "122/128": 0,
            "134/146": 0,
            "152/158": 0,
            "Sonstiges": 0,
        },
        image: "tshirt.jpeg",
    },
    pullover: {
        basePrice: 23.00,
        colors: {
            "Rot (Aufdruck schwarz)": 0,
            "Dunkelblau (Aufdruck schwarz)": 0,
            "Dunkelblau (Aufdruck weiß)": 0,
            "Grün (Aufdruck schwarz)": 0,
            "Pink (Aufdruck schwarz)": 0,
            "Neongelb (Aufdruck schwarz)": 0,
        },
        sizes: {
            "122/128": 0,
            "134/146": 0,
            "152/158": 0,
            "Sonstiges": 0,
        },
        image: "pullover.jpeg",
    },
    cap: {
        basePrice: 10.00,
        colors: {
            Schwarz: 0,
            Grau: 0,
            Blau: 0,
        },
        namePrice: 3.50, // Aufpreis für Name
        image: "muetze.jpeg",
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
            price += productData.namePrice; // Name-Aufpreis hinzufügen
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

// Bestellung per E-Mail senden
function sendEmail() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || (!email && !phone)) {
        alert("Bitte füllen Sie alle notwendigen Felder aus.");
        return;
    }

    if (cartItems.length === 0) {
        alert("Ihr Warenkorb ist leer.");
        return;
    }

    // Betreff und Empfänger
    const to = "elternbeirat@foersterfrank.de";
    const subject = encodeURIComponent("Neue Bestellung");
    const cc = email ? `?cc=${encodeURIComponent(email)}` : "";

    // Nachrichtentext
    let body = `Neue Bestellung von ${name}:\n\n`;

    if (email) body += `E-Mail: ${email}\n`;
    if (phone) body += `Telefon: ${phone}\n\n`;

    body += "Warenkorb:\n";
    cartItems.forEach((item, index) => {
        body += `${index + 1}. ${item.product} (${item.options}) - ${item.quantity} Stück - ${item.price.toFixed(2)} €\n`;
    });
    body += `\nGesamtkosten: ${totalPrice.toFixed(2)} €\n\nVielen Dank für Ihre Bestellung!`;

    // mailto-Link generieren
    const mailtoLink = `mailto:${to}${cc}&subject=${subject}&body=${encodeURIComponent(body)}`;

    // Link öffnen
    window.location.href = mailtoLink;
}

// Aktualisierung des aktuellen Preises basierend auf der Auswahl
function updateCurrentPrice() {
    const selectedProduct = productType.value;
    const productData = products[selectedProduct];

    let currentPrice = productData.basePrice;

    // Farbpreis hinzufügen
    const color = colorSelect.value;
    if (productData.colors[color]) {
        currentPrice += productData.colors[color];
    }

    // Größenpreis hinzufügen (wenn nicht Mütze)
    if (selectedProduct !== "cap") {
        const size = sizeSelect.value;
        if (productData.sizes[size]) {
            currentPrice += productData.sizes[size];
        }
    }

    // Aufpreis für Name (nur Mütze)
    if (selectedProduct === "cap") {
        const name = nameInput.value.trim();
        if (name) {
            currentPrice += productData.namePrice;
        }
    }

    // Menge berücksichtigen
    const quantity = parseInt(document.getElementById("quantity").value, 10) || 1;
    currentPrice *= quantity;

    // Aktuellen Preis anzeigen
    document.getElementById("currentPrice").textContent = currentPrice.toFixed(2);
}

// Event-Listener für dynamische Preisaktualisierung
productType.addEventListener("change", () => {
    updateProductDetails();
    updateCurrentPrice();
});

colorSelect.addEventListener("change", updateCurrentPrice);
sizeSelect.addEventListener("change", updateCurrentPrice);
nameInput.addEventListener("input", updateCurrentPrice);
document.getElementById("quantity").addEventListener("input", updateCurrentPrice);

// Initialen Preis laden
updateCurrentPrice();

// Event-Listener hinzufügen
document.getElementById("sendEmail").addEventListener("click", sendEmail);


// Event-Listener
productType.addEventListener("change", updateProductDetails);
addToCartButton.addEventListener("click", addToCart);
finalizeOrderButton.addEventListener("click", finalizeOrder);

// Initiale Details laden
updateProductDetails();


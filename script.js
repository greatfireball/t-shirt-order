const productData = {
    tshirt: { colors: ["Rot", "Blau", "Grün"], sizes: ["S", "M", "L", "XL"], price: 15 },
    pullover: { colors: ["Schwarz", "Grau", "Weiß"], sizes: ["M", "L", "XL"], price: 30 },
    cap: { colors: ["Schwarz", "Weiß"], sizes: ["One Size"], price: 10 },
};

const cart = [];
const productType = document.getElementById("productType");
const colorSelect = document.getElementById("color");
const sizeSelect = document.getElementById("size");
const quantityInput = document.getElementById("quantity");
const cartTableBody = document.querySelector("#cart tbody");
const totalPriceElement = document.getElementById("totalPrice");

productType.addEventListener("change", updateOptions);
document.getElementById("addToCart").addEventListener("click", addToCart);
document.getElementById("finalizeOrder").addEventListener("click", finalizeOrder);

function updateOptions() {
    const type = productType.value;
    const { colors, sizes } = productData[type];

    colorSelect.innerHTML = colors.map(color => `<option value="${color}">${color}</option>`).join("");
    sizeSelect.innerHTML = sizes.map(size => `<option value="${size}">${size}</option>`).join("");
}

function addToCart() {
    const type = productType.value;
    const color = colorSelect.value;
    const size = sizeSelect.value;
    const quantity = parseInt(quantityInput.value, 10);
    const price = productData[type].price * quantity;

    cart.push({ type, color, size, quantity, price });
    updateCart();
}

function updateCart() {
    cartTableBody.innerHTML = cart.map((item, index) => `
        <tr>
            <td>${item.type}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} €</td>
            <td><button onclick="removeFromCart(${index})">Entfernen</button></td>
        </tr>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function finalizeOrder() {
    if (cart.length === 0) {
        alert("Ihr Warenkorb ist leer!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const paymentInfo = document.getElementById("paymentInfo");
    paymentInfo.style.display = "block";

    // Generate QR Code
    const qrCode = new QRCode(document.getElementById("qrCode"), {
        text: `https://paypal.me/yourusername/${total}`,
        width: 128,
        height: 128,
    });
}
updateOptions();

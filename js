const productContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const totalDisplay = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <strong>${item.title}</strong>
      Adet: <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
      <button data-remove="${item.id}">Sil</button><br>
      Fiyat: ${(item.price * item.quantity).toFixed(2)} ₺
    `;
    cartContainer.appendChild(div);
  });

  totalDisplay.textContent = total.toFixed(2);
  saveCart();
}

function addToCart(product) {
  const exists = cart.find(item => item.id === product.id);
  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

productContainer.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = +e.target.dataset.id;
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(product => {
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price
        });
      });
  }
});

cartContainer.addEventListener('input', e => {
  if (e.target.type === 'number') {
    const id = +e.target.dataset.id;
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = parseInt(e.target.value) || 1;
      updateCartUI();
    }
  }
});

cartContainer.addEventListener('click', e => {
  if (e.target.dataset.remove) {
    const id = +e.target.dataset.remove;
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }
});

function fetchProducts() {
  fetch('https://fakestoreapi.com/products?limit=6')
    .then(res => res.json())
    .then(data => {
      data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <p>${product.title}</p>
          <p><strong>${product.price.toFixed(2)} ₺</strong></p>
          <button data-id="${product.id}">Sepete Ekle</button>
        `;
        productContainer.appendChild(card);
      });
    });
}

fetchProducts();
updateCartUI();

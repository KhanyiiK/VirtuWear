// Get the cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to create a cart item element
function createCartItem(item) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-product-card');

  cartItem.innerHTML = `
    <div class="product-info">
      <img class="cart-img" src="${item.image}" alt="${item.name}">
      <div class="product-description">
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Size: ${item.size}</p>
      </div>
    </div>
    <div class="button-section">
      <div class="count-btn-container">
        <button class="counter-btn" data-id="${item.id}" data-action="decrement">-</button>
        <span>${item.quantity}</span>
        <button class="counter-btn" data-id="${item.id}" data-action="increment">+</button>
      </div>
      <div class="secondary-btn-section">
        <div class="delete-icon" data-id="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </div>
        <div class="wishlist-icon" data-id="${item.id}">
          <i class="far fa-heart"></i>
        </div>
      </div>
    </div>
  `;

  return cartItem;
}

// Populate the cart with items
const cartProductsContainer = document.querySelector('.cart-products-container');
cartItems.forEach(item => {
  const cartItem = createCartItem(item);
  cartProductsContainer.appendChild(cartItem);
});

// Calculate and update the summary
function updateSummary() {
  let subTotal = 0;
  let discount = 0;
  let couponDiscount = 0;
  let total = 0;
  let savings = 0;

  cartItems.forEach(item => {
    subTotal += item.price * item.quantity;
    discount += (item.originalPrice - item.price) * item.quantity;
    // Assuming coupon discount is applied per item
    couponDiscount += item.couponDiscount * item.quantity;
  });

  total = subTotal - discount - couponDiscount;
  savings = subTotal - total;

  document.querySelector('.sub-total').textContent = subTotal.toFixed(2);
  document.querySelector('.discount').textContent = discount.toFixed(2);
  document.querySelector('.coupon-discount').textContent = couponDiscount.toFixed(2);
  document.querySelector('.total').textContent = total.toFixed(2);
  document.querySelector('.savings').textContent = savings.toFixed(2);
}

updateSummary();

// Event listeners for quantity and delete buttons
const cartProductCards = document.querySelectorAll('.cart-product-card');
cartProductCards.forEach(card => {
  const decrementBtn = card.querySelector('.counter-btn[data-action="decrement"]');
  const incrementBtn = card.querySelector('.counter-btn[data-action="increment"]');
  const deleteIcon = card.querySelector('.delete-icon');

  decrementBtn.addEventListener('click', () => {
    const id = decrementBtn.dataset.id;
    const item = cartItems.find(i => i.id === id);
    if (item.quantity > 1) {
      item.quantity--;
      decrementBtn.nextElementSibling.textContent = item.quantity;
      updateSummary();
    }
  });

  incrementBtn.addEventListener('click', () => {
    const id = incrementBtn.dataset.id;
    const item = cartItems.find(i => i.id === id);
    item.quantity++;
    incrementBtn.previousElementSibling.textContent = item.quantity;
    updateSummary();
  });

  deleteIcon.addEventListener('click', () => {
    const id = deleteIcon.dataset.id;
    const index = cartItems.findIndex(i => i.id === id);
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    card.remove();
    updateSummary();
  });
});
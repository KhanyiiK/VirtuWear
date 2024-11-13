// shop.js
const products = [
    {
        id: 1,
        name: "YELLOW SUNDRESS",
        price: 1599,
        originalPrice: 1699,
        rating: 4.3,
        reviewCount: 109,
        category: "women",
        gender: "women",
        size: 6,
        image: "/api/placeholder/600/600",
        trending: true,
        description: "These suede espadrilles showcase a modern urban aesthetic with their premium materials, jute-wrapped sole, and a stylish design that effortlessly blends comfort and style."
    },
    {
        id: 2,
        name: "BROWN TRENCH COAT",
        price: 499,
        originalPrice: 599,
        rating: 4.6,
        reviewCount: 1094,
        category: "kid",
        gender: "kid",
        size: 8,
        image: "/api/placeholder/600/600",
        trending: true,
        description: "Classic brown trench coat with modern styling and comfortable fit."
    },
    {
        id: 3,
        name: "YELLOW HOODIE",
        price: 1199,
        originalPrice: 1299,
        rating: 4.9,
        reviewCount: 65,
        category: "women",
        gender: "women",
        size: 7,
        image: "/api/placeholder/600/600",
        description: "Cozy yellow hoodie perfect for casual wear."
    },
    {
        id: 4,
        name: "ZENITH ASCEND",
        price: 99,
        originalPrice: 159,
        rating: 3.5,
        reviewCount: 34,
        category: "women",
        gender: "women",
        size: 6,
        image: "/api/placeholder/600/600",
        description: "Contemporary design meets comfort in this versatile piece."
    }
];

// Save products to localStorage for access from product details page
localStorage.setItem('products', JSON.stringify(products));

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function generateStarRating(rating) {
    return `${rating.toFixed(1)}★`;
}

// Render functions
function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToRender.map(product => `
        <a href="productDetails.html?id=${product.id}" class="product-card" style="text-decoration: none; color: inherit;">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="rating">
                        <span class="rating-score">${generateStarRating(product.rating)}</span>
                        <span class="review-count">(${product.reviewCount} reviews)</span>
                    </div>
                </div>
                <div class="price-container">
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    <span class="current-price">${formatPrice(product.price)}</span>
                </div>
                <div class="product-meta">
                    <span class="gender">Gender: ${product.gender}</span>
                    ${product.trending ? '<span class="trending-tag">Trending</span>' : ''}
                </div>
            </div>
        </a>
    `).join('');
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});
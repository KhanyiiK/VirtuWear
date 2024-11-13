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
        image: "./IMG/Yellow_dress.jpg",
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
        image: "./IMG/Brown_coat.jpg",
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
        image: "./IMG/Yellow_hoodie.jpg",
        description: "Cozy yellow hoodie perfect for casual wear."
    },
];

// Save products to localStorage for access from product details page
localStorage.setItem('products', JSON.stringify(products));

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR'
    }).format(price);
}

function generateStarRating(rating) {
    return `${rating.toFixed(1)}★`;
}

function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToRender.map(product => `
        <a href="productDetails.html?id=${product.id}" class="product-card-link">
            <div class="product-card">
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
                    <div class="action-buttons">
                        <button class="add-to-cart">Add to Cart</button>
                        <button class="favorite">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

// Add event listener to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent link navigation
        const productId = e.target.dataset.id;
        addToCart(productId);
    });
});


// Filter functions and event listeners
let selectedPriceFilters = [];
let selectedRatingFilter = 0;
let selectedCategoryFilters = [];

// Filter functions and event listeners (continued)
function applyFilters() {
    const filteredProducts = products.filter(product => {
        // Filter by price
        if (selectedPriceFilters.length > 0) {
            const inPriceRange = selectedPriceFilters.some(filter => {
                switch (filter) {
                    case 'below200':
                        return product.price < 200;
                    case '201-999':
                        return product.price >= 201 && product.price <= 999;
                    case '1000-1999':
                        return product.price >= 1000 && product.price <= 1999;
                    case 'over2000':
                        return product.price >= 2000;
                    default:
                        return false;
                }
            });
            if (!inPriceRange) return false;
        }

        // Filter by rating
        if (selectedRatingFilter > 0 && product.rating < selectedRatingFilter) {
            return false;
        }

        // Filter by category
        if (selectedCategoryFilters.length > 0 && !selectedCategoryFilters.includes(product.category)) {
            return false;
        }

        return true;
    });

    renderProducts(filteredProducts);
}

// Add event listeners for filter controls
document.getElementById('resetFilters').addEventListener('click', () => {
    selectedPriceFilters = [];
    selectedRatingFilter = 0;
    selectedCategoryFilters = [];
    document.querySelectorAll('.filter-option input').forEach(input => {
        input.checked = false;
    });
    document.getElementById('ratingFilter').value = 0;
    document.getElementById('rating-value').textContent = '0 stars';
    applyFilters();
});

document.querySelectorAll('.filter-option input').forEach(input => {
    input.addEventListener('change', () => {
        if (input.name === 'priceFilter') {
            if (input.checked) {
                selectedPriceFilters.push(input.value);
            } else {
                selectedPriceFilters = selectedPriceFilters.filter(filter => filter !== input.value);
            }
        } else if (input.name === 'categoryFilter') {
            if (input.checked) {
                selectedCategoryFilters.push(input.value);
            } else {
                selectedCategoryFilters = selectedCategoryFilters.filter(filter => filter !== input.value);
            }
        }
        applyFilters();
    });
});

document.getElementById('ratingFilter').addEventListener('input', () => {
    const ratingValue = document.getElementById('ratingFilter').value;
    document.getElementById('rating-value').textContent = `${ratingValue} stars`;
    selectedRatingFilter = parseFloat(ratingValue);
    applyFilters();
});

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});
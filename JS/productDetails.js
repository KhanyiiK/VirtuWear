document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Get products data from localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found');
        window.location.href = 'shop.html';
        return;
    }

    // Define video sources for each product
    const videoSources = {
        1: "demo-videos/yellow-sundress-demo.mp4",  // Yellow Sundress video
        2: "demo-videos/brown-coat-demo.mp4",       // Brown Trench Coat video
        3: "demo-videos/yellow-hoodie-demo.mp4"     // Yellow Hoodie video
    };

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('video-modal');
    modalContainer.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="video-wrapper">
                <div class="loading-spinner">Loading...</div>
                <video controls width="100%">
                    <source src="${videoSources[productId]}" type="video/mp4">
                    Your browser does not support the video element.
                </video>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Add styles for the modal
    const styles = document.createElement('style');
    styles.textContent = `
        .video-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .video-modal.active {
            display: flex;
        }

        .modal-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            background: white;
            padding: 20px;
            border-radius: 8px;
            overflow: hidden;
        }

        .video-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .loading-spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 16px;
            z-index: 1;
            display: none;
        }

        .loading .loading-spinner {
            display: block;
        }

        .close-modal {
            position: absolute;
            right: -15px;
            top: -15px;
            width: 30px;
            height: 30px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 30px;
            padding: 0;
            z-index: 1001;
        }

        .close-modal:hover {
            background: #ff0000;
        }

        .modal-content video {
            border-radius: 4px;
            max-width: 100%;
            max-height: calc(90vh - 40px);
            width: auto;
            height: auto;
            object-fit: contain;
        }

        /* Add responsive styles for portrait videos */
        @media (orientation: portrait) {
            .modal-content {
                width: 85%;
                max-width: 500px;
            }
            
            .modal-content video {
                max-height: 70vh;
                width: auto;
            }
        }
    `;
    document.head.appendChild(styles);

    // Update product details function remains the same
    function updateProductDetails() {
        // Update product title
        document.querySelector('.product-details h1').textContent = product.name;
        
        // Update product image
        const productImage = document.querySelector('.product-image img');
        productImage.src = product.image;
        productImage.alt = product.name;

        // Update ratings
        document.querySelector('.stars').textContent = ` ${product.rating.toFixed(1)} `;
        document.querySelector('.reviews').textContent = `(${product.reviewCount}) reviews`;

        // Update pricing
        document.querySelector('.original-price').textContent = formatPrice(product.originalPrice);
        document.querySelector('.discounted-price').textContent = formatPrice(product.price);

        // Update description
        document.querySelector('.description').textContent = product.description;

        // Update product info
        document.querySelector('.product-info').innerHTML = `
            <strong>Gender:</strong> ${product.gender}
            <strong>Size:</strong> ${product.size}
        `;

        // Update tags
        const tagsContainer = document.querySelector('.tags');
        tagsContainer.innerHTML = product.trending ? 
            '<span class="tag trending">Trending</span>' : '';
    }

    // Utility function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ZAR'
        }).format(price);
    }

    // Update the product details
    updateProductDetails();

    // Cart and Wishlist State
    let isInCart = false;
    let isInWishlist = false;

    // Button Elements
    const tryOnBtn = document.querySelector('.button-group').children[0];
    const addToCartBtn = document.querySelector('.button-group').children[1];
    const wishlistBtn = document.querySelector('.button-group').children[2];

    // Style buttons
    tryOnBtn.classList.add('try-on-btn');
    addToCartBtn.classList.add('add-cart-btn');
    wishlistBtn.classList.add('wishlist-btn');

    // Try On Button Handler - Updated to show product-specific video
    tryOnBtn.addEventListener('click', function() {
        const videoWrapper = modalContainer.querySelector('.video-wrapper');
        const video = modalContainer.querySelector('video');
        
        // Show loading state
        videoWrapper.classList.add('loading');
        
        // Show modal
        modalContainer.classList.add('active');

        // Handle video loading
        video.addEventListener('loadeddata', function() {
            videoWrapper.classList.remove('loading');
            video.play();
        }, { once: true });

        // Handle video error
        video.addEventListener('error', function() {
            videoWrapper.classList.remove('loading');
            alert('Error loading the try-on demo video. Please try again later.');
        }, { once: true });
    });

    // Close modal handler
    const closeBtn = modalContainer.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modalContainer.classList.remove('active');
        const video = modalContainer.querySelector('video');
        video.pause();
        video.currentTime = 0;
    });

    // Close modal when clicking outside
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.classList.remove('active');
            const video = modalContainer.querySelector('video');
            video.pause();
            video.currentTime = 0;
        }
    });

    // Add to Cart Button Handler
    addToCartBtn.addEventListener('click', function() {
        isInCart = !isInCart;
        this.textContent = isInCart ? 'Go to Cart' : 'Add to Cart';
        
        if (isInCart) {
            this.style.backgroundColor = '#28a745';
        } else {
            this.style.backgroundColor = '#333';
        }
    });

    // Wishlist Button Handler
    wishlistBtn.addEventListener('click', function() {
        isInWishlist = !isInWishlist;
        this.textContent = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
        
        if (isInWishlist) {
            this.style.backgroundColor = '#ddd';
        } else {
            this.style.backgroundColor = '#e8e8e8';
        }
    });
});
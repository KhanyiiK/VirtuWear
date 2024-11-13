// SnapchatLensIntegration.js

const CAMERA_KIT_API_KEY = 'your_actual_api_key_here';
snapchatIntegration.registerLens(1, 'your-actual-lens-id-here');


class SnapchatLensIntegration {
    constructor() {
        this.lensIDs = new Map();
        this.cameraKit = null;
    }

    async initializeCameraKit(apiKey) {
        try {
            // Initialize CameraKit
            this.cameraKit = await bootstrapCameraKit({ apiToken: apiKey });
        } catch (error) {
            console.error('Error initializing CameraKit:', error);
        }
    }

    registerLens(productId, lensId) {
        this.lensIDs.set(productId, lensId);
    }

    async createLensExperience(productId) {
        const lensId = this.lensIDs.get(productId);
        if (!lensId) {
            throw new Error(`No lens registered for product ${productId}`);
        }

        try {
            // Create lens experience
            const session = await this.cameraKit.createSession();
            const canvas = document.getElementById('camera-canvas');
            const mirror = true;

            // Configure the experience
            await session.setLens(lensId);
            await session.setRenderSize(canvas.width, canvas.height);
            await session.setMirrorMode(mirror);

            // Start the camera
            await session.startCamera();

            return session;
        } catch (error) {
            console.error('Error creating lens experience:', error);
            throw error;
        }
    }

    createLensContainer() {
        const modalHTML = `
            <div class="lens-container">
                <div class="lens-content">
                    <canvas id="camera-canvas" width="640" height="480"></canvas>
                    <div class="lens-controls">
                        <button class="capture-btn">Take Photo</button>
                        <button class="switch-camera-btn">Switch Camera</button>
                        <button class="close-lens-btn">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .lens-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .lens-content {
                position: relative;
                max-width: 100%;
                max-height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #camera-canvas {
                max-width: 100%;
                max-height: 80vh;
                border-radius: 8px;
            }

            .lens-controls {
                margin-top: 1rem;
                display: flex;
                gap: 1rem;
            }

            .lens-controls button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                background: #333;
                color: white;
                font-size: 1rem;
            }

            .capture-btn {
                background: #28a745 !important;
            }

            .close-lens-btn {
                background: #dc3545 !important;
            }

            .lens-controls button:hover {
                opacity: 0.9;
            }
        `;

        document.head.appendChild(styles);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        return document.querySelector('.lens-container');
    }

    async initTryOnButton(productId, apiKey) {
        const tryOnBtn = document.querySelector('.try-on-btn');
        
        if (!tryOnBtn) {
            console.error('Try-on button not found');
            return;
        }

        // Initialize CameraKit once
        await this.initializeCameraKit(apiKey);

        tryOnBtn.addEventListener('click', async () => {
            try {
                // Create lens container
                const container = this.createLensContainer();
                const closeBtn = container.querySelector('.close-lens-btn');
                const captureBtn = container.querySelector('.capture-btn');
                const switchCameraBtn = container.querySelector('.switch-camera-btn');

                // Create lens experience
                const session = await this.createLensExperience(productId);

                // Handle capture
                captureBtn.addEventListener('click', async () => {
                    const canvas = document.getElementById('camera-canvas');
                    const image = canvas.toDataURL('image/jpeg');
                    
                    // You can handle the captured image here
                    // For example, save it or display it
                    const capturedImg = document.createElement('img');
                    capturedImg.src = image;
                    document.body.appendChild(capturedImg);
                });

                // Handle camera switch
                let frontCamera = true;
                switchCameraBtn.addEventListener('click', async () => {
                    frontCamera = !frontCamera;
                    await session.switchCamera();
                });

                // Handle close
                closeBtn.addEventListener('click', () => {
                    session.destroy();
                    container.remove();
                });

            } catch (error) {
                console.error('Error launching lens:', error);
                alert('Virtual try-on is currently unavailable. Please check your camera permissions.');
            }
        });
    }
}

// Initialize the integration
document.addEventListener('DOMContentLoaded', function() {
    const snapchatIntegration = new SnapchatLensIntegration();
    
    // Replace with your actual Camera Kit API key and lens IDs
    const CAMERA_KIT_API_KEY = 'your_api_key_here';
    
    // Register your lenses
    snapchatIntegration.registerLens(1, 'your-lens-id-for-product-1');
    snapchatIntegration.registerLens(2, 'your-lens-id-for-product-2');

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Initialize try-on button with API key
    snapchatIntegration.initTryOnButton(productId, CAMERA_KIT_API_KEY);
});
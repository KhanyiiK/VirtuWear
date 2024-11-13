// Add this JavaScript to make the carousel functional
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-arrow.right');
    const prevButton = document.querySelector('.carousel-arrow.left');
    
    let currentIndex = 0;
    
    // Move to next slide
    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlidePosition();
      }
    });
    
    // Move to previous slide
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlidePosition();
      }
    });
    
    function updateSlidePosition() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const offset = -currentIndex * (slideWidth + 24); // 24px is the gap
      track.style.transform = `translateX(${offset}px)`;
      
      // Update button states
      prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
      nextButton.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
    }
    
    // Initialize carousel
    updateSlidePosition();
  });
/* ==========================================================================
   ABOUT US PAGE - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Load Animations
    const heroContent = document.querySelector('.about-hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 150);
    }

    // 2. Parallax and Zoom Effects
    const heroBg = document.querySelector('.about-hero-bg');
    const zoomImages = document.querySelectorAll('.editorial-img-wrapper img, .editorial-panoramic-wrapper img, .founder-portrait-wrapper img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Hero Background Parallax
        if (heroBg) {
            heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.12}px)`;
        }

        // Image scroll zoom
        zoomImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top < viewHeight && rect.bottom > 0) {
                const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
                const scaleVal = 1 + (progress * 0.04); // Subtle scale zoom
                img.style.transform = `scale(${scaleVal})`;
            }
        });
    });
});

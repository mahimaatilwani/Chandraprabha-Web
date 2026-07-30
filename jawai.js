document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Fade-in on Hero Load
       ========================================================================== */
    const heroContent = document.querySelector('.jawai-hero-content, .safari-banner-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 150);
    }

    /* ==========================================================================
       2. Scroll Parallax & Zoom Effects
       ========================================================================== */
    const heroBg = document.querySelector('.jawai-hero-bg, .safari-banner-bg');
    const zoomImages = document.querySelectorAll('.essence-img-wrapper img, .perspective-img-wrapper img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Hero Background Parallax
        if (heroBg) {
            // Translate down slightly as user scrolls to create standard parallax depth
            heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
        }

        // Final CTA Background Parallax (Scroll-relative)
        const ctaBg = document.querySelector('.jawai-final-cta-bg');
        if (ctaBg) {
            const rect = ctaBg.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            if (rect.top < viewHeight && rect.bottom > 0) {
                const relativeScroll = viewHeight - rect.top;
                ctaBg.style.transform = `scale(1.05) translateY(${relativeScroll * 0.08}px)`;
            }
        }

        // Image scroll zoom for scroll-linked visual feedback
        zoomImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // If the image is inside the viewport
            if (rect.top < viewHeight && rect.bottom > 0) {
                const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
                const scaleVal = 1 + (progress * 0.05); // Subtle zoom scale up to 1.05
                img.style.transform = `scale(${scaleVal})`;
            }
        });
    });

    /* ==========================================================================
       3. Accordion (FAQ) Interactivity
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question-btn');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other open accordion items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle active state on current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });

});

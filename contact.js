/* ==========================================================================
   CONTACT US PAGE - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Load Animations
    const heroContent = document.querySelector('.contact-hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 150);
    }

    // 2. Parallax and Zoom Effects
    const heroBg = document.querySelector('.contact-hero-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Hero Background Parallax
        if (heroBg) {
            heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.12}px)`;
        }
    });

    // 3. Contact Form Submission
    const contactForm = document.getElementById('contact-inquiry-form');
    const successModal = document.getElementById('success-modal');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.contact-submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Inquiry...';

            // Simulate server request delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                contactForm.reset();

                // Show success modal
                if (successModal) {
                    successModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                } else {
                    alert('Thank you! Your inquiry has been sent successfully. Our guest relations team will contact you shortly.');
                }
            }, 1200);
        });
    }

    // 4. Modal Close Handlers (Local mapping for success modal close actions)
    if (successModal) {
        const closeButtons = successModal.querySelectorAll('.close-modal, .close-modal-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                successModal.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });

        // Close on clicking outside the container
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

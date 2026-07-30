document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Fade-in on Banner Load
       ========================================================================== */
    const bannerContent = document.querySelector('.safari-banner-content');
    if (bannerContent) {
        setTimeout(() => {
            bannerContent.classList.add('loaded');
        }, 150);
    }

    /* ==========================================================================
       2. Parallax and Zoom Scroll Effects
       ========================================================================== */
    const bannerBg = document.querySelector('.safari-banner-bg');
    const experienceImg = document.querySelector('.experience-image-wrapper img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Banner Parallax
        if (bannerBg) {
            bannerBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
        }

        // Section 2 Image scroll-zoom
        if (experienceImg) {
            const rect = experienceImg.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (rect.top < viewHeight && rect.bottom > 0) {
                // Calculate percentage of scroll within the viewport
                const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
                const scaleVal = 1 + (progress * 0.08); // Scale from 1 to 1.08
                experienceImg.style.transform = `scale(${scaleVal})`;
            }
        }
    });

    /* ==========================================================================
       3. Typographic Statistics Count-Up Animation
       ========================================================================== */
    const statValues = document.querySelectorAll('.stat-val');
    
    const animateStat = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function: easeOutQuad
            const easedProgress = progress * (2 - progress);
            const currentVal = Math.floor(easedProgress * target);
            
            element.textContent = currentVal + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target + suffix;
            }
        };

        window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && statValues.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        statValues.forEach(val => statsObserver.observe(val));
    } else {
        // Fallback if observer is not supported
        statValues.forEach(val => {
            val.textContent = val.getAttribute('data-target') + (val.getAttribute('data-suffix') || '');
        });
    }

    /* ==========================================================================
       4. Booking Modal Controls
       ========================================================================== */
    const triggerBtns = document.querySelectorAll('.trigger-safari-modal');
    const modal = document.querySelector('.safari-modal');
    const closeBtn = document.querySelector('.safari-modal-close');

    if (modal) {
        // Open Modal
        triggerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            });
        });

        // Close Modal via button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close Modal by clicking backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================================
       5. Booking Modal Form Submission Handling
       ========================================================================== */
    const bookingForm = document.getElementById('safari-redesign-booking-form');

    if (bookingForm) {
        // Set date constraint (min date = tomorrow)
        const dateInput = document.getElementById('safari-booking-date');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const yyyy = tomorrow.getFullYear();
            let mm = tomorrow.getMonth() + 1;
            let dd = tomorrow.getDate();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const minDateStr = `${yyyy}-${mm}-${dd}`;
            dateInput.min = minDateStr;
            dateInput.value = minDateStr;
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('.safari-submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Request...';

            // Simulate API request
            setTimeout(() => {
                // Reset submit state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Reset form fields
                bookingForm.reset();
                
                // Reset date to default tomorrow
                if (dateInput) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const yyyy = tomorrow.getFullYear();
                    let mm = tomorrow.getMonth() + 1;
                    let dd = tomorrow.getDate();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    dateInput.value = `${yyyy}-${mm}-${dd}`;
                }

                // Close reservation modal
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Leverage global success modal if it exists on page
                const globalModal = document.getElementById('success-modal');
                if (globalModal) {
                    globalModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                } else {
                    alert('Thank you! Your luxury safari booking inquiry has been submitted. Our reservation specialist will reach out to you within 2 hours.');
                }
            }, 1200);
        });
    }

});

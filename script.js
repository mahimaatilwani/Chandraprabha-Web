document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Sticky Header
       ========================================== */
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrolled > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger immediately on page load
    }

    /* ==========================================
       2. Mobile Navigation Menu
       ========================================== */
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });
        
        // Close menu on nav link click (mobile)
        const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    /* ==========================================
       3. Background Video Controls
       ========================================== */
    const heroVideo = document.getElementById('hero-video');
    const soundBtn = document.getElementById('video-sound-btn');
    const playBtn = document.getElementById('video-play-btn');

    if (heroVideo) {
        // Toggle Sound Mute/Unmute
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                heroVideo.muted = !heroVideo.muted;
                if (heroVideo.muted) {
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                    soundBtn.setAttribute('aria-label', 'Unmute Video');
                } else {
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                    soundBtn.setAttribute('aria-label', 'Mute Video');
                }
            });
        }

        // Toggle Play/Pause
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (heroVideo.paused) {
                    heroVideo.play();
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    playBtn.setAttribute('aria-label', 'Pause Video');
                } else {
                    heroVideo.pause();
                    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    playBtn.setAttribute('aria-label', 'Play Video');
                }
            });
        }
    }



    /* ==========================================
       5. Scroll Reveal Animations (Intersection Observer)
       ========================================== */
    const revealElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -20px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    // Append CSS transition states directly for animation support
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .fade-in, .fade-in-left, .fade-in-right {
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform, opacity;
        }
        .fade-in { transform: translateY(25px); }
        .fade-in-left { transform: translateX(-30px); }
        .fade-in-right { transform: translateX(30px); }
        
        .fade-in.revealed, .fade-in-left.revealed, .fade-in-right.revealed {
            opacity: 1;
            transform: translate(0, 0);
        }
    `;
    document.head.appendChild(styleSheet);

    /* ==========================================
       6. Active Navigation Link on Scroll
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    /* ==========================================
       7. Booking & Enquiry Form Setup & Submission
       ========================================== */
    const bookingForm = document.getElementById('resort-booking-form');
    const successModal = document.getElementById('success-modal');
    const closeModalElements = document.querySelectorAll('.close-modal, .close-modal-btn');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    const formatDateStr = (date) => {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return `${yyyy}-${mm}-${dd}`;
    };

    const setupDateInputs = () => {
        const checkinInput = document.getElementById('book-checkin');
        const checkoutInput = document.getElementById('book-checkout');

        if (checkinInput) {
            checkinInput.value = formatDateStr(tomorrow);
            checkinInput.min = formatDateStr(tomorrow);
        }

        if (checkoutInput) {
            checkoutInput.value = formatDateStr(dayAfter);
            checkoutInput.min = formatDateStr(tomorrow);
        }
    };

    setupDateInputs();

    const openModal = () => {
        if (successModal) {
            successModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (successModal) {
            successModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    closeModalElements.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkinVal = document.getElementById('book-checkin').value;
            const checkoutVal = document.getElementById('book-checkout').value;
            
            if (checkinVal && checkoutVal) {
                const checkin = new Date(checkinVal);
                const checkout = new Date(checkoutVal);
                
                if (checkout <= checkin) {
                    alert('Checkout date must be after checkin date.');
                    return;
                }
            }

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending Inquiry...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                bookingForm.reset();
                setupDateInputs();
                openModal();
            }, 1200);
        });
    }

    /* ==========================================
       8. Safari Page Redesign Custom Scripts
       ========================================== */

    // 1. Fade-in on Banner Load
    const bannerContent = document.querySelector('.safari-banner-content');
    if (bannerContent) {
        setTimeout(() => {
            bannerContent.classList.add('loaded');
        }, 150);
    }

    // 2. Parallax and Zoom Scroll Effects
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
            const scrolledDiff = window.innerHeight - experienceImg.getBoundingClientRect().top;
            const totalH = window.innerHeight + experienceImg.clientHeight;
            if (scrolledDiff > 0 && experienceImg.getBoundingClientRect().bottom > 0) {
                const progress = scrolledDiff / totalH;
                const scaleVal = 1 + (progress * 0.08); // Scale up to 1.08
                experienceImg.style.transform = `scale(${scaleVal})`;
            }
        }
    });

    // 3. Typographic Statistics Count-Up Animation
    const statValues = document.querySelectorAll('.stat-val');
    
    const animateStat = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        statValues.forEach(val => statsObserver.observe(val));
    } else {
        statValues.forEach(val => {
            val.textContent = val.getAttribute('data-target') + (val.getAttribute('data-suffix') || '');
        });
    }

    // 4. Booking Modal Controls
    const triggerBtns = document.querySelectorAll('.trigger-safari-modal');
    const modal = document.querySelector('.safari-modal');
    const closeBtn = document.querySelector('.safari-modal-close');

    if (modal) {
        triggerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 5. Booking Modal Form Submission Handling
    const safariBookingForm = document.getElementById('safari-redesign-booking-form');

    if (safariBookingForm) {
        const dateInput = document.getElementById('safari-booking-date');
        if (dateInput) {
            const tomorrowSafari = new Date();
            tomorrowSafari.setDate(tomorrowSafari.getDate() + 1);
            
            const yyyy = tomorrowSafari.getFullYear();
            let mm = tomorrowSafari.getMonth() + 1;
            let dd = tomorrowSafari.getDate();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const minDateStr = `${yyyy}-${mm}-${dd}`;
            dateInput.min = minDateStr;
            dateInput.value = minDateStr;
        }

        safariBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = safariBookingForm.querySelector('.safari-submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Request...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                safariBookingForm.reset();
                
                if (dateInput) {
                    const tomorrowSafari = new Date();
                    tomorrowSafari.setDate(tomorrowSafari.getDate() + 1);
                    const yyyy = tomorrowSafari.getFullYear();
                    let mm = tomorrowSafari.getMonth() + 1;
                    let dd = tomorrowSafari.getDate();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    dateInput.value = `${yyyy}-${mm}-${dd}`;
                }

                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }

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




    /* ==========================================
       9. Our Hotels Page Custom Scripts
       ========================================== */
    const hotelsBannerContent = document.querySelector('.hotels-banner-content');
    if (hotelsBannerContent) {
        // 1. Fade-in on Banner Load
        setTimeout(() => {
            hotelsBannerContent.classList.add('loaded');
        }, 150);

        // 2. Parallax Scrolling for Banner & Final CTA
        const hotelsBannerBg = document.querySelector('.hotels-banner-bg');
        const hotelsCtaBg = document.querySelector('.hotels-cta-bg');

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            if (hotelsBannerBg) {
                hotelsBannerBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
            if (hotelsCtaBg) {
                const sectionTop = hotelsCtaBg.parentElement.offsetTop;
                const offset = scrolled - sectionTop;
                hotelsCtaBg.style.transform = `scale(1.05) translateY(${offset * 0.1}px)`;
            }
        });

        // 3. Interactive Recommendation Engine (Choose Your Journey)
        const journeyNavItems = document.querySelectorAll('.journey-nav-item');
        const journeyCard = document.querySelector('.journey-card');

        const propertyData = {
            'chandraprabha-resort': {
                name: 'Chandraprabha Resort',
                experience: 'Luxury Safari',
                desc: 'Experience the thrill of the wilderness in our signature luxury tents, designed to merge royal comfort with wild leopard country adventures.',
                rating: 5.0,
                stars: 5,
                image: 'https://www.lacabana.in/wp-content/uploads/2026/05/Tropical-Chalet5-main.webp',
                link: '#chandraprabha-resort'
            },
            'sky-jawai-resort': {
                name: 'Sky Jawai Resort',
                experience: 'Mountain Escape',
                desc: 'Perched on the majestic granite monoliths of Jawai, offering unparalleled bird-eye views of the wild terrain and private deck access.',
                rating: 4.9,
                stars: 5,
                image: 'https://www.lacabana.in/wp-content/uploads/2026/05/Royal-Sea-View-Suite1.webp',
                link: '#sky-jawai-resort'
            },
            'kumbhal-van-resort': {
                name: 'Kumbhal Van Resort',
                experience: 'Nature Escape',
                desc: 'Nestled in the lush valleys of the Aravalli range, a peaceful sanctuary featuring verdant private gardens and historic fort treks.',
                rating: 4.8,
                stars: 5,
                image: 'https://www.lacabana.in/wp-content/uploads/2026/05/Sea-Facing-Chalet2.webp',
                link: '#kumbhal-van-resort'
            },
            'signature-resort': {
                name: 'Signature Resort',
                experience: 'Royal Heritage',
                desc: 'Indulge in royal Rajputana heritage in Jaipur, featuring lavish pool complexes, grand lawns, and palace-style architecture.',
                rating: 5.0,
                stars: 5,
                image: 'https://www.lacabana.in/wp-content/uploads/2026/05/Presidential-Suite1.webp',
                link: '#signature-resort'
            },
            'hotel-meghdoot': {
                name: 'Hotel Meghdoot',
                experience: 'City Comfort',
                desc: 'A sophisticated urban escape in the City of Lakes, blending royal heritage with modern conveniences for an unforgettable retreat.',
                rating: 4.7,
                stars: 4,
                image: 'https://www.lacabana.in/wp-content/uploads/2026/05/Garden-facing-villa2.webp',
                link: '#hotel-meghdoot'
            }
        };

        journeyNavItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) return;

                const propertyKey = item.getAttribute('data-property');
                const data = propertyData[propertyKey];

                if (!data) return;

                // Remove active class from all nav items
                journeyNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Animate recommendation card transition
                if (journeyCard) {
                    journeyCard.style.opacity = '0';
                    journeyCard.style.transform = 'translateY(15px)';

                    setTimeout(() => {
                        // Update contents
                        const cardImg = journeyCard.querySelector('.journey-card-img-wrapper img');
                        const cardPropName = journeyCard.querySelector('.journey-card-property-name');
                        const cardExpName = journeyCard.querySelector('.journey-card-experience-name');
                        const cardDesc = journeyCard.querySelector('.journey-card-desc');
                        const cardRating = journeyCard.querySelector('.journey-card-rating');
                        const cardLink = journeyCard.querySelector('.journey-card-link');

                        if (cardImg) cardImg.src = data.image;
                        if (cardPropName) cardPropName.textContent = data.name;
                        if (cardExpName) cardExpName.textContent = data.experience;
                        if (cardDesc) cardDesc.textContent = data.desc;

                        if (cardRating) {
                            let starsHtml = '';
                            for (let i = 0; i < 5; i++) {
                                if (i < data.stars) {
                                    starsHtml += '<i class="fa-solid fa-star"></i>';
                                } else {
                                    starsHtml += '<i class="fa-regular fa-star"></i>';
                                }
                            }
                            starsHtml += `<span>${data.rating.toFixed(1)}</span>`;
                            cardRating.innerHTML = starsHtml;
                        }

                        if (cardLink) cardLink.setAttribute('href', data.link);

                        // Trigger fade/slide-in
                        journeyCard.style.opacity = '1';
                        journeyCard.style.transform = 'translateY(0)';
                    }, 300);
                }

                // If on mobile (horizontal scrollable chips), scroll active tab into view
                if (window.innerWidth <= 600) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        });

        // 4. Hotel Booking Modal Controllers
        const hotelsModal = document.getElementById('hotels-booking-modal');
        const openModalButtons = document.querySelectorAll('.open-hotels-modal');
        const closeModalButton = document.querySelector('.hotels-modal-close');
        const hotelsForm = document.getElementById('hotels-booking-form');
        const propertySelect = document.getElementById('hotels-book-property');

        const openHotelsModal = (event) => {
            event.preventDefault();
            
            // Auto-select property in modal dropdown if data-property is passed
            const clickedBtn = event.currentTarget;
            const targetProperty = clickedBtn.getAttribute('data-property-select');
            
            if (propertySelect && targetProperty) {
                propertySelect.value = targetProperty;
            }

            if (hotelsModal) {
                hotelsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        const closeHotelsModal = () => {
            if (hotelsModal) {
                hotelsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        openModalButtons.forEach(btn => btn.addEventListener('click', openHotelsModal));
        if (closeModalButton) closeModalButton.addEventListener('click', closeHotelsModal);

        if (hotelsModal) {
            hotelsModal.addEventListener('click', (e) => {
                if (e.target === hotelsModal) closeHotelsModal();
            });
        }

        // Setup dates in modal form
        const setupHotelsDateInputs = () => {
            const checkinInput = document.getElementById('hotels-book-checkin');
            const checkoutInput = document.getElementById('hotels-book-checkout');

            if (checkinInput && checkoutInput) {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dayAfter = new Date(today);
                dayAfter.setDate(dayAfter.getDate() + 3);

                const formatDateStr = (date) => {
                    const yyyy = date.getFullYear();
                    let mm = date.getMonth() + 1;
                    let dd = date.getDate();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    return `${yyyy}-${mm}-${dd}`;
                };

                checkinInput.value = formatDateStr(tomorrow);
                checkinInput.min = formatDateStr(tomorrow);
                checkoutInput.value = formatDateStr(dayAfter);
                checkoutInput.min = formatDateStr(tomorrow);

                checkinInput.addEventListener('change', () => {
                    const checkinDate = new Date(checkinInput.value);
                    const checkoutMin = new Date(checkinDate);
                    checkoutMin.setDate(checkoutMin.getDate() + 1);
                    checkoutInput.min = formatDateStr(checkoutMin);
                    if (new Date(checkoutInput.value) <= checkinDate) {
                        checkoutInput.value = formatDateStr(checkoutMin);
                    }
                });
            }
        };

        setupHotelsDateInputs();

        // Submit Hotels Booking
        if (hotelsForm) {
            hotelsForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitBtn = hotelsForm.querySelector('.hotels-submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting Booking...';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    hotelsForm.reset();
                    setupHotelsDateInputs();
                    closeHotelsModal();

                    const globalSuccessModal = document.getElementById('success-modal');
                    if (globalSuccessModal) {
                        globalSuccessModal.classList.add('open');
                        document.body.style.overflow = 'hidden';
                    } else {
                        alert('Thank you! Your boutique stay booking inquiry has been submitted. Our reservation specialist will reach out to you within 2 hours.');
                    }
                }, 1200);
            });
        }
    }

    // 5. Homepage Booking Modal Controllers
    const homeModal = document.getElementById('homepage-booking-modal');
    const openHomeModalButtons = document.querySelectorAll('.open-homepage-modal');
    const closeHomeModalButton = document.querySelector('.homepage-modal-close');
    const homeForm = document.getElementById('homepage-booking-form');

    if (homeModal) {
        const openHomeModal = () => {
            homeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeHomeModal = () => {
            homeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        openHomeModalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openHomeModal();
            });
        });

        if (closeHomeModalButton) {
            closeHomeModalButton.addEventListener('click', closeHomeModal);
        }

        homeModal.addEventListener('click', (e) => {
            if (e.target === homeModal) {
                closeHomeModal();
            }
        });

        // Date limits setup (Today + Tomorrow minimum check-in)
        const homeCheckin = document.getElementById('home-book-checkin');
        const homeCheckout = document.getElementById('home-book-checkout');

        if (homeCheckin && homeCheckout) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const formatDate = (date) => {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            };

            homeCheckin.min = formatDate(today);
            homeCheckout.min = formatDate(tomorrow);

            homeCheckin.addEventListener('change', () => {
                if (homeCheckin.value) {
                    const checkinDate = new Date(homeCheckin.value);
                    const nextDay = new Date(checkinDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    homeCheckout.min = formatDate(nextDay);
                    if (homeCheckout.value && new Date(homeCheckout.value) <= checkinDate) {
                        homeCheckout.value = formatDate(nextDay);
                    }
                }
            });
        }

        // Submit Form Handler
        if (homeForm) {
            homeForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitBtn = homeForm.querySelector('.home-submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting Request...';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    homeForm.reset();
                    closeHomeModal();

                    const globalSuccessModal = document.getElementById('success-modal');
                    if (globalSuccessModal) {
                        globalSuccessModal.classList.add('open');
                        document.body.style.overflow = 'hidden';
                    } else {
                        alert('Thank you! Your stay inquiry has been submitted successfully.');
                    }
                }, 1200);
            });
        }
    }

    /* ==========================================
       10. Premium Visual Gallery Controller
       ========================================== */
    const galleryMasonry = document.getElementById('gallery-masonry');
    if (galleryMasonry) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const loadMoreBtn = document.getElementById('gallery-load-more-btn');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-image');
        const lightboxCat = document.getElementById('lightbox-category');
        const lightboxCap = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const heroBg = document.querySelector('.gallery-hero-bg');

        let currentActiveFilter = 'all';
        let lightboxVisibleItems = [];
        let lightboxCurrentIndex = 0;

        // 1. Hero Parallax Scroll
        window.addEventListener('scroll', () => {
            if (heroBg) {
                const scrolled = window.scrollY;
                heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.12}px)`;
            }
        });

        // 2. Filter & Load More Controller Helper
        const updateGalleryVisibility = () => {
            let visibleCount = 0;
            let hiddenMatchingFilterCount = 0;

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const isMatch = (currentActiveFilter === 'all' || category === currentActiveFilter);
                const isLoadMoreHidden = item.classList.contains('load-more-hidden');

                if (isMatch) {
                    if (isLoadMoreHidden) {
                        hiddenMatchingFilterCount++;
                        item.classList.add('hidden-filter'); // Stay hidden because not loaded yet
                    } else {
                        item.classList.remove('hidden-filter');
                        visibleCount++;
                    }
                } else {
                    item.classList.add('hidden-filter');
                }
            });

            // Toggle Load More button based on remaining hidden items matching the active filter
            if (loadMoreBtn) {
                if (hiddenMatchingFilterCount > 0) {
                    loadMoreBtn.style.display = 'inline-block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
        };

        // Initialize visibility
        updateGalleryVisibility();

        // 3. Category Filter Action
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentActiveFilter = btn.getAttribute('data-filter');

                // Fade out masonry grid briefly, update visibility, fade back in
                galleryMasonry.style.opacity = '0.3';
                galleryMasonry.style.transition = 'opacity 0.25s ease';
                
                setTimeout(() => {
                    updateGalleryVisibility();
                    galleryMasonry.style.opacity = '1';
                }, 250);
            });
        });

        // 4. Load More Click Action
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'Loading...';

                setTimeout(() => {
                    let revealedThisTurn = 0;
                    const limit = 50; // Load 50 items at a time

                    for (let i = 0; i < galleryItems.length; i++) {
                        const item = galleryItems[i];
                        const category = item.getAttribute('data-category');
                        const isMatch = (currentActiveFilter === 'all' || category === currentActiveFilter);
                        const isLoadMoreHidden = item.classList.contains('load-more-hidden');

                        if (isMatch && isLoadMoreHidden && revealedThisTurn < limit) {
                            item.classList.remove('load-more-hidden');
                            item.classList.remove('hidden-filter');
                            
                            // Apply smooth entry animation
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.97)';
                            
                            (function(el) {
                                setTimeout(() => {
                                    el.style.opacity = '1';
                                    el.style.transform = 'scale(1)';
                                }, 50 * revealedThisTurn);
                            })(item);

                            revealedThisTurn++;
                        }
                    }

                    loadMoreBtn.disabled = false;
                    loadMoreBtn.textContent = 'Load More';
                    updateGalleryVisibility();
                }, 400);
            });
        }

        // 5. Lightbox Controller
        const getVisibleItems = () => {
            return Array.from(galleryItems).filter(item => {
                return !item.classList.contains('hidden-filter') && !item.classList.contains('load-more-hidden');
            });
        };

        const loadLightboxImage = (src, alt, cat, cap) => {
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.97)';
            
            // Set up onload BEFORE setting src to prevent missing load event for cached images
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            };

            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightboxCat.textContent = cat;
            lightboxCap.textContent = cap;

            // If image is already loaded from browser cache, manually trigger layout transition
            if (lightboxImg.complete) {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }
        };

        const openLightbox = (index) => {
            lightboxVisibleItems = getVisibleItems();
            lightboxCurrentIndex = index;
            
            const activeItem = lightboxVisibleItems[lightboxCurrentIndex];
            if (!activeItem) return;

            const img = activeItem.querySelector('img');
            const categoryText = activeItem.querySelector('.moment-category').textContent;
            const titleText = activeItem.querySelector('.moment-title').textContent;

            loadLightboxImage(img.src, img.alt, categoryText, titleText);

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        };

        const navigateLightbox = (direction) => {
            lightboxVisibleItems = getVisibleItems();
            if (lightboxVisibleItems.length <= 1) return;

            lightboxCurrentIndex = (lightboxCurrentIndex + direction + lightboxVisibleItems.length) % lightboxVisibleItems.length;
            
            const nextItem = lightboxVisibleItems[lightboxCurrentIndex];
            const img = nextItem.querySelector('img');
            const categoryText = nextItem.querySelector('.moment-category').textContent;
            const titleText = nextItem.querySelector('.moment-title').textContent;

            // Fade out, change source, fade in
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.97)';

            setTimeout(() => {
                loadLightboxImage(img.src, img.alt, categoryText, titleText);
            }, 180);
        };

        // Attach click triggers to items for Lightbox opening
        galleryMasonry.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            lightboxVisibleItems = getVisibleItems();
            const index = lightboxVisibleItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });

        // Close triggers
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        }

        // Navigation triggers
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        });

        // Mobile touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });

        const handleSwipeGesture = () => {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                // Swiped Left -> Next
                navigateLightbox(1);
            }
            if (touchEndX > touchStartX + threshold) {
                // Swiped Right -> Prev
                navigateLightbox(-1);
            }
        };
    }

});


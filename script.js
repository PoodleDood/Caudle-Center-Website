// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initFaqAccordion();
    initGalleryFilters();
    initComparisonSliders();
    initTestimonialSlider();
    initBackToTop();
    initAppointmentScheduler();
    initCostEstimator();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link highlighting based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations using GSAP and ScrollTrigger
function initScrollAnimations() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animate elements that come from left
        gsap.utils.toArray('.animate-from-left').forEach(element => {
            gsap.from(element, {
                x: -50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate elements that come from right
        gsap.utils.toArray('.animate-from-right').forEach(element => {
            gsap.from(element, {
                x: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Staggered animation for features
        const features = document.querySelectorAll('.feature');
        gsap.from(features, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.procedure-features',
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Staggered animation for FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        gsap.from(faqItems, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.faq-container',
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Toggle active class
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });

    // Open the first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// Gallery filters functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Before & After comparison sliders
function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const beforeImage = slider.querySelector('.before-image');
        
        if (handle && beforeImage) {
            let isDragging = false;
            
            // Mouse events
            handle.addEventListener('mousedown', startDrag);
            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', endDrag);
            
            // Touch events
            handle.addEventListener('touchstart', startDrag);
            window.addEventListener('touchmove', drag);
            window.addEventListener('touchend', endDrag);
            
            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
            }
            
            function drag(e) {
                if (!isDragging) return;
                
                let x;
                
                if (e.type === 'touchmove') {
                    x = e.touches[0].clientX;
                } else {
                    x = e.clientX;
                }
                
                // Get slider bounds
                const rect = slider.getBoundingClientRect();
                const sliderWidth = rect.width;
                
                // Calculate position percentage
                let position = (x - rect.left) / sliderWidth * 100;
                
                // Constrain position
                position = Math.max(0, Math.min(100, position));
                
                // Update handle and clip path
                handle.style.left = `${position}%`;
                beforeImage.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            }
            
            function endDrag() {
                isDragging = false;
            }
        }
    });
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    
    let currentSlide = 0;
    
    // Create dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        
        const dots = document.querySelectorAll('.dot');
        if (dots.length) {
            dots[currentSlide].classList.remove('active');
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
        slides[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        goToSlide(newIndex);
    }
    
    // Previous slide
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        goToSlide(newIndex);
    }
    
    // Add event listeners
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const sliderContainer = document.querySelector('.testimonial-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Initialize slider
    initSlider();
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Appointment Scheduler
function initAppointmentScheduler() {
    const scheduler = document.querySelector('.appointment-scheduler');
    if (!scheduler) return;
    
    const monthDisplay = scheduler.querySelector('.current-month');
    const daysContainer = scheduler.querySelector('.days');
    const slotsContainer = scheduler.querySelector('.slots');
    const prevMonthBtn = scheduler.querySelector('.prev');
    const nextMonthBtn = scheduler.querySelector('.next');
    const appointmentForm = scheduler.querySelector('.appointment-form');
    const confirmationSection = scheduler.querySelector('.appointment-confirmation');
    const selectedDateSpan = scheduler.querySelector('.selected-date');
    const selectedTimeSpan = scheduler.querySelector('.selected-time');
    const confirmBtn = scheduler.querySelector('.confirm-appointment');
    
    // Current date
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    
    // Initialize calendar
    renderCalendar(currentDate);
    
    // Previous month button
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }
    
    // Next month button
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Confirm appointment button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            appointmentForm.style.display = 'none';
            confirmationSection.style.display = 'block';
        });
    }
    
    // Render calendar
    function renderCalendar(date) {
        if (!monthDisplay || !daysContainer) return;
        
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = `${monthNames[month]} ${year}`;
        
        // Clear days container
        daysContainer.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            daysContainer.appendChild(emptyDay);
        }
        
        // Add days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;
            
            // Check if day is in the past
            const currentDay = new Date(year, month, i);
            if (currentDay < today && !(currentDay.getDate() === today.getDate() && 
                                       currentDay.getMonth() === today.getMonth() && 
                                       currentDay.getFullYear() === today.getFullYear())) {
                day.classList.add('disabled');
            } else {
                // Check if it's today
                if (currentDay.getDate() === today.getDate() && 
                    currentDay.getMonth() === today.getMonth() && 
                    currentDay.getFullYear() === today.getFullYear()) {
                    day.classList.add('today');
                }
                
                // Add click event
                day.addEventListener('click', () => {
                    if (!day.classList.contains('disabled')) {
                        // Remove selected class from all days
                        const days = daysContainer.querySelectorAll('.day');
                        days.forEach(d => d.classList.remove('selected'));
                        
                        // Add selected class to clicked day
                        day.classList.add('selected');
                        
                        // Update selected date
                        selectedDate = new Date(year, month, i);
                        
                        // Show available time slots
                        renderTimeSlots(selectedDate);
                    }
                });
            }
            
            daysContainer.appendChild(day);
        }
    }
    
    // Render time slots
    function renderTimeSlots(date) {
        if (!slotsContainer) return;
        
        // Clear slots container
        slotsContainer.innerHTML = '';
        
        // Generate time slots (9am to 5pm)
        const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
        
        // Randomly disable some slots to simulate availability
        const disabledSlots = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * timeSlots.length);
            disabledSlots.push(randomIndex);
        }
        
        // Add time slots
        timeSlots.forEach((time, index) => {
            const slot = document.createElement('div');
            slot.classList.add('time-slot');
            slot.textContent = time;
            
            // Check if slot is disabled
            if (disabledSlots.includes(index)) {
                slot.classList.add('disabled');
            } else {
                // Add click event
                slot.addEventListener('click', () => {
                    if (!slot.classList.contains('disabled')) {
                        // Remove selected class from all slots
                        const slots = slotsContainer.querySelectorAll('.time-slot');
                        slots.forEach(s => s.classList.remove('selected'));
                        
                        // Add selected class to clicked slot
                        slot.classList.add('selected');
                        
                        // Update selected time
                        selectedTime = time;
                        
                        // Show appointment form
                        if (appointmentForm && selectedDateSpan && selectedTimeSpan) {
                            // Format date
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                            const formattedDate = selectedDate.toLocaleDateString('en-US', options);
                            
                            // Update selected date and time
                            selectedDateSpan.textContent = formattedDate;
                            selectedTimeSpan.textContent = selectedTime;
                            
                            // Show form
                            appointmentForm.style.display = 'block';
                        }
                    }
                });
            }
            
            slotsContainer.appendChild(slot);
        });
    }
}

// Cost Estimator
function initCostEstimator() {
    const estimator = document.querySelector('.cost-estimator');
    if (!estimator) return;
    
    const form = estimator.querySelector('.estimator-form');
    const resultSection = estimator.querySelector('.estimate-result');
    const baseCostElement = estimator.querySelector('.base-cost');
    const areasCostElement = estimator.querySelector('.areas-cost');
    const volumeCostElement = estimator.querySelector('.volume-cost');
    const sessionsCostElement = estimator.querySelector('.sessions-cost');
    const addonsCostElement = estimator.querySelector('.addons-cost');
    const minCostElement = estimator.querySelector('.min-cost');
    const maxCostElement = estimator.querySelector('.max-cost');
    const totalRangeElement = estimator.querySelector('.total-range');
    const resetBtn = estimator.querySelector('.reset-estimate');
    const scheduleBtn = estimator.querySelector('.schedule-btn');
    const treatmentAreaSelect = estimator.querySelector('#treatment-area');
    const additionalAreasDiv = estimator.querySelector('#additional-areas');
    
    // Base costs for different procedures (min and max ranges)
    const baseCosts = {
        'traditional': { min: 1500, max: 2500 },
        'rf': { min: 2500, max: 3500 },
        'combined': { min: 3000, max: 4500 },
        'lipedema': { min: 3000, max: 5000 }
    };
    
    // Area costs
    const areaCosts = {
        'abdomen': { min: 0, max: 0 }, // Primary area included in base cost
        'thighs': { min: 0, max: 0 },  // Primary area included in base cost
        'arms': { min: 0, max: 0 },    // Primary area included in base cost
        'flanks': { min: 0, max: 0 },  // Primary area included in base cost
        'breast': { min: 0, max: 0 },  // Primary area included in base cost
        'neck': { min: 0, max: 0 },    // Primary area included in base cost
        'back': { min: 0, max: 0 },    // Primary area included in base cost
        'multiple': { min: 500, max: 1000 } // Additional cost for selecting multiple areas
    };
    
    // Additional area costs (when added to primary)
    const additionalAreaCost = { min: 500, max: 800 };
    
    // Volume adjustment costs
    const volumeCosts = {
        'small': { min: 0, max: 0 },       // No additional cost for small volume
        'medium': { min: 500, max: 1000 }, // Medium volume adjustment
        'large': { min: 1000, max: 2000 }  // Large volume adjustment
    };
    
    // Addon costs
    const addonCosts = {
        'skin-tightening': { min: 500, max: 800 },
        'post-op': { min: 300, max: 500 },
        'massage': { min: 200, max: 400 },
        'garment': { min: 150, max: 250 }
    };
    
    // Show/hide additional areas based on treatment area selection
    if (treatmentAreaSelect) {
        treatmentAreaSelect.addEventListener('change', function() {
            if (this.value === 'multiple' && additionalAreasDiv) {
                additionalAreasDiv.style.display = 'block';
            } else if (additionalAreasDiv) {
                additionalAreasDiv.style.display = 'none';
                // Uncheck all checkboxes when not using multiple areas
                const checkboxes = additionalAreasDiv.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
        });
    }
    
    // Submit form
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const procedureType = form.querySelector('#procedure-type').value;
            const treatmentArea = form.querySelector('#treatment-area').value;
            const fatVolume = form.querySelector('#fat-volume').value;
            const sessions = parseInt(form.querySelector('#sessions').value);
            const addonCheckboxes = form.querySelectorAll('input[name="addon"]:checked');
            const areaCheckboxes = form.querySelectorAll('input[name="area"]:checked');
            
            // Validate required fields
            if (!procedureType || !treatmentArea || !fatVolume) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Calculate base cost range
            const baseCostRange = baseCosts[procedureType] || { min: 0, max: 0 };
            
            // Calculate treatment area cost range
            let areasCostRange = { min: 0, max: 0 };
            
            // Add cost for primary area selection
            areasCostRange.min += areaCosts[treatmentArea]?.min || 0;
            areasCostRange.max += areaCosts[treatmentArea]?.max || 0;
            
            // Add costs for additional areas if multiple is selected
            if (treatmentArea === 'multiple') {
                // Count selected areas (subtract 1 for the first area which is included in base)
                const additionalAreasCount = Math.max(0, areaCheckboxes.length - 1);
                areasCostRange.min += additionalAreasCount * additionalAreaCost.min;
                areasCostRange.max += additionalAreasCount * additionalAreaCost.max;
            }
            
            // Calculate volume adjustment cost range
            const volumeCostRange = volumeCosts[fatVolume] || { min: 0, max: 0 };
            
            // Calculate sessions cost range (20% discount for additional sessions)
            const sessionsCostRange = { min: 0, max: 0 };
            if (sessions > 1) {
                sessionsCostRange.min = (sessions - 1) * (baseCostRange.min * 0.8);
                sessionsCostRange.max = (sessions - 1) * (baseCostRange.max * 0.8);
            }
            
            // Calculate addons cost range
            const addonsCostRange = { min: 0, max: 0 };
            addonCheckboxes.forEach(checkbox => {
                const addonType = checkbox.value;
                addonsCostRange.min += addonCosts[addonType]?.min || 0;
                addonsCostRange.max += addonCosts[addonType]?.max || 0;
            });
            
            // Calculate total cost range
            const totalMin = baseCostRange.min + areasCostRange.min + volumeCostRange.min + sessionsCostRange.min + addonsCostRange.min;
            const totalMax = baseCostRange.max + areasCostRange.max + volumeCostRange.max + sessionsCostRange.max + addonsCostRange.max;
            
            // Format currency
            const formatCurrency = (value) => {
                return '$' + value.toLocaleString();
            };
            
            // Update cost elements
            if (baseCostElement) baseCostElement.textContent = `${formatCurrency(baseCostRange.min)} - ${formatCurrency(baseCostRange.max)}`;
            if (areasCostElement) areasCostElement.textContent = `${formatCurrency(areasCostRange.min)} - ${formatCurrency(areasCostRange.max)}`;
            if (volumeCostElement) volumeCostElement.textContent = `${formatCurrency(volumeCostRange.min)} - ${formatCurrency(volumeCostRange.max)}`;
            if (sessionsCostElement) sessionsCostElement.textContent = `${formatCurrency(sessionsCostRange.min)} - ${formatCurrency(sessionsCostRange.max)}`;
            if (addonsCostElement) addonsCostElement.textContent = `${formatCurrency(addonsCostRange.min)} - ${formatCurrency(addonsCostRange.max)}`;
            
            // Update total range
            if (minCostElement) minCostElement.textContent = formatCurrency(totalMin);
            if (maxCostElement) maxCostElement.textContent = formatCurrency(totalMax);
            if (totalRangeElement) totalRangeElement.textContent = `${formatCurrency(totalMin)} - ${formatCurrency(totalMax)}`;
            
            // Show result section with animation
            if (resultSection) {
                resultSection.style.opacity = '0';
                resultSection.style.display = 'block';
                
                // Fade in animation
                setTimeout(() => {
                    resultSection.style.transition = 'opacity 0.5s ease';
                    resultSection.style.opacity = '1';
                    
                    // Scroll to results
                    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);
            }
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset form
            if (form) form.reset();
            
            // Hide additional areas section
            if (additionalAreasDiv) {
                additionalAreasDiv.style.display = 'none';
            }
            
            // Hide result section with animation
            if (resultSection) {
                resultSection.style.transition = 'opacity 0.5s ease';
                resultSection.style.opacity = '0';
                
                setTimeout(() => {
                    resultSection.style.display = 'none';
                }, 500);
            }
            
            // Scroll back to form
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    // Schedule button
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            // Scroll to contact form
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the contact form
                const contactForm = document.querySelector('.contact-form');
                if (contactForm) {
                    contactForm.classList.add('highlight');
                    setTimeout(() => {
                        contactForm.classList.remove('highlight');
                    }, 2000);
                }
            }
        });
    }
}

// Add custom gallery items dynamically
function addGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (galleryGrid) {
        // Sample gallery items data
        const galleryData = [
            {
                category: 'flanks',
                beforeImage: 'https://images.unsplash.com/photo-1559963629-38e8e4a8a99d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                afterImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
                caption: 'Flanks Liposuction with Skin Tightening'
            },
            {
                category: 'thighs',
                beforeImage: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80',
                afterImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                caption: 'Thigh Liposuction with RF Energy'
            },
            {
                category: 'arms',
                beforeImage: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                afterImage: 'https://images.unsplash.com/photo-1579722820903-01d3e776f85e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                caption: 'Arm Liposuction with Skin Tightening'
            },
            {
                category: 'lipedema',
                beforeImage: 'https://images.unsplash.com/photo-1559963629-38e8e4a8a99d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                afterImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
                caption: 'Lipedema Treatment with Specialized Liposuction'
            }
        ];
        
        // Create gallery items
        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.setAttribute('data-category', item.category);
            
            galleryItem.innerHTML = `
                <div class="comparison-slider">
                    <div class="before-image">
                        <img src="${item.beforeImage}" alt="Before ${item.category}">
                        <span class="label">Before</span>
                    </div>
                    <div class="after-image">
                        <img src="${item.afterImage}" alt="After ${item.category}">
                        <span class="label">After</span>
                    </div>
                    <div class="slider-handle"></div>
                </div>
                <div class="gallery-caption">${item.caption}</div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Reinitialize comparison sliders
        initComparisonSliders();
    }
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add gallery items
    addGalleryItems();
});

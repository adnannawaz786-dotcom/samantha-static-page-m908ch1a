// Main JavaScript for Samantha Static Page
// Handles interactive text features and dynamic content loading

class SamanthaPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
        this.setupTypewriter();
        this.setupScrollEffects();
        this.setupTextAnimations();
    }

    setupEventListeners() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }

    onDOMReady() {
        // Initialize all interactive elements
        this.initializeTextEffects();
        this.setupReadingProgress();
        this.setupTextHighlighting();
        this.fadeInElements();
    }

    async loadContent() {
        try {
            const response = await fetch('content/samantha-bio.txt');
            if (response.ok) {
                const content = await response.text();
                this.displayContent(content);
            } else {
                this.displayFallbackContent();
            }
        } catch (error) {
            console.warn('Could not load external content:', error);
            this.displayFallbackContent();
        }
    }

    displayContent(content) {
        const contentContainer = document.querySelector('.bio-content');
        if (contentContainer && content.trim()) {
            const paragraphs = content.split('\n\n').filter(p => p.trim());
            contentContainer.innerHTML = paragraphs
                .map(p => `<p class="fade-in-text">${p.trim()}</p>`)
                .join('');
            
            this.animateTextReveal();
        }
    }

    displayFallbackContent() {
        const contentContainer = document.querySelector('.bio-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <p class="fade-in-text">Welcome to Samantha's world of words and wonder.</p>
                <p class="fade-in-text">Here, every sentence tells a story, and every paragraph paints a picture with pure text.</p>
                <p class="fade-in-text">Experience the power of typography and the beauty of minimalist design.</p>
            `;
            this.animateTextReveal();
        }
    }

    setupTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 50;
            
            element.textContent = '';
            element.style.opacity = '1';
            
            this.typeText(element, text, speed);
        });
    }

    typeText(element, text, speed) {
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                element.classList.add('typing-complete');
            }
        }, speed);
    }

    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for different element types
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('text-highlight')) {
                        this.animateHighlight(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in-text, .slide-in-left, .slide-in-right, .counter, .text-highlight')
            .forEach(el => observer.observe(el));
    }

    setupTextAnimations() {
        // Text reveal animation on scroll
        const textElements = document.querySelectorAll('.reveal-text');
        
        textElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
        });
    }

    setupReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 16));
    }

    setupTextHighlighting() {
        const highlightElements = document.querySelectorAll('[data-highlight]');
        
        highlightElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('highlighted');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('highlighted');
            });
        });
    }

    animateTextReveal() {
        const textElements = document.querySelectorAll('.fade-in-text');
        
        textElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    animateHighlight(element) {
        element.style.setProperty('--highlight-width', '100%');
    }

    fadeInElements() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100);
        });
    }

    handleResize() {
        // Recalculate any size-dependent animations
        this.updateTextSizes();
    }

    handleScroll() {
        // Handle scroll-based animations
        this.updateParallaxText();
    }

    updateTextSizes() {
        // Responsive text size adjustments if needed
        const viewportWidth = window.innerWidth;
        const scaleFactor = Math.min(viewportWidth / 1200, 1);
        
        document.documentElement.style.setProperty('--text-scale', scaleFactor);
    }

    updateParallaxText() {
        const parallaxElements = document.querySelectorAll('.parallax-text');
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }

    initializeTextEffects() {
        // Glitch effect for special text
        const glitchElements = document.querySelectorAll('.glitch-text');
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.triggerGlitchEffect(element);
            });
        });

        // Floating text animation
        const floatingElements = document.querySelectorAll('.floating-text');
        floatingElements.forEach(element => {
            this.startFloatingAnimation(element);
        });
    }

    triggerGlitchEffect(element) {
        element.classList.add('glitching');
        setTimeout(() => {
            element.classList.remove('glitching');
        }, 500);
    }

    startFloatingAnimation(element) {
        const duration = 3000 + Math.random() * 2000;
        const delay = Math.random() * 1000;
        
        element.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite alternate`;
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application
const samanthaPage = new SamanthaPage();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SamanthaPage;
}
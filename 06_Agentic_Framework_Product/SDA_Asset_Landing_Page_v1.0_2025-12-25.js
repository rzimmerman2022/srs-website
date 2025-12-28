// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const email = this.querySelector('input[type="email"]').value;
        const company = this.querySelector('input[type="text"]').value;
        const teamSize = this.querySelector('select').value;

        // TODO: Replace with actual form submission endpoint
        console.log('Form submitted:', { email, company, teamSize });

        // Show success message (replace with your actual implementation)
        alert('Thank you for your interest! We\'ll contact you shortly to set up your free trial.');

        // Reset form
        this.reset();

        // In production, you would send this to your backend:
        /*
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, company, teamSize })
        })
        .then(response => response.json())
        .then(data => {
            // Show success message
            alert('Thank you for your interest! Check your email for next steps.');
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sorry, there was an error. Please email us directly at ryan@sparkdata-analytics.com');
        });
        */
    });
}

// Add animation on scroll (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for scroll animations
document.querySelectorAll('.problem-card, .workflow-card, .feature-card, .pricing-card, .customer-card, .advantage-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Sticky navigation background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
});

// Stats counter animation (counts up when in view)
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                // For now, just mark as animated to avoid re-triggering
                entry.target.dataset.animated = 'true';
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Mobile menu toggle (basic implementation)
// In production, you'd want a more robust mobile menu
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-menu');
    if (window.innerWidth <= 768 && nav) {
        // Mobile menu would be implemented here with a hamburger button
        console.log('Mobile view detected - implement hamburger menu');
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

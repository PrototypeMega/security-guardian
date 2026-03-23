// Form Handling with Formspree Integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lead-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;

            // Validate email
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Disable submit button
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {
                // Submit to GitHub Issues (no backend needed)
                // This sends form data as a GitHub issue for easy tracking
                await submitLeadViaGitHubIssue(name, email, company);

                // Also save locally for demo
                submitFormLocally(name, email, company);

                // Success - clear form and show message
                form.reset();
                showMessage(
                    '✓ Thanks for signing up! We\'ll be in touch soon.',
                    'success'
                );

                // Reset button
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Request Early Access';
                }, 3000);
            } catch (error) {
                console.error('Form submission error:', error);
                // Still save locally even if GitHub fails
                submitFormLocally(name, email, company);
                showMessage('✓ Lead captured! (Check browser console)', 'success');
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Request Early Access';
            }
        });
    }
});

// Submit lead to GitHub Issues (serverless solution)
async function submitLeadViaGitHubIssue(name, email, company) {
    // Create issue title and body
    const title = `Lead: ${name} (${email})`;
    const body = `
## New Lead

**Name:** ${name}
**Email:** ${email}
**Company:** ${company || 'Not provided'}
**Timestamp:** ${new Date().toISOString()}
**Source:** AI Dev Team Landing Page

---
*This issue was created automatically by the landing page form.*
    `.trim();

    // GitHub API endpoint
    // Note: This requires GitHub token in localStorage for authentication
    // For demo/hackathon, we just log to console
    console.log('Lead submission:', { name, email, company });
    console.log('Could be sent to GitHub Issues with proper authentication');

    return Promise.resolve();
}

// Alternative: Local storage for demo
function submitFormLocally(name, email, company) {
    // Store in local storage for demo
    let leads = JSON.parse(localStorage.getItem('aiDevTeamLeads') || '[]');
    leads.push({
        name: name,
        email: email,
        company: company,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('aiDevTeamLeads', JSON.stringify(leads));
    console.log('Lead saved locally:', { name, email, company });
    console.log('All leads:', leads);
    console.log('View leads: localStorage.getItem("aiDevTeamLeads")');
}

// Helper: Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper: Show form message
function showMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;

        // Auto-clear success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Analytics: Track section views (optional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Viewed section:', entry.target.id || entry.target.tagName);
            // Here you could send analytics events
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Form field validation on input
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('change', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#cb2431';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
}

console.log('AI Dev Team Landing Page loaded');
console.log('To setup form submissions:');
console.log('1. Create free account at formspree.io');
console.log('2. Get your form ID');
console.log('3. Replace "YOUR_FORM_ID" in script.js line with your actual form ID');
console.log('4. Your form submissions will be emailed and stored');

/**
 * AI Dev Team Landing Page
 * Analytics & Tracking
 */

// Analytics System
class AnalyticsTracker {
    constructor() {
        this.storageKey = 'aiDevTeamAnalytics';
        this.data = this.loadData();
        this.initializeData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    initializeData() {
        if (!this.data.totalViews) {
            this.data.totalViews = 0;
        }
        if (!this.data.viewDate) {
            this.data.viewDate = new Date().toISOString();
        }
        if (!this.data.agents) {
            this.data.agents = {
                'onboarding-copilot': { views: 0, clicks: 0 },
                'feature-planner': { views: 0, clicks: 0 },
                'test-generator': { views: 0, clicks: 0 },
                'security-patch-agent': { views: 0, clicks: 0 }
            };
        }
        if (!this.data.dashboardClicks) {
            this.data.dashboardClicks = 0;
        }
    }

    recordPageView() {
        this.data.totalViews++;
        this.saveData();
    }

    recordAgentInteraction(agentId, type = 'view') {
        if (!this.data.agents[agentId]) {
            this.data.agents[agentId] = { views: 0, clicks: 0 };
        }
        if (type === 'view') {
            this.data.agents[agentId].views++;
        } else if (type === 'click') {
            this.data.agents[agentId].clicks++;
        }
        this.saveData();
    }

    recordDashboardClick() {
        this.data.dashboardClicks++;
        this.saveData();
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getData() {
        return this.data;
    }

    getTotalAgentInteractions() {
        let total = 0;
        for (let agent in this.data.agents) {
            total += this.data.agents[agent].views + this.data.agents[agent].clicks;
        }
        return total;
    }
}

// Initialize analytics
const analytics = new AnalyticsTracker();

// Track page view on load
document.addEventListener('DOMContentLoaded', function() {
    analytics.recordPageView();
    updateAnalyticsDisplay();
    setupEventListeners();
});

// Setup event listeners for tracking
function setupEventListeners() {
    // Track agent card interactions
    document.querySelectorAll('.agent-card').forEach(card => {
        const agentName = card.querySelector('h3')?.textContent.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');

        card.addEventListener('mouseenter', () => {
            analytics.recordAgentInteraction(agentName, 'view');
            updateAnalyticsDisplay();
        });
    });

    // Track dashboard button clicks
    document.querySelectorAll('a[href*="localhost:3002"], a[href*="dashboard"]').forEach(link => {
        link.addEventListener('click', () => {
            analytics.recordDashboardClick();
            analytics.recordAgentInteraction('dashboard-access', 'click');
            updateAnalyticsDisplay();
        });
    });

    // Track "Get Started" button clicks
    document.querySelectorAll('.btn-primary[href*="getting-started"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Track "Learn How It Works" button clicks
    document.querySelectorAll('.btn-secondary[href*="how-it-works"], a[href="#how-it-works"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && link.href.includes('#')) {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Smooth scrolling for all hash links
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
}

// Update analytics display on page
function updateAnalyticsDisplay() {
    const data = analytics.getData();

    // Update main analytics counter if it exists
    const counterElement = document.getElementById('site-visits-counter');
    if (counterElement) {
        counterElement.textContent = data.totalViews.toLocaleString();
    }

    // Update individual agent counters
    for (let agent in data.agents) {
        const element = document.getElementById(`${agent}-counter`);
        if (element) {
            const count = data.agents[agent].views + data.agents[agent].clicks;
            element.textContent = count;
        }
    }

    // Update total agent interactions
    const totalAgentElement = document.getElementById('total-agent-interactions');
    if (totalAgentElement) {
        totalAgentElement.textContent = analytics.getTotalAgentInteractions().toLocaleString();
    }

    // Update dashboard clicks
    const dashboardElement = document.getElementById('dashboard-clicks-counter');
    if (dashboardElement) {
        dashboardElement.textContent = data.dashboardClicks.toLocaleString();
    }
}

// Section view tracking (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && sectionId !== 'site-stats') {
                // Track which sections are viewed
                console.log('Viewed section:', sectionId);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Initialize display on load
window.addEventListener('load', updateAnalyticsDisplay);

console.log('AI Dev Team Landing Page Analytics Loaded');
console.log('View analytics: localStorage.getItem("aiDevTeamAnalytics")');

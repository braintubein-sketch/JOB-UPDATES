// DOM Elements
const header = document.getElementById('header');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotification = document.getElementById('closeNotification');
const backToTop = document.getElementById('backToTop');
const jobsGrid = document.getElementById('jobsGrid');
const tabBtns = document.querySelectorAll('.tab-btn');

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

themeToggle?.addEventListener('click', toggleTheme);
initTheme();

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Notification Panel
notificationBtn?.addEventListener('click', () => {
    notificationPanel.classList.toggle('active');
});

closeNotification?.addEventListener('click', () => {
    notificationPanel.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!notificationPanel?.contains(e.target) && !notificationBtn?.contains(e.target)) {
        notificationPanel?.classList.remove('active');
    }
});

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    // Back to Top Button
    if (currentScroll > 500) {
        backToTop?.classList.add('visible');
    } else {
        backToTop?.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Animated Counter
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.hero-stats, .section-header, .job-card, .category-card, .update-card').forEach(el => {
    observer.observe(el);
});

// Render Job Cards
function renderJobs(jobs, container) {
    if (!container) return;

    container.innerHTML = jobs.map(job => `
        <div class="job-card" data-type="${job.type}">
            <div class="job-header">
                <span class="job-badge ${job.type}">${job.type === 'govt' ? 'Government' : 'Private'}</span>
                ${job.urgent ? '<span class="job-badge urgent">Urgent</span>' : ''}
            </div>
            <h3 class="job-title">${job.title}</h3>
            <div class="job-meta">
                <div class="job-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-meta-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${job.qualification}</span>
                </div>
                <div class="job-meta-item">
                    <i class="fas fa-users"></i>
                    <span>${job.vacancies} Vacancies</span>
                </div>
                ${job.salary ? `<div class="job-meta-item"><i class="fas fa-rupee-sign"></i><span>${job.salary}</span></div>` : ''}
            </div>
            <div class="job-footer">
                <div class="job-date">
                    <i class="far fa-calendar-alt"></i>
                    Last Date: <span>${job.lastDate}</span>
                </div>
                <div class="job-actions" style="display: flex; gap: 10px; align-items: center;">
                    <a href="job-details.html?id=${job.id}" class="job-apply" style="flex: 1;">Details</a>
                    <a href="${job.applyLink}" target="_blank" rel="noopener" class="direct-link-icon" title="Redirect to Official Site" style="background: var(--primary-light); color: var(--primary); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.3s;"><i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Tab Filtering
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.getAttribute('data-tab');
        let filteredJobs;

        if (tab === 'all') {
            filteredJobs = jobsData;
        } else if (tab === 'freshers') {
            filteredJobs = jobsData.filter(job =>
                job.qualification.toLowerCase().includes('graduate') ||
                job.qualification.toLowerCase().includes('b.tech')
            );
        } else {
            filteredJobs = jobsData.filter(job => job.type === tab);
        }

        renderJobs(filteredJobs, jobsGrid);
    });
});

// Render Update Lists
function renderUpdates(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.slice(0, 5).map(item => `
        <a href="job-details.html?id=${item.id || ''}&title=${encodeURIComponent(item.title)}&type=${containerId}&date=${item.date}&link=${encodeURIComponent(item.link)}" class="update-item-link">
            <li class="update-item">
                <i class="${item.icon}"></i>
                <span>${item.title}</span>
                <span class="date">${item.date}</span>
            </li>
        </a>
    `).join('');
}

// Render Full Updates Grid (for results, admit cards, exams pages)
function renderUpdatesFull(data, containerId, btnText = 'View Details') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="result-card glass-card">
            ${item.new ? '<div class="result-badge new">New</div>' : ''}
            <div class="result-icon"><i class="${item.icon}"></i></div>
            <h3>${item.title}</h3>
            <div class="result-meta"><span><i class="far fa-calendar-alt"></i> ${item.date}</span></div>
            <div class="result-links" style="display: flex; gap: 10px; margin-top: 15px;">
                <a href="job-details.html?id=${item.id || ''}&title=${encodeURIComponent(item.title)}&type=${containerId}&date=${item.date}&link=${encodeURIComponent(item.link || item.applyLink)}" class="btn btn-primary" style="flex: 1;">${btnText}</a>
                <a href="${item.link || item.applyLink}" target="_blank" rel="noopener" class="btn btn-outline" style="width: 48px; display: flex; align-items: center; justify-content: center;" title="Official Redirect"><i class="fas fa-external-link-alt"></i></a>
            </div>
        </div>
    `).join('');
}

// Filter Form Submission
const filterForm = document.getElementById('jobFilterForm');
filterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const qualification = document.getElementById('qualification').value;
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;

    let filteredJobs = jobsData;

    if (qualification) {
        filteredJobs = filteredJobs.filter(job =>
            job.qualification.toLowerCase().includes(qualification.toLowerCase())
        );
    }

    if (location) {
        filteredJobs = filteredJobs.filter(job =>
            job.location.toLowerCase().includes(location.toLowerCase()) ||
            job.location.toLowerCase().includes('all india')
        );
    }

    if (category) {
        if (category === 'govt' || category === 'private') {
            filteredJobs = filteredJobs.filter(job => job.type === category);
        }
    }

    renderJobs(filteredJobs, jobsGrid);

    // Scroll to jobs section
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Render initial jobs
    if (typeof jobsData !== 'undefined') {
        renderJobs(jobsData.slice(0, 6), jobsGrid);
    }

    // Render updates
    if (typeof examsData !== 'undefined') {
        renderUpdates(examsData, 'examsList');
    }
    if (typeof resultsData !== 'undefined') {
        renderUpdates(resultsData, 'resultsList');
    }
    if (typeof admitCardsData !== 'undefined') {
        renderUpdates(admitCardsData, 'admitList');
    }

    // Add page load animation
    document.body.classList.add('loaded');
});

// Add floating card animation delays
document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
        mobileMenuBtn?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

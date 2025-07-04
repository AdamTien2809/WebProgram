document.addEventListener('DOMContentLoaded', function() {
    // Get user data from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
    // Initialize UI elements
    initProfileData();
    initNavigation();
    animateCharts();
    
    // Profile Form Submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update user profile data
            const name = document.getElementById('profile-name').value;
            const job = document.getElementById('profile-job').value;
            const location = document.getElementById('profile-location').value;
            const bio = document.getElementById('profile-bio').value;
            
            // Update current user object
            currentUser.name = name || currentUser.name;
            currentUser.job = job || '';
            currentUser.location = location || '';
            currentUser.bio = bio || '';
            
            // Save to sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            initProfileData();
            
            // Show success message
            alert('Profile updated successfully!');
        });
    }
    
    // Logout functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user session
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }
    
    // Initialize profile data in UI
    function initProfileData() {
        // If no user is logged in, redirect to login page
        if (!currentUser.name || !currentUser.email) {
            window.location.href = 'index.html';
            return;
        }
        
        // Get first letter of name for profile icon
        const initial = currentUser.name.charAt(0).toUpperCase();
        
        // Set initials in profile icons
        const profileInitial = document.getElementById('profile-initial');
        const profilePageInitial = document.getElementById('profile-page-initial');
        
        if (profileInitial) profileInitial.textContent = initial;
        if (profilePageInitial) profilePageInitial.textContent = initial;
        
        // Set username in dropdown and profile page
        const userName = document.getElementById('user-name');
        const profilePageName = document.getElementById('profile-page-name');
        const profilePageEmail = document.getElementById('profile-page-email');
        
        if (userName) userName.textContent = currentUser.name;
        if (profilePageName) profilePageName.textContent = currentUser.name;
        if (profilePageEmail) profilePageEmail.textContent = currentUser.email;
        
        // Set profile form fields
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileJob = document.getElementById('profile-job');
        const profileLocation = document.getElementById('profile-location');
        const profileBio = document.getElementById('profile-bio');
        
        if (profileName) profileName.value = currentUser.name || '';
        if (profileEmail) profileEmail.value = currentUser.email || '';
        if (profileJob) profileJob.value = currentUser.job || '';
        if (profileLocation) profileLocation.value = currentUser.location || '';
        if (profileBio) profileBio.value = currentUser.bio || '';
    }
    
    // Handle navigation between sections
    function initNavigation() {
        const dashboardLink = document.getElementById('dashboard-link');
        const forumLink = document.getElementById('forum-link');
        const viewProfileLink = document.getElementById('view-profile');
        
        const dashboardContent = document.getElementById('dashboard-content');
        const forumContent = document.getElementById('forum-content');
        const profileContent = document.getElementById('profile-content');
        
        // Dashboard link
        if (dashboardLink && dashboardContent) {
            dashboardLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(dashboardContent);
                setActiveNavLink(dashboardLink);
            });
        }
        
        // Forum link
        if (forumLink && forumContent) {
            forumLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(forumContent);
                setActiveNavLink(forumLink);
            });
        }
        
        // Profile link
        if (viewProfileLink && profileContent) {
            viewProfileLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(profileContent);
                // No nav link to activate for profile
            });
        }
    }
    
    // Set active content section
    function setActiveSection(section) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');
    }
    
    // Set active navigation link
    function setActiveNavLink(link) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(n => n.classList.remove('active'));
        link.classList.add('active');
    }
    
    // Animate chart bars on load
    function animateCharts() {
        const bars = document.querySelectorAll('.chart-placeholder-bars .bar');
        
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
            }, index * 100);
        });
    }
});
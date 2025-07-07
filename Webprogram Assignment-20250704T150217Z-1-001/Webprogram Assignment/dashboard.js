document.addEventListener('DOMContentLoaded', function() {
    // Get user data from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
    // Check URL parameters for view
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    
    // Initialize UI elements
    initProfileData();
    initNavigation(viewParam);
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
    function initNavigation(viewParam) {
        const dashboardLink = document.getElementById('dashboard-link');
        const forumLink = document.getElementById('forum-link');
        const viewProfileLink = document.getElementById('view-profile');
        
        const dashboardContent = document.getElementById('dashboard-content');
        const forumContent = document.getElementById('forum-content');
        const profileContent = document.getElementById('profile-content');
        
        // Set initial view based on URL parameter
        if (viewParam === 'forum' && forumContent) {
            setActiveSection(forumContent);
            setActiveNavLink(forumLink);
        } else if (viewParam === 'profile' && profileContent) {
            setActiveSection(profileContent);
        } else if (dashboardContent) {
            setActiveSection(dashboardContent);
            setActiveNavLink(dashboardLink);
        }
        
        // Dashboard link
        if (dashboardLink && dashboardContent) {
            dashboardLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(dashboardContent);
                setActiveNavLink(dashboardLink);
                // Update URL without reloading page
                history.pushState(null, '', 'dashboard.html');
            });
        }
        
        // Forum link
        if (forumLink && forumContent) {
            forumLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(forumContent);
                setActiveNavLink(forumLink);
                // Update URL without reloading page
                history.pushState(null, '', 'dashboard.html?view=forum');
            });
        }
        
        // Profile link
        if (viewProfileLink && profileContent) {
            viewProfileLink.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveSection(profileContent);
                // Update URL without reloading page
                history.pushState(null, '', 'dashboard.html?view=profile');
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
    
    // Initialize forum data
    initForumData();
    
    // Initialize forum data
    function initForumData() {
        // Check if forum data already exists in localStorage
        if (!localStorage.getItem('forumThreads')) {
            // Initialize with default forum data
            const defaultThreads = [
                {
                    id: '1',
                    title: 'Data Visualization Best Practices',
                    badge: {
                        text: 'Hot',
                        class: 'hot'
                    },
                    author: {
                        name: 'John Doe',
                        email: 'john@example.com'
                    },
                    date: '2 hours ago',
                    preview: "I've been working on improving our dashboard visualizations and wanted to share some insights on best practices...",
                    content: `
                        <p>I've been working on improving our dashboard visualizations and wanted to share some insights on best practices I've discovered that have significantly improved our data clarity and user engagement.</p>
                        
                        <h6>Key Best Practices:</h6>
                        <ol>
                            <li><strong>Simplify Your Visuals</strong> - Remove all non-essential elements and focus on the data. Avoid 3D charts and excessive decorations.</li>
                            <li><strong>Choose the Right Chart Type</strong> - Use bar charts for comparisons, line charts for trends over time, and pie charts sparingly (only for parts of a whole).</li>
                            <li><strong>Use Color Strategically</strong> - Limit your color palette and use color to highlight important information, not just for decoration.</li>
                            <li><strong>Provide Context</strong> - Always include titles, labels, and legends to help users understand what they're looking at.</li>
                            <li><strong>Enable Interactivity</strong> - Allow users to filter, drill down, or hover for more details when appropriate.</li>
                        </ol>
                        
                        <p>I've implemented these principles in our latest dashboard update, and we've seen a 35% increase in dashboard usage and positive feedback from stakeholders.</p>
                        
                        <p>What visualization practices have worked well for your teams?</p>
                    `,
                    replies: [
                        {
                            id: '101',
                            author: {
                                name: 'Alice Smith',
                                email: 'alice@example.com'
                            },
                            date: '1 hour ago',
                            content: "Great insights, John! I've also found that providing clear annotations on important data points helps guide users to key insights. For example, adding a note about why there was a spike in a particular month.",
                            likes: 3
                        },
                        {
                            id: '102',
                            author: {
                                name: 'Robert Johnson',
                                email: 'robert@example.com'
                            },
                            date: '45 minutes ago',
                            content: "As someone new to the team, this is incredibly helpful! One question - what tools are you using for your visualizations? I've used Tableau in the past but wondering if there are better options for our specific needs.",
                            likes: 1
                        },
                        {
                            id: '103',
                            author: {
                                name: 'John Doe',
                                email: 'john@example.com'
                            },
                            date: '30 minutes ago',
                            content: "@Robert - Great question! We're primarily using a combination of D3.js for custom visualizations and PowerBI for our standard reporting needs. I'd be happy to schedule a call to discuss the pros and cons of each for different use cases.",
                            likes: 2
                        }
                    ]
                },
                {
                    id: '2',
                    title: 'New Feature Request: Advanced Filters',
                    author: {
                        name: 'Alice Smith',
                        email: 'alice@example.com'
                    },
                    date: '1 day ago',
                    preview: "Would it be possible to add advanced filtering options to the reporting section? I find myself needing to...",
                    content: `
                        <p>Would it be possible to add advanced filtering options to the reporting section? I find myself needing to filter data in multiple ways that aren't currently supported.</p>
                        
                        <p>Specifically, I'd love to see:</p>
                        
                        <ul>
                            <li>Date range filtering with custom start/end dates</li>
                            <li>Multi-select filtering (being able to select multiple categories at once)</li>
                            <li>Nested filtering (filter by department AND status, for example)</li>
                            <li>Save filter presets for quick access</li>
                        </ul>
                        
                        <p>These capabilities would save me several hours each week when preparing reports. Is this something we could prioritize in an upcoming sprint?</p>
                    `,
                    replies: [
                        {
                            id: '201',
                            author: {
                                name: 'Michael Chen',
                                email: 'michael@example.com'
                            },
                            date: '22 hours ago',
                            content: "I've been wanting this too! Especially the saved filter presets. +1 for this feature request.",
                            likes: 5
                        },
                        {
                            id: '202',
                            author: {
                                name: 'Sarah Wilson',
                                email: 'sarah@example.com'
                            },
                            date: '18 hours ago',
                            content: "We've added this to our product backlog and are evaluating it for the next development cycle. The nested filtering might be more complex, but the other requests seem feasible for our Q3 release.",
                            likes: 2
                        }
                    ]
                },
                {
                    id: '3',
                    title: 'Introduction: New Data Analyst Joining the Team',
                    badge: {
                        text: 'Announcement',
                        class: 'announcement'
                    },
                    author: {
                        name: 'Robert Johnson',
                        email: 'robert@example.com'
                    },
                    date: '3 days ago',
                    preview: "Hello everyone! I'm Robert, the new data analyst joining the team this week. I'm excited to collaborate...",
                    content: `
                        <p>Hello everyone!</p>
                        
                        <p>I'm Robert, the new data analyst joining the team this week. I'm excited to collaborate with all of you on upcoming projects.</p>
                        
                        <p>A bit about me: I have 5 years of experience in data analysis and visualization, with a focus on marketing analytics. Before joining this team, I worked at MediaTech where I developed customer segmentation models and campaign attribution frameworks.</p>
                        
                        <p>I'm particularly interested in:</p>
                        <ul>
                            <li>Predictive modeling</li>
                            <li>Interactive dashboards</li>
                            <li>Process automation</li>
                        </ul>
                        
                        <p>I'd love to schedule some one-on-one meetings with each of you to learn more about your work and how we might collaborate. Please feel free to reach out anytime!</p>
                        
                        <p>Looking forward to meeting everyone in person at the team lunch on Friday.</p>
                        
                        <p>Cheers,<br>Robert</p>
                    `,
                    replies: [
                        {
                            id: '301',
                            author: {
                                name: 'Emily Davis',
                                email: 'emily@example.com'
                            },
                            date: '3 days ago',
                            content: "Welcome to the team, Robert! Looking forward to working with you. I'd love to chat about your experience with campaign attribution - that's something we've been trying to improve.",
                            likes: 4
                        },
                        {
                            id: '302',
                            author: {
                                name: 'John Doe',
                                email: 'john@example.com'
                            },
                            date: '2 days ago',
                            content: "Welcome aboard! I just sent you a calendar invite for coffee next week. Would be great to discuss how we can integrate your predictive modeling expertise into our current projects.",
                            likes: 2
                        },
                        {
                            id: '303',
                            author: {
                                name: 'Alice Smith',
                                email: 'alice@example.com'
                            },
                            date: '2 days ago',
                            content: "Welcome Robert! I'm working on automating our monthly reporting process and would love to get your input. Let's connect later this week!",
                            likes: 3
                        }
                    ]
                }
            ];
            
            localStorage.setItem('forumThreads', JSON.stringify(defaultThreads));
        }
        
        // Add click handlers to forum topics
        addForumTopicHandlers();
    }
    
    // Add click handlers to forum topics
    function addForumTopicHandlers() {
        const forumTopics = document.querySelectorAll('.forum-topic');
        forumTopics.forEach(topic => {
            topic.addEventListener('click', function() {
                const topicId = this.getAttribute('data-topic-id');
                if (topicId) {
                    window.location.href = `thread.html?id=${topicId}`;
                }
            });
            
            // Make the cursor change to pointer to indicate it's clickable
            topic.style.cursor = 'pointer';
        });
    }
});
    // Initialize forum data
    function initForumData() {
        // Check if forum data already exists in localStorage
        if (!localStorage.getItem('forumThreads')) {
            // Initialize with default forum data
            const defaultThreads = [
                {
                    id: '1',
                    title: 'Data Visualization Best Practices',
                    badge: {
                        text: 'Hot',
                        class: 'hot'
                    },
                    author: {
                        name: 'John Doe',
                        email: 'john@example.com'
                    },
                    date: '2 hours ago',
                    preview: "I've been working on improving our dashboard visualizations and wanted to share some insights on best practices...",
                    content: `
                        <p>I've been working on improving our dashboard visualizations and wanted to share some insights on best practices I've discovered that have significantly improved our data clarity and user engagement.</p>
                        
                        <h6>Key Best Practices:</h6>
                        <ol>
                            <li><strong>Simplify Your Visuals</strong> - Remove all non-essential elements and focus on the data. Avoid 3D charts and excessive decorations.</li>
                            <li><strong>Choose the Right Chart Type</strong> - Use bar charts for comparisons, line charts for trends over time, and pie charts sparingly (only for parts of a whole).</li>
                            <li><strong>Use Color Strategically</strong> - Limit your color palette and use color to highlight important information, not just for decoration.</li>
                            <li><strong>Provide Context</strong> - Always include titles, labels, and legends to help users understand what they're looking at.</li>
                            <li><strong>Enable Interactivity</strong> - Allow users to filter, drill down, or hover for more details when appropriate.</li>
                        </ol>
                        
                        <p>I've implemented these principles in our latest dashboard update, and we've seen a 35% increase in dashboard usage and positive feedback from stakeholders.</p>
                        
                        <p>What visualization practices have worked well for your teams?</p>
                    `,
                    replies: [
                        {
                            id: '101',
                            author: {
                                name: 'Alice Smith',
                                email: 'alice@example.com'
                            },
                            date: '1 hour ago',
                            content: "Great insights, John! I've also found that providing clear annotations on important data points helps guide users to key insights. For example, adding a note about why there was a spike in a particular month.",
                            likes: 3
                        },
                        {
                            id: '102',
                            author: {
                                name: 'Robert Johnson',
                                email: 'robert@example.com'
                            },
                            date: '45 minutes ago',
                            content: "As someone new to the team, this is incredibly helpful! One question - what tools are you using for your visualizations? I've used Tableau in the past but wondering if there are better options for our specific needs.",
                            likes: 1
                        },
                        {
                            id: '103',
                            author: {
                                name: 'John Doe',
                                email: 'john@example.com'
                            },
                            date: '30 minutes ago',
                            content: "@Robert - Great question! We're primarily using a combination of D3.js for custom visualizations and PowerBI for our standard reporting needs. I'd be happy to schedule a call to discuss the pros and cons of each for different use cases.",
                            likes: 2
                        }
                    ]
                },
                {
                    id: '2',
                    title: 'New Feature Request: Advanced Filters',
                    author: {
                        name: 'Alice Smith',
                        email: 'alice@example.com'
                    },
                    date: '1 day ago',
                    preview: "Would it be possible to add advanced filtering options to the reporting section? I find myself needing to...",
                    content: `
                        <p>Would it be possible to add advanced filtering options to the reporting section? I find myself needing to filter data in multiple ways that aren't currently supported.</p>
                        
                        <p>Specifically, I'd love to see:</p>
                        
                        <ul>
                            <li>Date range filtering with custom start/end dates</li>
                            <li>Multi-select filtering (being able to select multiple categories at once)</li>
                            <li>Nested filtering (filter by department AND status, for example)</li>
                            <li>Save filter presets for quick access</li>
                        </ul>
                        
                        <p>These capabilities would save me several hours each week when preparing reports. Is this something we could prioritize in an upcoming sprint?</p>
                    `,
                    replies: [
                        {
                            id: '201',
                            author: {
                                name: 'Michael Chen',
                                email: 'michael@example.com'
                            },
                            date: '22 hours ago',
                            content: "I've been wanting this too! Especially the saved filter presets. +1 for this feature request.",
                            likes: 5
                        },
                        {
                            id: '202',
                            author: {
                                name: 'Sarah Wilson',
                                email: 'sarah@example.com'
                            },
                            date: '18 hours ago',
                            content: "We've added this to our product backlog and are evaluating it for the next development cycle. The nested filtering might be more complex, but the other requests seem feasible for our Q3 release.",
                            likes: 2
                        }
                    ]
                },
                {
                    id: '3',
                    title: 'Introduction: New Data Analyst Joining the Team',
                    badge: {
                        text: 'Announcement',
                        class: 'announcement'
                    },
                    author: {
                        name: 'Robert Johnson',
                        email: 'robert@example.com'
                    },
                    date: '3 days ago',
                    preview: "Hello everyone! I'm Robert, the new data analyst joining the team this week. I'm excited to collaborate...",
                    content: `
                        <p>Hello everyone!</p>
                        
                        <p>I'm Robert, the new data analyst joining the team this week. I'm excited to collaborate with all of you on upcoming projects.</p>
                        
                        <p>A bit about me: I have 5 years of experience in data analysis and visualization, with a focus on marketing analytics. Before joining this team, I worked at MediaTech where I developed customer segmentation models and campaign attribution frameworks.</p>
                        
                        <p>I'm particularly interested in:</p>
                        <ul>
                            <li>Predictive modeling</li>
                            <li>Interactive dashboards</li>
                            <li>Process automation</li>
                        </ul>
                        
                        <p>I'd love to schedule some one-on-one meetings with each of you to learn more about your work and how we might collaborate. Please feel free to reach out anytime!</p>
                        
                        <p>Looking forward to meeting everyone in person at the team lunch on Friday.</p>
                        
                        <p>Cheers,<br>Robert</p>
                    `,
                    replies: [
                        {
                            id: '301',
                            author: {
                                name: 'Emily Davis',
                                email: 'emily@example.com'
                            },
                            date: '3 days ago',
                            content: "Welcome to the team, Robert! Looking forward to working with you. I'd love to chat about your experience with campaign attribution - that's something we've been trying to improve.",
                            likes: 4
                        },
                        {
                            id: '302',
                            author: {
                                name: 'John Doe',
                                email: 'john@example.com'
                            },
                            date: '2 days ago',
                            content: "Welcome aboard! I just sent you a calendar invite for coffee next week. Would be great to discuss how we can integrate your predictive modeling expertise into our current projects.",
                            likes: 2
                        },
                        {
                            id: '303',
                            author: {
                                name: 'Alice Smith',
                                email: 'alice@example.com'
                            },
                            date: '2 days ago',
                            content: "Welcome Robert! I'm working on automating our monthly reporting process and would love to get your input. Let's connect later this week!",
                            likes: 3
                        }
                    ]
                }
            ];
            
            localStorage.setItem('forumThreads', JSON.stringify(defaultThreads));
        }
        
        // Add click handlers to forum topics
        addForumTopicHandlers();
    }
    
    // Add click handlers to forum topics
    function addForumTopicHandlers() {
        const forumTopics = document.querySelectorAll('.forum-topic');
        forumTopics.forEach(topic => {
            topic.addEventListener('click', function() {
                const topicId = this.getAttribute('data-topic-id');
                if (topicId) {
                    window.location.href = `thread.html?id=${topicId}`;
                }
            });
            
            // Make the cursor change to pointer to indicate it's clickable
            topic.style.cursor = 'pointer';
        });
    }

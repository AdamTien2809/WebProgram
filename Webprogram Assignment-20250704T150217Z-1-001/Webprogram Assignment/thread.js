document.addEventListener('DOMContentLoaded', function() {
    // Get current user data from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
    // Check if user is logged in
    if (!currentUser.name || !currentUser.email) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize profile data
    initProfileData(currentUser);
    
    // Get thread ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const threadId = urlParams.get('id');
    
    if (!threadId) {
        // If no thread ID is provided, redirect back to forum
        window.location.href = 'dashboard.html?view=forum';
        return;
    }
    
    // Load thread data
    loadThread(threadId);
    
    // Add event listeners
    setupEventListeners(threadId, currentUser);
});

// Initialize profile data in UI
function initProfileData(currentUser) {
    // Get first letter of name for profile icon
    const initial = currentUser.name.charAt(0).toUpperCase();
    
    // Set initials in profile icon
    const profileInitial = document.getElementById('profile-initial');
    if (profileInitial) profileInitial.textContent = initial;
    
    // Set username in dropdown
    const userName = document.getElementById('user-name');
    if (userName) userName.textContent = currentUser.name;
    
    // Handle logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

// Load thread data from localStorage
function loadThread(threadId) {
    // Get forum threads data from localStorage
    const threads = JSON.parse(localStorage.getItem('forumThreads')) || getDefaultThreads();
    
    // Find the requested thread
    const thread = threads.find(t => t.id === threadId);
    
    if (!thread) {
        alert('Thread not found!');
        window.location.href = 'dashboard.html?view=forum';
        return;
    }
    
    // Update thread details
    document.getElementById('thread-title').textContent = thread.title;
    
    // Add badge if thread has one
    const badgeEl = document.getElementById('thread-badge');
    if (thread.badge) {
        badgeEl.textContent = thread.badge.text;
        badgeEl.classList.add(thread.badge.class);
    } else {
        badgeEl.style.display = 'none';
    }
    
    // Set author initial
    const authorInitial = thread.author.name.charAt(0).toUpperCase() + 
                         (thread.author.name.indexOf(' ') > 0 ? thread.author.name.split(' ')[1].charAt(0).toUpperCase() : '');
    document.getElementById('thread-author-initial').textContent = authorInitial;
    
    // Set author name and date
    document.getElementById('thread-author').textContent = thread.author.name;
    document.getElementById('thread-date').innerHTML = `<i class="fas fa-clock me-1"></i>${thread.date}`;
    
    // Set thread content
    document.getElementById('thread-content-text').innerHTML = thread.content;
    
    // Update replies count
    document.getElementById('reply-count').textContent = thread.replies.length;
    
    // Load thread replies
    const repliesContainer = document.getElementById('thread-replies');
    repliesContainer.innerHTML = '';
    
    thread.replies.forEach(reply => {
        // Get initials for reply author avatar
        const replyAuthorInitial = reply.author.name.charAt(0).toUpperCase() + 
                              (reply.author.name.indexOf(' ') > 0 ? reply.author.name.split(' ')[1].charAt(0).toUpperCase() : '');
        
        const replyElement = document.createElement('div');
        replyElement.className = 'thread-reply';
        replyElement.innerHTML = `
            <div class="d-flex">
                <div class="thread-avatar-sm me-3">
                    <span>${replyAuthorInitial}</span>
                </div>
                <div class="reply-content">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="thread-author mb-0">${reply.author.name}</h6>
                        <span>${reply.date}</span>
                    </div>
                    <p>${reply.content}</p>
                    <div class="reply-actions">
                        <button class="btn btn-sm btn-link p-0" data-action="like" data-reply-id="${reply.id}">
                            <i class="far fa-thumbs-up me-1"></i>Like${reply.likes > 0 ? ' · ' + reply.likes : ''}
                        </button>
                        <button class="btn btn-sm btn-link p-0 ms-3" data-action="reply" data-reply-id="${reply.id}">
                            <i class="far fa-comment me-1"></i>Reply
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        repliesContainer.appendChild(replyElement);
    });
}

// Setup event listeners
function setupEventListeners(threadId, currentUser) {
    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const commentText = document.getElementById('comment-text').value.trim();
            
            if (!commentText) {
                alert('Please write a comment before posting.');
                return;
            }
            
            addComment(threadId, commentText, currentUser);
            
            // Clear form
            document.getElementById('comment-text').value = '';
        });
    }
    
    // Handle like and reply clicks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button[data-action]');
        
        if (!target) return;
        
        const action = target.getAttribute('data-action');
        const replyId = target.getAttribute('data-reply-id');
        
        if (action === 'like') {
            likeReply(threadId, replyId);
        } else if (action === 'reply') {
            // Focus on comment box and add @username
            const replyAuthor = target.closest('.thread-reply').querySelector('.thread-author').textContent;
            const commentText = document.getElementById('comment-text');
            commentText.value = `@${replyAuthor} `;
            commentText.focus();
        }
    });
}

// Add a new comment to the thread
function addComment(threadId, commentText, currentUser) {
    // Get forum threads data from localStorage
    let threads = JSON.parse(localStorage.getItem('forumThreads')) || getDefaultThreads();
    
    // Find the thread to update
    const threadIndex = threads.findIndex(t => t.id === threadId);
    
    if (threadIndex === -1) return;
    
    // Create new reply object
    const newReply = {
        id: Date.now().toString(),
        author: {
            name: currentUser.name,
            email: currentUser.email
        },
        content: commentText,
        date: 'Just now',
        likes: 0
    };
    
    // Add reply to thread
    threads[threadIndex].replies.push(newReply);
    
    // Update localStorage
    localStorage.setItem('forumThreads', JSON.stringify(threads));
    
    // Reload thread to show new comment
    loadThread(threadId);
}

// Like a reply
function likeReply(threadId, replyId) {
    // Get forum threads data from localStorage
    let threads = JSON.parse(localStorage.getItem('forumThreads')) || getDefaultThreads();
    
    // Find the thread
    const threadIndex = threads.findIndex(t => t.id === threadId);
    
    if (threadIndex === -1) return;
    
    // Find the reply
    const replyIndex = threads[threadIndex].replies.findIndex(r => r.id === replyId);
    
    if (replyIndex === -1) return;
    
    // Increment likes
    threads[threadIndex].replies[replyIndex].likes += 1;
    
    // Update localStorage
    localStorage.setItem('forumThreads', JSON.stringify(threads));
    
    // Update UI
    loadThread(threadId);
}

// Get default thread data if none exists in localStorage
function getDefaultThreads() {
    const threads = [
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
    
    return threads;
}
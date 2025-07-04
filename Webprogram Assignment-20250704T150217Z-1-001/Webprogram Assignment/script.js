document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginError = document.getElementById('login-error');
    const loginSuccess = document.getElementById('login-success');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');
    const agreeTermsBtn = document.getElementById('agree-terms');
    const termsCheckbox = document.getElementById('terms');
    const forgotPassword = document.getElementById('forgot-password');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginTab = document.getElementById('login-content');
    const signupTab = document.getElementById('signup-content');
    
    // Add particles to background
    createParticles();
    
    // Users data stored in localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (agreeTermsBtn) {
        agreeTermsBtn.addEventListener('click', function() {
            termsCheckbox.checked = true;
        });
    }
    
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Enter your email to reset password:');
            if (email) {
                resetPassword(email);
            }
        });
    }
    
    // Tab switching functionality
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginTab.classList.remove('show', 'active');
            signupTab.classList.add('show', 'active');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupTab.classList.remove('show', 'active');
            loginTab.classList.add('show', 'active');
        });
    }
    
    // Add animation to social buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Handle login form submission
    function handleLogin(e) {
        e.preventDefault();
        
        // Reset messages
        loginError.classList.add('d-none');
        loginSuccess.classList.add('d-none');
        
        // Get form values
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            loginSuccess.textContent = 'Login successful! Redirecting...';
            loginSuccess.classList.remove('d-none');
            
            // Save session if remember me is checked
            if (rememberMe) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
            }
            
            // Store user info in session storage
            sessionStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email
            }));
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            loginError.textContent = 'Invalid email or password. Please try again.';
            loginError.classList.remove('d-none');
            
            // Add shake animation to form
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
        }
    }
    
    // Handle signup form submission
    function handleSignup(e) {
        e.preventDefault();
        
        // Reset messages
        signupError.classList.add('d-none');
        signupSuccess.classList.add('d-none');
        
        // Get form values
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsAccepted = document.getElementById('terms').checked;
        
        // Validations
        if (password !== confirmPassword) {
            signupError.textContent = 'Passwords do not match!';
            signupError.classList.remove('d-none');
            return;
        }
        
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            signupError.textContent = 'Password must be at least 8 characters long and include numbers and letters.';
            signupError.classList.remove('d-none');
            return;
        }
        
        if (!termsAccepted) {
            signupError.textContent = 'You must agree to the Terms and Conditions.';
            signupError.classList.remove('d-none');
            return;
        }
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            signupError.textContent = 'This email is already registered. Try logging in instead.';
            signupError.classList.remove('d-none');
            return;
        }
        
        // Add new user
        const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        signupSuccess.textContent = 'Account created successfully! You can now log in.';
        signupSuccess.classList.remove('d-none');
        
        // Reset form
        setTimeout(() => {
            signupForm.reset();
            // Switch to login tab
            loginTab.classList.add('show', 'active');
            signupTab.classList.remove('show', 'active');
        }, 2000);
    }
    
    // Reset password functionality
    function resetPassword(email) {
        const userIndex = users.findIndex(user => user.email === email);
        
        if (userIndex !== -1) {
            // In a real app, you would send a reset link via email
            // For this demo, we'll just generate a new password
            const newPassword = generateTemporaryPassword();
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Your new temporary password is: ${newPassword}\nPlease login with this password and change it immediately.`);
        } else {
            alert('Email not found in our records.');
        }
    }
    
    // Generate temporary password
    function generateTemporaryPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    
    // Create particles effect in background
    function createParticles() {
        const particlesContainer = document.querySelector('.particles-background');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Set random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.5 + 0.1;
            const animationDuration = Math.random() * 20 + 10;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = '#2e8ee5';
            particle.style.boxShadow = '0 0 10px rgba(46, 142, 229, 0.5)';
            particle.style.animation = `float ${animationDuration}s infinite alternate`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
});
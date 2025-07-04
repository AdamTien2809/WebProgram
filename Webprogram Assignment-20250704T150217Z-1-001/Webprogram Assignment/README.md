# Simple Login & Signup Page

A clean and responsive login and signup system built with HTML, CSS, Bootstrap 5, and vanilla JavaScript.

## Features

- Tabbed interface for login and signup forms
- Form validation (client-side)
- Password strength requirements
- "Remember me" functionality
- "Forgot password" feature
- Terms and conditions modal
- Responsive design
- User data stored in browser's localStorage
- Simple animations and transitions

## Usage

Simply open the `index.html` file in any modern web browser.

### Login Credentials

Since this is a client-side only demo, you need to create an account first by signing up. After signing up, you can log in with the credentials you created.

### Local Storage

User data is stored in your browser's localStorage. To clear all registered users, you can run the following in your browser's console:

```javascript
localStorage.removeItem('users');
```

## Structure

- `index.html` - The main HTML document
- `styles.css` - Custom CSS styles
- `script.js` - JavaScript functionality

## Dependencies

- Bootstrap 5.3.0
- No jQuery required

## Note

This is a frontend demo only. In a production environment, you would need:

- Server-side validation
- Secure password storage with hashing
- HTTPS for secure data transmission
- CSRF protection
- Rate limiting for login attempts
- And other security measures
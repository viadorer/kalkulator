// Password protection system for Real Estate Calculators
// Usage: Include this script in any HTML file that needs password protection

const PASSWORD_CONFIG = {
    correctPassword: 'realitka2024', // Change this password as needed
    storageKey: 'realitka_password_verified',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

class PasswordProtection {
    constructor() {
        this.init();
    }

    init() {
        this.createPasswordHTML();
        this.checkPasswordStatus();
    }

    createPasswordHTML() {
        // Create password overlay HTML if it doesn't exist
        if (!document.getElementById('passwordOverlay')) {
            const overlayHTML = `
                <div id="passwordOverlay" class="password-overlay" style="display: none;">
                    <div class="password-popup">
                        <h2>Přístup k aplikaci</h2>
                        <p>Pro pokračování zadejte přístupové heslo</p>
                        <input type="password" id="passwordInput" class="password-input" placeholder="Zadejte heslo..." />
                        <button onclick="passwordProtection.checkPassword()" class="password-submit">Pokračovat</button>
                        <div id="passwordError" class="password-error">Nesprávné heslo. Zkuste to znovu.</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', overlayHTML);
        }

        // Add CSS if it doesn't exist
        if (!document.getElementById('passwordProtectionCSS')) {
            const cssHTML = `
                <style id="passwordProtectionCSS">
                    .password-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(20px);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .password-popup {
                        background: white;
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        text-align: center;
                        max-width: 400px;
                        width: 90%;
                        animation: slideIn 0.3s ease-out;
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-30px) scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    .password-popup h2 {
                        color: #1d1d1f;
                        margin-bottom: 10px;
                        font-size: 24px;
                        font-weight: 600;
                    }

                    .password-popup p {
                        color: #86868b;
                        margin-bottom: 30px;
                        font-size: 16px;
                    }

                    .password-input {
                        width: 100%;
                        padding: 15px 20px;
                        border: 2px solid #e5e5e7;
                        border-radius: 12px;
                        font-size: 16px;
                        margin-bottom: 20px;
                        transition: border-color 0.3s ease;
                        box-sizing: border-box;
                    }

                    .password-input:focus {
                        outline: none;
                        border-color: #007AFF;
                        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
                    }

                    .password-submit {
                        width: 100%;
                        padding: 15px;
                        background: #007AFF;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .password-submit:hover {
                        background: #0056CC;
                        transform: translateY(-1px);
                    }

                    .password-submit:active {
                        transform: translateY(0);
                    }

                    .password-error {
                        color: #ff3b30;
                        font-size: 14px;
                        margin-top: 10px;
                        display: none;
                    }

                    .main-content {
                        filter: blur(0px);
                        transition: filter 0.3s ease;
                    }

                    .main-content.blurred {
                        filter: blur(10px);
                        pointer-events: none;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', cssHTML);
        }
    }

    checkPasswordStatus() {
        const stored = localStorage.getItem(PASSWORD_CONFIG.storageKey);
        
        if (stored) {
            const data = JSON.parse(stored);
            const now = new Date().getTime();
            
            // Check if session hasn't expired
            if (now - data.timestamp < PASSWORD_CONFIG.sessionTimeout) {
                this.grantAccess();
                return;
            } else {
                // Session expired, remove stored data
                localStorage.removeItem(PASSWORD_CONFIG.storageKey);
            }
        }
        
        this.showPasswordPopup();
    }

    showPasswordPopup() {
        const overlay = document.getElementById('passwordOverlay');
        
        overlay.style.display = 'flex';
        // Blur only the main content area
        this.getBlurTargets().forEach(el => el.classList.add('blurred'));
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('passwordInput');
            if (input) {
                input.focus();
                
                // Enter key support
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkPassword();
                    }
                });
            }
        }, 300);
    }

    checkPassword() {
        const input = document.getElementById('passwordInput');
        const errorDiv = document.getElementById('passwordError');
        const password = input.value;

        if (password === PASSWORD_CONFIG.correctPassword) {
            // Correct password - store in localStorage with timestamp
            const data = {
                verified: true,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(PASSWORD_CONFIG.storageKey, JSON.stringify(data));
            this.grantAccess();
        } else {
            // Wrong password - show error
            errorDiv.style.display = 'block';
            input.value = '';
            input.focus();
            
            // Error animation
            input.style.borderColor = '#ff3b30';
            setTimeout(() => {
                input.style.borderColor = '#e5e5e7';
            }, 2000);
        }
    }

    grantAccess() {
        const overlay = document.getElementById('passwordOverlay');
        
        overlay.style.opacity = '0';
        // Remove blur from content areas
        this.getBlurTargets().forEach(el => el.classList.remove('blurred'));
        
        setTimeout(() => {
            overlay.style.display = 'none';
            overlay.style.opacity = '';
        }, 300);
    }

    // Determine which elements to blur (prefer explicit wrapper if present)
    getBlurTargets() {
        const targets = [];
        const explicit = document.getElementById('mainContent');
        if (explicit) targets.push(explicit);
        // Fallback: first major container on the page
        if (!explicit) {
            const firstContainer = document.querySelector('.container');
            if (firstContainer) targets.push(firstContainer);
        }
        // As a last resort, avoid blurring body to keep popup sharp
        return targets;
    }

    // Debug function to reset password (remove in production)
    resetPassword() {
        localStorage.removeItem(PASSWORD_CONFIG.storageKey);
        location.reload();
    }
}

// Initialize password protection when DOM is loaded
let passwordProtection;
document.addEventListener('DOMContentLoaded', () => {
    passwordProtection = new PasswordProtection();
});

// Make resetPassword available globally for debugging
window.resetPassword = () => {
    if (passwordProtection) {
        passwordProtection.resetPassword();
    }
};

/**
 * FRAME AI Studio — Production Authentication Controller & Route Guard
 * Handles Login, Sign Up, Google OAuth, Forgot Password, Reset Password,
 * Session Persistence, Route Protection, Validation, Error Handling, and Logout.
 */

(function () {
  'use strict';

  const AUTH_TOKEN_KEY = "frame_ai_auth_token";
  const AUTH_USER_KEY = "frame_ai_auth_user";
  const LOCAL_USERS_KEY = "frame_ai_local_users";
  const LOCAL_RESETS_KEY = "frame_ai_local_resets";

  // Default Demo Studio Credentials
  const DEMO_USER = {
    id: "u-admin",
    name: "Alex Carter",
    email: "admin@frameai.com",
    studioName: "Frame Creative Studio",
    role: "Studio Owner"
  };

  let currentUser = null;
  let authToken = null;
  let authRootEl = null;
  let googleClientId = "";
  let googleTokenClient = null;

  // --------------------------------------------------------------------------
  // 1. INITIALIZATION & SESSION RESTORATION
  // --------------------------------------------------------------------------

  async function initAuth() {
    // Locate or create Auth Root Container
    authRootEl = document.getElementById("authRoot");
    if (!authRootEl) {
      authRootEl = document.createElement("div");
      authRootEl.id = "authRoot";
      authRootEl.className = "auth-root";
      document.body.prepend(authRootEl);
    }

    // Seed local cryptographic fallback storage if needed
    seedLocalUsers();

    // Fetch backend public auth configuration (e.g. Google Client ID)
    fetchAuthConfig();

    // Check for Google OAuth callback parameters in hash or search query
    handleOAuthCallbackParams();

    // Restore cached session
    restoreSession();

    // Validate session with backend if online
    if (isAuthenticated()) {
      verifyBackendSession();
    }

    // Hook Hash Navigation Guard
    window.addEventListener("hashchange", handleAuthRouting);
    handleAuthRouting();

    // Attach Topbar Profile Trigger
    attachLogoutHandlers();
  }

  function seedLocalUsers() {
    try {
      if (!localStorage.getItem(LOCAL_USERS_KEY)) {
        // Pre-seed admin user with hashed password (PBKDF2 representation)
        const initialUsers = [
          {
            id: "u-admin",
            name: "Alex Carter",
            email: "admin@frameai.com",
            studioName: "Frame Creative Studio",
            role: "Studio Owner",
            salt: "frame_ai_salt_2026",
            passwordHash: "7b475949e29a8a77a942a0b12bc78553258c7e6c46a6f69528bb678b871c8959d9c2ca24bbf52f829ec3984852fec49f056ec563821092a06141ae5eb4bfa254",
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
      }
    } catch (e) {
      console.warn("[Auth] Local storage unavailable for seed:", e);
    }
  }

  async function fetchAuthConfig() {
    try {
      const res = await fetch("/api/auth/config");
      if (res.ok) {
        const data = await res.json();
        if (data.googleClientId) {
          googleClientId = data.googleClientId;
          initGoogleSignIn();
        }
      }
    } catch (e) {
      // Backend not running or offline, continue with client config
    }
  }

  function handleOAuthCallbackParams() {
    try {
      const hashStr = window.location.hash || "";
      const searchStr = window.location.search || "";

      // Check hash params: e.g. #google_auth=success&token=...&user=...
      const parseParams = (str) => {
        const cleaned = str.replace(/^[#?]/, '');
        const params = new URLSearchParams(cleaned);
        return params;
      };

      const params = searchStr ? parseParams(searchStr) : parseParams(hashStr);

      if (params.get("google_auth") === "success" || params.get("auth") === "success") {
        const token = params.get("token");
        const rawUser = params.get("user");
        if (token && rawUser) {
          const user = JSON.parse(decodeURIComponent(rawUser));
          saveSession(user, token, true);
          if (typeof window.toast === "function") {
            window.toast("Google Connected", `Signed in as ${user.name} (${user.email}).`);
          }
          window.location.hash = "#dashboard";
        }
      }
    } catch (e) {
      console.warn("[Auth] Error parsing OAuth callback params:", e);
    }
  }

  function restoreSession() {
    const cachedToken = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    const cachedUser = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);

    if (cachedToken && cachedUser) {
      try {
        currentUser = JSON.parse(cachedUser);
        authToken = cachedToken;
        updateUserProfileUI(currentUser);
      } catch (e) {
        console.warn("[Auth] Corrupted session cache:", e);
        clearSession();
      }
    }
  }

  async function verifyBackendSession() {
    if (!authToken) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.status === 401) {
        // Token invalid or expired
        console.warn("[Auth] Session expired on server.");
        clearSession();
        handleAuthRouting();
      } else if (res.ok) {
        const data = await res.json();
        if (data.user) {
          currentUser = data.user;
          updateUserProfileUI(currentUser);
        }
      }
    } catch (e) {
      // Offline / Static mode: keep local cached session
    }
  }

  function saveSession(user, token, remember = true) {
    currentUser = user;
    authToken = token;

    const storage = remember ? localStorage : sessionStorage;
    (remember ? sessionStorage : localStorage).removeItem(AUTH_TOKEN_KEY);
    (remember ? sessionStorage : localStorage).removeItem(AUTH_USER_KEY);

    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    updateUserProfileUI(user);
  }

  function clearSession() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  }

  function isAuthenticated() {
    return !!(currentUser && authToken);
  }

  // --------------------------------------------------------------------------
  // 2. ROUTE GUARD & AUTH VIEW CONTROLLER
  // --------------------------------------------------------------------------

  function getActiveAuthRoute() {
    const rawHash = (window.location.hash || "").replace("#", "").trim();
    const route = rawHash.split("?")[0];
    return {
      route,
      rawHash,
      isAuth: ["login", "signup", "forgot-password", "reset-password"].includes(route)
    };
  }

  function handleAuthRouting() {
    const { route, isAuth, rawHash } = getActiveAuthRoute();

    const appShell = document.querySelector(".app-shell");
    const bottomNav = document.querySelector(".bottom-nav");
    const studioAiRoot = document.getElementById("studioAiRoot");

    if (!isAuthenticated()) {
      // User is NOT logged in
      if (!isAuth) {
        // Redirect protected routes to #login
        window.location.hash = "#login";
        return;
      }

      // Hide main protected app shell
      if (appShell) appShell.style.display = "none";
      if (bottomNav) bottomNav.style.display = "none";
      if (studioAiRoot) studioAiRoot.style.display = "none";
      if (authRootEl) authRootEl.style.display = "block";

      // Render the active auth view
      renderAuthView(route, rawHash);

    } else {
      // User IS logged in
      if (isAuth) {
        // Redirect auth pages back to dashboard
        window.location.hash = "#dashboard";
        return;
      }

      // Show main application
      if (authRootEl) authRootEl.style.display = "none";
      if (appShell) appShell.style.display = "";
      if (bottomNav) bottomNav.style.display = "";
      if (studioAiRoot) studioAiRoot.style.display = "";

      updateUserProfileUI(currentUser);
    }
  }

  // --------------------------------------------------------------------------
  // 3. AUTH VIEWS RENDERER
  // --------------------------------------------------------------------------

  function renderAuthView(viewName, rawHash = "") {
    if (!authRootEl) return;

    let formCardHtml = "";
    if (viewName === "signup") {
      formCardHtml = renderSignupCard();
    } else if (viewName === "forgot-password") {
      formCardHtml = renderForgotPasswordCard();
    } else if (viewName === "reset-password") {
      formCardHtml = renderResetPasswordCard(rawHash);
    } else {
      formCardHtml = renderLoginCard();
    }

    authRootEl.innerHTML = `
      <div class="auth-layout">
        <!-- Left Branding & AI Visual Section -->
        <div class="auth-visual-side">
          <div class="auth-brand-top">
            <div class="auth-brand-mark">F</div>
            <div>
              <span class="auth-brand-name">FRAME <strong>AI</strong></span>
              <span class="auth-brand-sub">STUDIO INTELLIGENCE</span>
            </div>
          </div>

          <div class="auth-hero-copy">
            <h1 class="auth-hero-title">Your studio.<br><span class="gradient-text">Smarter with AI.</span></h1>
            <p class="auth-hero-desc">Manage clients, bookings, schedules, projects and studio operations from one intelligent workspace.</p>
          </div>

          <!-- CSS/SVG Abstract AI Camera Aperture Visual -->
          <div class="auth-aperture-visual" aria-hidden="true">
            <div class="aperture-glow"></div>
            <div class="aperture-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
              <div class="aperture-center">
                <span class="aperture-sparkle">✨</span>
                <span class="aperture-lens-focal">85mm · f/1.2</span>
              </div>
            </div>
          </div>

          <!-- Feature Highlights -->
          <div class="auth-features-list">
            <div class="auth-feature-pill">✦ Smart Booking</div>
            <div class="auth-feature-pill">✦ AI Studio Assistant</div>
            <div class="auth-feature-pill">✦ Client Management</div>
            <div class="auth-feature-pill">✦ Revenue & Analytics</div>
          </div>
        </div>

        <!-- Right Form Section -->
        <div class="auth-form-side">
          <div class="auth-card" id="authCardContainer">
            ${formCardHtml}
          </div>
        </div>
      </div>
    `;

    // Re-initialize Lucide Icons if available
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

    // Attach View-Specific Listeners
    if (viewName === "signup") {
      bindSignupEvents();
    } else if (viewName === "forgot-password") {
      bindForgotPasswordEvents();
    } else if (viewName === "reset-password") {
      bindResetPasswordEvents(rawHash);
    } else {
      bindLoginEvents();
    }

    // Check for error parameters in URL to display immediately
    checkAndDisplayUrlErrors();
  }

  function checkAndDisplayUrlErrors() {
    const raw = window.location.href;
    if (raw.includes("error=")) {
      const urlObj = new URL(raw.replace(/#.*$/, ''));
      const hashParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
      const errorMsg = urlObj.searchParams.get("error") || hashParams.get("error");
      if (errorMsg) {
        const alertEl = document.querySelector(".auth-alert");
        if (alertEl) {
          showAuthAlert(alertEl, "danger", decodeURIComponent(errorMsg));
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. LOGIN VIEW TEMPLATE & CONTROLLER
  // --------------------------------------------------------------------------

  function renderLoginCard() {
    return `
      <div class="auth-card-head">
        <div class="auth-card-badge">✨ Luxury Studio Access</div>
        <h2 class="auth-card-title">Welcome back</h2>
        <p class="auth-card-subtitle">Sign in to your FRAME AI Studio workspace.</p>
      </div>

      <!-- Quick Demo Account Fill Button -->
      <div class="auth-demo-banner" id="demoAccountBanner" title="Click to fill development credentials">
        <div class="auth-demo-icon">🔑</div>
        <div class="auth-demo-text">
          <strong>Demo Studio Account Available</strong>
          <small>admin@frameai.com · Password: Studio@2026</small>
        </div>
        <button type="button" class="auth-demo-fill-btn" id="fillDemoBtn">Use Demo</button>
      </div>

      <!-- Login Form -->
      <form class="auth-form" id="loginForm" novalidate>
        <!-- Email Field -->
        <div class="auth-field">
          <label for="loginEmail">Email</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input type="email" id="loginEmail" class="auth-input" placeholder="Enter your email" autocomplete="email" required>
          </div>
          <div class="auth-field-error" id="loginEmailError"></div>
        </div>

        <!-- Password Field -->
        <div class="auth-field">
          <label for="loginPassword">Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="loginPassword" class="auth-input" placeholder="Enter your password" autocomplete="current-password" required>
            <button type="button" class="auth-toggle-pwd" id="toggleLoginPwd" aria-label="Show/Hide Password" title="Show password">
              <svg class="eye-open" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-closed" style="display:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            </button>
          </div>
          <div class="auth-field-error" id="loginPasswordError"></div>
        </div>

        <!-- Remember Me & Forgot Password Row -->
        <div class="auth-form-row">
          <label class="auth-checkbox-label">
            <input type="checkbox" id="loginRemember" checked>
            <span>Remember me</span>
          </label>
          <a href="#forgot-password" class="auth-link">Forgot password?</a>
        </div>

        <!-- Form Status Message Alert -->
        <div class="auth-alert" id="loginAlert" style="display:none"></div>

        <!-- Submit Button -->
        <button type="submit" class="btn primary auth-submit-btn" id="loginSubmitBtn">
          <span class="btn-label">Sign In &rarr;</span>
          <span class="btn-spinner" style="display:none">Signing in...</span>
        </button>

        <!-- Divider -->
        <div class="auth-divider">
          <span>OR</span>
        </div>

        <!-- Google OAuth Button -->
        <button type="button" class="auth-google-btn" id="googleLoginBtn">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#EA4335" d="M12 5c1.7 0 3 .6 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12c0 1.7.7 3.2 1.9 5.6l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- Switch to Signup -->
        <div class="auth-switch-text">
          Don't have an account? <a href="#signup" class="auth-link-bold">Create account</a>
        </div>
      </form>
    `;
  }

  function bindLoginEvents() {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const pwdInput = document.getElementById("loginPassword");
    const rememberCheckbox = document.getElementById("loginRemember");
    const togglePwdBtn = document.getElementById("toggleLoginPwd");
    const submitBtn = document.getElementById("loginSubmitBtn");
    const alertEl = document.getElementById("loginAlert");
    const emailErrorEl = document.getElementById("loginEmailError");
    const pwdErrorEl = document.getElementById("loginPasswordError");
    const fillDemoBtn = document.getElementById("fillDemoBtn");
    const googleBtn = document.getElementById("googleLoginBtn");

    // Quick Fill Demo
    if (fillDemoBtn) {
      fillDemoBtn.addEventListener("click", () => {
        emailInput.value = "admin@frameai.com";
        pwdInput.value = "Studio@2026";
        emailErrorEl.textContent = "";
        pwdErrorEl.textContent = "";
        emailInput.focus();
      });
    }

    // Toggle Password Visibility
    if (togglePwdBtn) {
      togglePwdBtn.addEventListener("click", () => {
        const isPwd = pwdInput.type === "password";
        pwdInput.type = isPwd ? "text" : "password";
        togglePwdBtn.querySelector(".eye-open").style.display = isPwd ? "none" : "block";
        togglePwdBtn.querySelector(".eye-closed").style.display = isPwd ? "block" : "none";
      });
    }

    // Google Sign-In Trigger
    if (googleBtn) {
      googleBtn.addEventListener("click", handleGoogleAuthClick);
    }

    // Form Submit
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        alertEl.style.display = "none";
        emailErrorEl.textContent = "";
        pwdErrorEl.textContent = "";

        const email = emailInput.value.trim();
        const password = pwdInput.value;
        const remember = rememberCheckbox ? rememberCheckbox.checked : true;

        // Input Validations
        let hasError = false;
        if (!email) {
          emailErrorEl.textContent = "Please enter your email.";
          hasError = true;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          emailErrorEl.textContent = "Please enter a valid email address.";
          hasError = true;
        }

        if (!password) {
          pwdErrorEl.textContent = "Please enter your password.";
          hasError = true;
        }

        if (hasError) return;

        setBtnLoading(submitBtn, true);

        try {
          // Attempt backend authentication
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, remember })
          });

          const data = await res.json();
          setBtnLoading(submitBtn, false);

          if (!res.ok || !data.success) {
            showAuthAlert(alertEl, "danger", data.error || "Incorrect email or password.");
            return;
          }

          // Save session and redirect
          saveSession(data.user, data.token, remember);

          if (typeof window.toast === "function") {
            window.toast("Welcome Back!", `Signed in as ${data.user.name} (${data.user.studioName}).`);
          }

          window.location.hash = "#dashboard";

        } catch (fetchErr) {
          // Fallback to local cryptographic store if server is unreachable
          console.warn("[Auth] Server offline, checking local cryptographic store:", fetchErr);
          setBtnLoading(submitBtn, false);

          const localUser = await authenticateLocalUser(email, password);
          if (localUser) {
            const fallbackToken = "local_token_" + Date.now();
            saveSession(localUser, fallbackToken, remember);
            if (typeof window.toast === "function") {
              window.toast("Welcome Back!", `Signed in as ${localUser.name}.`);
            }
            window.location.hash = "#dashboard";
          } else {
            showAuthAlert(alertEl, "danger", "Incorrect email or password.");
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. SIGN UP VIEW TEMPLATE & CONTROLLER
  // --------------------------------------------------------------------------

  function renderSignupCard() {
    return `
      <div class="auth-card-head">
        <div class="auth-card-badge">✨ Create New Studio</div>
        <h2 class="auth-card-title">Create your workspace</h2>
        <p class="auth-card-subtitle">Join luxury studios running on FRAME AI Intelligence.</p>
      </div>

      <form class="auth-form" id="signupForm" novalidate>
        <!-- Full Name -->
        <div class="auth-field">
          <label for="signupName">Full Name</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" id="signupName" class="auth-input" placeholder="e.g. Alex Carter" autocomplete="name" required>
          </div>
          <div class="auth-field-error" id="signupNameError"></div>
        </div>

        <!-- Studio Name -->
        <div class="auth-field">
          <label for="signupStudio">Photography Studio Name</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <input type="text" id="signupStudio" class="auth-input" placeholder="e.g. Frame Creative Studio" required>
          </div>
          <div class="auth-field-error" id="signupStudioError"></div>
        </div>

        <!-- Email -->
        <div class="auth-field">
          <label for="signupEmail">Work Email</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input type="email" id="signupEmail" class="auth-input" placeholder="example@gmail.com" autocomplete="email" required>
          </div>
          <div class="auth-field-error" id="signupEmailError"></div>
        </div>

        <!-- Password -->
        <div class="auth-field">
          <label for="signupPassword">Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="signupPassword" class="auth-input" placeholder="At least 6 characters" autocomplete="new-password" required>
            <button type="button" class="auth-toggle-pwd" id="toggleSignupPwd" aria-label="Show/Hide Password" title="Show password">
              <svg class="eye-open" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-closed" style="display:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            </button>
          </div>
          <div class="auth-field-error" id="signupPasswordError"></div>
        </div>

        <!-- Confirm Password -->
        <div class="auth-field">
          <label for="signupConfirmPassword">Confirm Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <input type="password" id="signupConfirmPassword" class="auth-input" placeholder="Re-enter password" autocomplete="new-password" required>
            <button type="button" class="auth-toggle-pwd" id="toggleSignupConfirmPwd" aria-label="Show/Hide Password" title="Show password">
              <svg class="eye-open" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-closed" style="display:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            </button>
          </div>
          <div class="auth-field-error" id="signupConfirmPasswordError"></div>
        </div>

        <!-- Alert -->
        <div class="auth-alert" id="signupAlert" style="display:none"></div>

        <!-- Submit Button -->
        <button type="submit" class="btn primary auth-submit-btn" id="signupSubmitBtn">
          <span class="btn-label">Create Studio Account &rarr;</span>
          <span class="btn-spinner" style="display:none">Creating workspace...</span>
        </button>

        <!-- Divider -->
        <div class="auth-divider">
          <span>OR</span>
        </div>

        <!-- Google OAuth Button -->
        <button type="button" class="auth-google-btn" id="googleSignupBtn">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#EA4335" d="M12 5c1.7 0 3 .6 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12c0 1.7.7 3.2 1.9 5.6l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

        <!-- Switch to Login -->
        <div class="auth-switch-text">
          Already have an account? <a href="#login" class="auth-link-bold">Sign in</a>
        </div>
      </form>
    `;
  }

  function bindSignupEvents() {
    const form = document.getElementById("signupForm");
    const nameInput = document.getElementById("signupName");
    const studioInput = document.getElementById("signupStudio");
    const emailInput = document.getElementById("signupEmail");
    const pwdInput = document.getElementById("signupPassword");
    const confirmPwdInput = document.getElementById("signupConfirmPassword");
    const submitBtn = document.getElementById("signupSubmitBtn");
    const alertEl = document.getElementById("signupAlert");
    const googleBtn = document.getElementById("googleSignupBtn");

    // Toggle Password Visibilities
    const togglePwd = document.getElementById("toggleSignupPwd");
    if (togglePwd) {
      togglePwd.addEventListener("click", () => {
        const isPwd = pwdInput.type === "password";
        pwdInput.type = isPwd ? "text" : "password";
        togglePwd.querySelector(".eye-open").style.display = isPwd ? "none" : "block";
        togglePwd.querySelector(".eye-closed").style.display = isPwd ? "block" : "none";
      });
    }

    const toggleConfirmPwd = document.getElementById("toggleSignupConfirmPwd");
    if (toggleConfirmPwd) {
      toggleConfirmPwd.addEventListener("click", () => {
        const isPwd = confirmPwdInput.type === "password";
        confirmPwdInput.type = isPwd ? "text" : "password";
        toggleConfirmPwd.querySelector(".eye-open").style.display = isPwd ? "none" : "block";
        toggleConfirmPwd.querySelector(".eye-closed").style.display = isPwd ? "block" : "none";
      });
    }

    // Google Sign-Up Trigger
    if (googleBtn) {
      googleBtn.addEventListener("click", handleGoogleAuthClick);
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertEl.style.display = "none";

      const name = nameInput.value.trim();
      const studioName = studioInput.value.trim();
      const email = emailInput.value.trim();
      const password = pwdInput.value;
      const confirmPassword = confirmPwdInput.value;

      // Clear errors
      document.getElementById("signupNameError").textContent = "";
      document.getElementById("signupStudioError").textContent = "";
      document.getElementById("signupEmailError").textContent = "";
      document.getElementById("signupPasswordError").textContent = "";
      document.getElementById("signupConfirmPasswordError").textContent = "";

      let hasError = false;
      if (!name) {
        document.getElementById("signupNameError").textContent = "Please enter your full name.";
        hasError = true;
      }
      if (!studioName) {
        document.getElementById("signupStudioError").textContent = "Please enter your photography studio name.";
        hasError = true;
      }
      if (!email) {
        document.getElementById("signupEmailError").textContent = "Please enter your email.";
        hasError = true;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        document.getElementById("signupEmailError").textContent = "Please enter a valid email address.";
        hasError = true;
      }
      if (!password || password.length < 6) {
        document.getElementById("signupPasswordError").textContent = "Password must be at least 6 characters.";
        hasError = true;
      }
      if (password !== confirmPassword) {
        document.getElementById("signupConfirmPasswordError").textContent = "Passwords do not match.";
        hasError = true;
      }

      if (hasError) return;

      setBtnLoading(submitBtn, true);

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, studioName, email, password, confirmPassword })
        });

        const data = await res.json();
        setBtnLoading(submitBtn, false);

        if (!res.ok || !data.success) {
          showAuthAlert(alertEl, "danger", data.error || "Failed to create account. Please try again.");
          return;
        }

        // Save session & redirect
        saveSession(data.user, data.token, true);

        if (typeof window.toast === "function") {
          window.toast("Studio Created!", `Welcome ${data.user.name}! Your workspace is ready.`);
        }

        window.location.hash = "#dashboard";

      } catch (err) {
        console.warn("[Auth] Server offline, registering user in local storage:", err);
        setBtnLoading(submitBtn, false);

        const localUser = await registerLocalUser({ name, studioName, email, password });
        if (localUser.error) {
          showAuthAlert(alertEl, "danger", localUser.error);
          return;
        }

        saveSession(localUser, "local_token_" + Date.now(), true);

        if (typeof window.toast === "function") {
          window.toast("Studio Created!", `Welcome ${name}! Your workspace is ready.`);
        }

        window.location.hash = "#dashboard";
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. FORGOT PASSWORD VIEW TEMPLATE & CONTROLLER
  // --------------------------------------------------------------------------

  function renderForgotPasswordCard() {
    return `
      <div class="auth-card-head">
        <div class="auth-card-badge">🔒 Secure Recovery</div>
        <h2 class="auth-card-title">Reset password</h2>
        <p class="auth-card-subtitle">Enter your registered email to receive recovery instructions.</p>
      </div>

      <form class="auth-form" id="forgotForm" novalidate>
        <div class="auth-field">
          <label for="forgotEmail">Email address</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input type="email" id="forgotEmail" class="auth-input" placeholder="Enter your registered email" autocomplete="email" required>
          </div>
          <div class="auth-field-error" id="forgotEmailError"></div>
        </div>

        <div class="auth-alert" id="forgotAlert" style="display:none"></div>

        <button type="submit" class="btn primary auth-submit-btn" id="forgotSubmitBtn">
          <span class="btn-label">Send Reset Link &rarr;</span>
          <span class="btn-spinner" style="display:none">Sending instructions...</span>
        </button>

        <div class="auth-switch-text">
          <a href="#login" class="auth-link">&larr; Back to sign in</a>
        </div>
      </form>
    `;
  }

  function bindForgotPasswordEvents() {
    const form = document.getElementById("forgotForm");
    const emailInput = document.getElementById("forgotEmail");
    const errorEl = document.getElementById("forgotEmailError");
    const alertEl = document.getElementById("forgotAlert");
    const submitBtn = document.getElementById("forgotSubmitBtn");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertEl.style.display = "none";
      errorEl.textContent = "";

      const email = emailInput.value.trim();
      if (!email) {
        errorEl.textContent = "Please enter your email.";
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errorEl.textContent = "Please enter a valid email address.";
        return;
      }

      setBtnLoading(submitBtn, true);

      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setBtnLoading(submitBtn, false);

        if (!res.ok || !data.success) {
          showAuthAlert(alertEl, "danger", data.error || "Could not generate reset link. Please check your email.");
          return;
        }

        const resetLinkHtml = data.resetToken 
          ? `<br><br><a href="#reset-password?token=${data.resetToken}" class="auth-link-bold" style="text-decoration:underline">Click here to set your new password &rarr;</a>` 
          : "";

        showAuthAlert(alertEl, "success", (data.message || `Password reset link generated for ${email}.`) + resetLinkHtml);

      } catch (err) {
        setBtnLoading(submitBtn, false);
        // Offline local reset link generation
        const localResetToken = "reset_" + Date.now();
        saveLocalResetToken(email, localResetToken);
        showAuthAlert(
          alertEl,
          "success",
          `Password reset link generated for ${email}.<br><br><a href="#reset-password?token=${localResetToken}" class="auth-link-bold" style="text-decoration:underline">Click here to set your new password &rarr;</a>`
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. RESET PASSWORD VIEW TEMPLATE & CONTROLLER
  // --------------------------------------------------------------------------

  function renderResetPasswordCard(rawHash = "") {
    const params = new URLSearchParams(rawHash.split("?")[1] || window.location.search || "");
    const token = params.get("token") || "";

    return `
      <div class="auth-card-head">
        <div class="auth-card-badge">🔑 Set New Password</div>
        <h2 class="auth-card-title">Create new password</h2>
        <p class="auth-card-subtitle">Please enter and confirm your new secure studio password.</p>
      </div>

      <form class="auth-form" id="resetPasswordForm" novalidate>
        <input type="hidden" id="resetTokenInput" value="${token}">

        <!-- New Password Field -->
        <div class="auth-field">
          <label for="resetNewPassword">New Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="resetNewPassword" class="auth-input" placeholder="At least 6 characters" autocomplete="new-password" required>
            <button type="button" class="auth-toggle-pwd" id="toggleResetPwd" aria-label="Show/Hide Password" title="Show password">
              <svg class="eye-open" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-closed" style="display:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            </button>
          </div>
          <div class="auth-field-error" id="resetNewPasswordError"></div>
        </div>

        <!-- Confirm New Password Field -->
        <div class="auth-field">
          <label for="resetConfirmPassword">Confirm New Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <input type="password" id="resetConfirmPassword" class="auth-input" placeholder="Re-enter your new password" autocomplete="new-password" required>
            <button type="button" class="auth-toggle-pwd" id="toggleResetConfirmPwd" aria-label="Show/Hide Password" title="Show password">
              <svg class="eye-open" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-closed" style="display:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            </button>
          </div>
          <div class="auth-field-error" id="resetConfirmPasswordError"></div>
        </div>

        <div class="auth-alert" id="resetPasswordAlert" style="display:none"></div>

        <button type="submit" class="btn primary auth-submit-btn" id="resetPasswordSubmitBtn">
          <span class="btn-label">Update Password & Sign In &rarr;</span>
          <span class="btn-spinner" style="display:none">Updating password...</span>
        </button>

        <div class="auth-switch-text">
          <a href="#login" class="auth-link">&larr; Back to sign in</a>
        </div>
      </form>
    `;
  }

  function bindResetPasswordEvents(rawHash = "") {
    const form = document.getElementById("resetPasswordForm");
    const tokenInput = document.getElementById("resetTokenInput");
    const newPwdInput = document.getElementById("resetNewPassword");
    const confirmPwdInput = document.getElementById("resetConfirmPassword");
    const submitBtn = document.getElementById("resetPasswordSubmitBtn");
    const alertEl = document.getElementById("resetPasswordAlert");

    // Toggle Eye Buttons
    const toggle1 = document.getElementById("toggleResetPwd");
    if (toggle1) {
      toggle1.addEventListener("click", () => {
        const isPwd = newPwdInput.type === "password";
        newPwdInput.type = isPwd ? "text" : "password";
        toggle1.querySelector(".eye-open").style.display = isPwd ? "none" : "block";
        toggle1.querySelector(".eye-closed").style.display = isPwd ? "block" : "none";
      });
    }

    const toggle2 = document.getElementById("toggleResetConfirmPwd");
    if (toggle2) {
      toggle2.addEventListener("click", () => {
        const isPwd = confirmPwdInput.type === "password";
        confirmPwdInput.type = isPwd ? "text" : "password";
        toggle2.querySelector(".eye-open").style.display = isPwd ? "none" : "block";
        toggle2.querySelector(".eye-closed").style.display = isPwd ? "block" : "none";
      });
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertEl.style.display = "none";
      document.getElementById("resetNewPasswordError").textContent = "";
      document.getElementById("resetConfirmPasswordError").textContent = "";

      const token = tokenInput ? tokenInput.value.trim() : "";
      const newPassword = newPwdInput.value;
      const confirmPassword = confirmPwdInput.value;

      if (!token) {
        showAuthAlert(alertEl, "danger", "Password reset token is missing or invalid. Please request a new link.");
        return;
      }

      let hasError = false;
      if (!newPassword || newPassword.length < 6) {
        document.getElementById("resetNewPasswordError").textContent = "Password must be at least 6 characters.";
        hasError = true;
      }
      if (newPassword !== confirmPassword) {
        document.getElementById("resetConfirmPasswordError").textContent = "Passwords do not match.";
        hasError = true;
      }

      if (hasError) return;

      setBtnLoading(submitBtn, true);

      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword, confirmPassword })
        });
        const data = await res.json();
        setBtnLoading(submitBtn, false);

        if (!res.ok || !data.success) {
          showAuthAlert(alertEl, "danger", data.error || "Password reset failed. Token may have expired.");
          return;
        }

        showAuthAlert(alertEl, "success", "Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          window.location.hash = "#login";
        }, 1800);

      } catch (err) {
        setBtnLoading(submitBtn, false);
        const localSuccess = await resetLocalUserPassword(token, newPassword);
        if (localSuccess) {
          showAuthAlert(alertEl, "success", "Password reset successfully! Redirecting to sign in...");
          setTimeout(() => {
            window.location.hash = "#login";
          }, 1800);
        } else {
          showAuthAlert(alertEl, "danger", "Password reset link is invalid or has expired.");
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. GOOGLE OAUTH AUTHENTICATION CONTROLLER
  // --------------------------------------------------------------------------

  function initGoogleSignIn() {
    if (!googleClientId || !window.google || !window.google.accounts) return;

    try {
      // 1. Initialize Google Identity Services ID client
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // 2. Initialize OAuth 2.0 Token Client for explicit user button clicks
      if (window.google.accounts.oauth2) {
        googleTokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              await processGoogleAccessToken(tokenResponse.access_token);
            }
          }
        });
      }
    } catch (e) {
      console.warn("[Google Auth] Error initializing Google Identity Services:", e);
    }
  }

  async function handleGoogleAuthClick() {
    const alertEl = document.querySelector(".auth-alert");

    // If Google Client ID is configured and Token Client is available:
    if (googleTokenClient) {
      try {
        googleTokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn("[Google Auth] Error invoking Token Client:", err);
      }
    }

    // If Google Identity prompt is available:
    if (window.google && window.google.accounts && window.google.accounts.id && googleClientId) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn("[Google Auth] Prompt failed, trying redirect:", e);
      }
    }

    // Try backend OAuth redirect endpoint
    if (googleClientId) {
      window.location.href = "/api/auth/google";
      return;
    }

    // If Google Client ID is not configured in .env:
    if (alertEl) {
      showAuthAlert(
        alertEl,
        "info",
        `<strong>Google OAuth Setup Notice</strong><br>To connect Google Single Sign-On, add your <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> to <code>.env</code>.<br><br>For instant access right now, use the <strong>Email / Password</strong> form or click <strong>Use Demo</strong>.`
      );
    } else if (typeof window.toast === "function") {
      window.toast("Google OAuth", "Configure GOOGLE_CLIENT_ID in .env to enable one-click Google Sign-In.");
    }
  }

  async function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) return;
    const alertEl = document.querySelector(".auth-alert");

    try {
      const res = await fetch("/api/auth/google/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (alertEl) showAuthAlert(alertEl, "danger", data.error || "Google authentication failed.");
        return;
      }

      saveSession(data.user, data.token, true);
      if (typeof window.toast === "function") {
        window.toast("Welcome!", `Signed in with Google as ${data.user.name}.`);
      }
      window.location.hash = "#dashboard";

    } catch (e) {
      console.warn("[Google Auth] Backend verification failed:", e);
    }
  }

  async function processGoogleAccessToken(accessToken) {
    const alertEl = document.querySelector(".auth-alert");
    try {
      // 1. Fetch user info from Google UserInfo endpoint
      const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (!userinfoRes.ok) {
        throw new Error("Could not retrieve Google profile.");
      }

      const googleProfile = await userinfoRes.json();

      // 2. Send to backend to register or sign in
      const res = await fetch("/api/auth/google/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          email: googleProfile.email,
          name: googleProfile.name,
          picture: googleProfile.picture
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        saveSession(data.user, data.token, true);
        if (typeof window.toast === "function") {
          window.toast("Welcome!", `Signed in with Google as ${data.user.name}.`);
        }
        window.location.hash = "#dashboard";
      } else {
        // Fallback local session with verified Google details
        const googleUser = {
          id: "u-g-" + Date.now(),
          name: googleProfile.name || "Google User",
          email: googleProfile.email,
          studioName: `${googleProfile.name}'s Studio`,
          role: "Studio Owner",
          avatar: googleProfile.picture || ""
        };
        saveSession(googleUser, "google_token_" + Date.now(), true);
        if (typeof window.toast === "function") {
          window.toast("Welcome!", `Signed in with Google as ${googleUser.name}.`);
        }
        window.location.hash = "#dashboard";
      }

    } catch (err) {
      console.error("[Google Auth Error]:", err);
      if (alertEl) showAuthAlert(alertEl, "danger", "Google authentication was cancelled or could not be completed.");
    }
  }

  // --------------------------------------------------------------------------
  // 9. CLIENT-SIDE CRYPTOGRAPHIC ENGINE (OFFLINE RESILIENCE)
  // --------------------------------------------------------------------------

  async function hashPasswordClient(password, salt = "frame_ai_salt_2026") {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 10000,
        hash: "SHA-512"
      },
      keyMaterial,
      { name: "HMAC", hash: "SHA-512", length: 512 },
      true,
      ["sign"]
    );
    const rawKey = await crypto.subtle.exportKey("raw", key);
    return Array.from(new Uint8Array(rawKey)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function authenticateLocalUser(email, password) {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) return null;

      const hash = await hashPasswordClient(password, user.salt || "frame_ai_salt_2026");
      if (hash === user.passwordHash || (cleanEmail === "admin@frameai.com" && password === "Studio@2026")) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          studioName: user.studioName || "Frame Creative Studio",
          role: user.role || "Studio Owner"
        };
      }
      return null;
    } catch (e) {
      if (email.toLowerCase().trim() === "admin@frameai.com" && password === "Studio@2026") {
        return DEMO_USER;
      }
      return null;
    }
  }

  async function registerLocalUser({ name, studioName, email, password }) {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { error: "An account with this email already exists." };
      }

      const salt = "salt_" + Date.now();
      const passwordHash = await hashPasswordClient(password, salt);
      const newUser = {
        id: "u-" + Date.now(),
        name,
        email: cleanEmail,
        studioName: studioName || `${name}'s Studio`,
        role: "Studio Owner",
        salt,
        passwordHash,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        studioName: newUser.studioName,
        role: newUser.role
      };
    } catch (e) {
      return { error: "Failed to store user locally." };
    }
  }

  function saveLocalResetToken(email, token) {
    try {
      const resets = JSON.parse(localStorage.getItem(LOCAL_RESETS_KEY) || "[]");
      resets.push({ email: email.toLowerCase().trim(), token, expiresAt: Date.now() + 3600000 });
      localStorage.setItem(LOCAL_RESETS_KEY, JSON.stringify(resets));
    } catch (e) {}
  }

  async function resetLocalUserPassword(token, newPassword) {
    try {
      const resets = JSON.parse(localStorage.getItem(LOCAL_RESETS_KEY) || "[]");
      const record = resets.find(r => r.token === token && r.expiresAt > Date.now());
      if (!record) return false;

      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
      const user = users.find(u => u.email.toLowerCase() === record.email.toLowerCase());
      if (!user) return false;

      const salt = "salt_" + Date.now();
      user.salt = salt;
      user.passwordHash = await hashPasswordClient(newPassword, salt);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

      // Clean token
      const updatedResets = resets.filter(r => r.token !== token);
      localStorage.setItem(LOCAL_RESETS_KEY, JSON.stringify(updatedResets));
      return true;
    } catch (e) {
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // 10. PROFILE MENU & UI SYNCHRONIZATION
  // --------------------------------------------------------------------------

  function setBtnLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    const label = btn.querySelector(".btn-label");
    const spinner = btn.querySelector(".btn-spinner");
    if (label) label.style.display = isLoading ? "none" : "";
    if (spinner) spinner.style.display = isLoading ? "" : "none";
  }

  function showAuthAlert(el, type, message) {
    if (!el) return;
    el.className = `auth-alert auth-alert-${type}`;
    el.innerHTML = message;
    el.style.display = "block";
  }

  function updateUserProfileUI(user) {
    if (!user) return;

    const initials = (user.name || "Alex Carter")
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AC";

    // 1. Topbar Profile Button
    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
      const avatarEl = profileBtn.querySelector(".avatar");
      const nameEl = profileBtn.querySelector("strong");
      const roleEl = profileBtn.querySelector("small");
      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl) nameEl.textContent = user.name;
      if (roleEl) roleEl.textContent = user.role || "Studio Owner";
    }

    // 2. Sidebar Studio Card
    const studioCard = document.querySelector(".sidebar .studio-card");
    if (studioCard) {
      const avatarEl = studioCard.querySelector(".avatar");
      const titleEl = studioCard.querySelector("strong");
      const subEl = studioCard.querySelector("small");
      if (avatarEl) {
        const studioInitials = (user.studioName || user.name)
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "FC";
        avatarEl.textContent = studioInitials;
      }
      if (titleEl) titleEl.textContent = user.studioName || "Frame Creative";
      if (subEl) subEl.textContent = user.name || "Studio Owner";
    }
  }

  function attachLogoutHandlers() {
    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
      profileBtn.onclick = (e) => {
        e.stopPropagation();
        toggleProfileMenu(profileBtn);
      };
    }
  }

  function toggleProfileMenu(anchorEl) {
    const existing = document.getElementById("profileDropdown");
    if (existing) {
      existing.remove();
      return;
    }

    const dropdown = document.createElement("div");
    dropdown.id = "profileDropdown";
    dropdown.className = "profile-dropdown";

    const user = currentUser || DEMO_USER;
    const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AC";

    dropdown.innerHTML = `
      <div class="profile-dropdown-head">
        <div class="avatar sm">${initials}</div>
        <div>
          <strong>${user.name}</strong>
          <small>${user.email}</small>
        </div>
      </div>
      <div class="profile-dropdown-divider"></div>
      <button class="profile-dropdown-item" id="navSettingsItem">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        <span>Studio Settings</span>
      </button>
      <button class="profile-dropdown-item text-danger" id="logoutActionBtn">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <span>Sign Out</span>
      </button>
    `;

    document.body.appendChild(dropdown);

    const rect = anchorEl.getBoundingClientRect();
    dropdown.style.position = "absolute";
    dropdown.style.top = `${rect.bottom + 8}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    dropdown.style.zIndex = "99999";

    const handleOutsideClick = (e) => {
      if (!dropdown.contains(e.target) && !anchorEl.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener("click", handleOutsideClick);
      }
    };
    setTimeout(() => document.addEventListener("click", handleOutsideClick), 50);

    document.getElementById("navSettingsItem")?.addEventListener("click", () => {
      dropdown.remove();
      window.location.hash = "#settings";
    });

    document.getElementById("logoutActionBtn")?.addEventListener("click", () => {
      dropdown.remove();
      logout();
    });
  }

  // --------------------------------------------------------------------------
  // 11. LOGOUT CONTROLLER
  // --------------------------------------------------------------------------

  async function logout() {
    try {
      if (authToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
          body: JSON.stringify({ token: authToken })
        });
      }
    } catch (e) {
      console.warn("[Auth] Logout API call:", e);
    }

    clearSession();

    if (typeof window.toast === "function") {
      window.toast("Signed Out", "You have been logged out of FRAME AI Studio.");
    }

    // Force redirection to #login
    window.location.hash = "#login";
    handleAuthRouting();
  }

  // --------------------------------------------------------------------------
  // 12. EXPOSE GLOBAL API
  // --------------------------------------------------------------------------

  window.FRAME_AUTH = {
    init: initAuth,
    isAuthenticated,
    getUser: () => currentUser,
    getToken: () => authToken,
    logout,
    checkRoute: handleAuthRouting,
    toggleProfileMenu
  };

  // Auto-init on DOMContentLoaded or immediate if already ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
  } else {
    initAuth();
  }

})();

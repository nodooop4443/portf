const authLinkLoggedOut = document.getElementById('auth-link-logged-out'); 
const authInfoLoggedIn = document.getElementById('auth-info-logged-in');   

// Dropdown ელემენტები
const userEmailDisplay = document.getElementById('user-email-display'); // Email ღილაკი
const logoutButton = document.getElementById('logout-button');           // Logout ღილაკი
const logoutDropdownContent = document.getElementById('logout-dropdown-content'); // Dropdown შიგთავსი

// რეგისტრაციის ფორმის ელემენტები
const registrationForm = document.getElementById('registrationForm'); 
const registerButton = document.getElementById('registerButton');

// შეტყობინებების ჩვენების ადგილი (თუ იყენებთ)
const authMessage = document.getElementById('auth-message');



window.addEventListener('load', ()=>{const loader=document.getElementById('site-loader');loader.style.opacity='0';setTimeout(()=>loader.remove(),600)});

document.querySelectorAll('nav a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}));

const io=new IntersectionObserver((entries)=>{entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('revealed');en.target.classList.remove('revealer');}})},{threshold:.12});
document.querySelectorAll('.revealer').forEach(el=>io.observe(el));

const lb=document.getElementById('lightbox');const lbImg=lb.querySelector('img');
document.querySelectorAll('[data-preview-open]').forEach(btn=>btn.addEventListener('click',e=>{const card=btn.closest('.project-card');const img=card.querySelector('.project-media img');lbImg.src=img.src;lb.classList.add('active');lb.setAttribute('aria-hidden','false')}));
lb.addEventListener('click',()=>{lb.classList.remove('active');lb.setAttribute('aria-hidden','true');lb.querySelector('img').src='';});

const form = document.getElementById('contactForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      alert('Message sent — we will reply shortly');
      form.reset();
    } else {
      alert('Problem sending message — try email');
    }

  } catch (err) {
    alert('Network error — email info@pixelwavestudio.com');
  }

  btn.disabled = false;
  btn.textContent = 'Send Message';
});

const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");

// Toggle menu
burger.addEventListener("click", (e) => {
  e.stopPropagation(); // არ მისცეს body-ს click-ის დაჭერა
  burger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

// Close when clicking a link
document.querySelectorAll("#nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  const clickedInsideMenu =
    navMenu.contains(e.target) || burger.contains(e.target);

  if (!clickedInsideMenu) {
    burger.classList.remove("active");
    navMenu.classList.remove("open");
  }
});

const revealers = document.querySelectorAll('.revealer');

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('revealed');
  });
});

revealers.forEach(r => observer.observe(r));






function showChatWidget() {
    if (typeof Tawk_API !== 'undefined' && Tawk_API.showWidget) {
        Tawk_API.showWidget();
        
        // Tawk.to-ს API-ს მეშვეობით მომხმარებლის იდენტიფიცირება
        auth.onAuthStateChanged((user) => {
            if (user) {
                Tawk_API.setAttributes({
                    'name': user.email,
                    'email': user.email
                }, function(error){});
            }
        });
    }
}

function hideChatWidget() {
    if (typeof Tawk_API !== 'undefined' && Tawk_API.hideWidget) {
        Tawk_API.hideWidget();
    }
}


// ====================================================================
// 3. ავთენტიფიკაციის ლოგიკა (რეგისტრაცია, გამოსვლა)
// ====================================================================

// --- რეგისტრაციის ლოგიკა ---
if (registerButton) { // ამოწმებს, არსებობს თუ არა ღილაკი
    registerButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = registrationForm.elements['email'].value;
        const password = registrationForm.elements['password'].value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert('Registration successful! Welcome.');
                // onAuthStateChanged განაახლებს UI-ს
            })
            .catch((error) => {
                alert(`Registration Error: ${error.message}`);
            });
    });
}

// --- გამოსვლის (Logout) ლოგიკა ---
if (logoutButton) { // ამოწმებს, არსებობს თუ არა ღილაკი
    logoutButton.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                alert("You have been logged out successfully.");
            })
            .catch((error) => {
                alert("Logout Error: " + error.message);
            });
    });
}


// ====================================================================
// 4. Dropdown-ის მართვის ლოგიკა
// ====================================================================

if (userEmailDisplay && logoutDropdownContent && authInfoLoggedIn) {
    // Dropdown-ის ჩვენება/დამალვა Email ღილაკზე დაჭერისას
    userEmailDisplay.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (logoutDropdownContent.style.display === 'block') {
            logoutDropdownContent.style.display = 'none';
        } else {
            logoutDropdownContent.style.display = 'block';
        }
    });

    // დამალეთ Dropdown, როდესაც მომხმარებელი სხვაგან აჭერს
    document.addEventListener('click', (event) => {
        const isClickInside = authInfoLoggedIn.contains(event.target);
        if (!isClickInside && logoutDropdownContent.style.display === 'block') {
            logoutDropdownContent.style.display = 'none';
        }
    });
}


// ====================================================================
// 5. Firebase სტატუსის შემმოწმებელი (UI-ს განახლება)
// ====================================================================

auth.onAuthStateChanged((user) => {
    if (user) {
        // --- ავტორიზებული მომხმარებელი ---
        
        // UI-ს ჩვენება/დამალვა
        if (authLinkLoggedOut) authLinkLoggedOut.style.display = 'none';
        if (authInfoLoggedIn) authInfoLoggedIn.style.display = 'flex'; 
        if (userEmailDisplay) userEmailDisplay.textContent = user.email; // Email-ის ჩვენება
        
        // ჩატის გააქტიურება
        showChatWidget(); 
        
        // შეტყობინების განახლება
        if (authMessage) {
            authMessage.textContent = `Welcome, ${user.email}! Chat is active.`;
            authMessage.style.color = 'green';
        }
        
    } else {
        // --- არაავტორიზებული მომხმარებელი ---
        
        // UI-ს ჩვენება/დამალვა
        if (authLinkLoggedOut) authLinkLoggedOut.style.display = 'block';
        if (authInfoLoggedIn) authInfoLoggedIn.style.display = 'none'; 
        
        // დარწმუნდით, რომ Dropdown-ი იმალება
        if (logoutDropdownContent) {
             logoutDropdownContent.style.display = 'none';
        }

        // ჩატის დამალვა
        hideChatWidget();
        
        // შეტყობინების განახლება
        if (authMessage) {
             authMessage.textContent = 'Please register or login to start chatting.';
             authMessage.style.color = 'gray';
        }
    }
});



// --- app.js-ის დასაწყისი, სხვა ცვლადების გვერდით ---

// მოდალის ელემენტები
const authModal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');
const authLink = document.getElementById('auth-link-logged-out'); // Register/Login ბმული

// ტაბების კონტროლი
const showLoginTab = document.getElementById('show-login-tab');
const showRegisterTab = document.getElementById('show-register-tab');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');

// შესვლის ფორმის ელემენტები
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('login-error');

// რეგისტრაციის შეცდომის ელემენტი
const registerError = document.getElementById('register-error');


// --- მოდალის გამოჩენა/დამალვა ---

// Register/Login ბმულზე დაჭერა აჩენს მოდალს
if (authLink) {
    authLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'block';
        loginError.textContent = ''; // შეცდომის გასუფთავება
        registerError.textContent = '';
    });
}

// დახურვის ღილაკზე დაჭერა
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });
}

// ფანჯრის გარეთ დაჭერა მალავს მოდალს
window.addEventListener('click', (event) => {
    if (event.target == authModal) {
        authModal.style.display = 'none';
    }
});

// --- ტაბებს შორის გადართვა ---

function switchTab(showLogin) {
    if (showLogin) {
        // აჩენს Login-ს, მალავს Register-ს
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        showLoginTab.classList.add('active-tab');
        showRegisterTab.classList.remove('active-tab');
    } else {
        // აჩენს Register-ს, მალავს Login-ს
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        showLoginTab.classList.remove('active-tab');
        showRegisterTab.classList.add('active-tab');
    }
    // შეცდომების გასუფთავება გადართვისას
    loginError.textContent = ''; 
    registerError.textContent = '';
}

if (showLoginTab) {
    showLoginTab.addEventListener('click', () => switchTab(true));
}
if (showRegisterTab) {
    showRegisterTab.addEventListener('click', () => switchTab(false));
}


// --- შესვლის (Login) ლოგიკა ---
if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = loginForm.elements['email'].value;
        const password = loginForm.elements['password'].value;
        
        loginError.textContent = ''; // შეცდომის გასუფთავება
        
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                // წარმატებული შესვლა
                authModal.style.display = 'none'; // მოდალის დახურვა
                // UI განახლდება auth.onAuthStateChanged-ის მეშვეობით
            })
            .catch((error) => {
                // შეცდომის ჩვენება
                loginError.textContent = `Error: ${error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ')}`;
            });
    });
}


// --- განახლებული რეგისტრაციის ლოგიკა ---
if (registerButton) {
    registerButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = registrationForm.elements['email'].value;
        const password = registrationForm.elements['password'].value;
        
        registerError.textContent = ''; // შეცდომის გასუფთავება

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert('Registration successful! Welcome.');
                authModal.style.display = 'none'; // მოდალის დახურვა
            })
            .catch((error) => {
                // შეცდომის ჩვენება
                registerError.textContent = `Error: ${error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ')}`;
            });
    });
}





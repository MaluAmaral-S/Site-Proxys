document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // LÓGICA DO MENU MOBILE PRINCIPAL
  // ==========================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navPanel = mobileMenu.querySelector('[data-panel]');
    const mobileNavLinks = mobileMenu.querySelectorAll('a');

    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        mobileOverlay.classList.add('opacity-100');
        navPanel.classList.remove('translate-x-full');
      }, 10);
    };
    const closeMenu = () => {
      mobileOverlay.classList.remove('opacity-100');
      navPanel.classList.add('translate-x-full');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    };
    mobileMenuBtn.addEventListener('click', openMenu);
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && !mobileMenu.classList.contains('hidden')) closeMenu(); });
  }

  // ==========================================================
  // LÓGICA DO MODAL DE LOCALIZAÇÕES (COM PREENCHIMENTO)
  // ==========================================================
  const showLocationsBtn = document.getElementById('show-all-locations');
  const locationsModal = document.getElementById('locations-modal');
  if (showLocationsBtn && locationsModal) {
    const closeLocationsBtn = document.getElementById('close-locations-modal');
    const modalOverlay = locationsModal.children[0];
    const locationsList = document.getElementById('locations-modal-list');

    const countries = [
        { code: "us", name: "Estados Unidos" }, { code: "br", name: "Brasil" }, { code: "ca", name: "Canadá" },
        { code: "gb", name: "Reino Unido" }, { code: "de", name: "Alemanha" }, { code: "jp", name: "Japão" },
        { code: "fr", name: "França" }, { code: "es", "name": "Espanha" }, { code: "it", name: "Itália" },
        { code: "ru", name: "Rússia" }, { code: "in", name: "Índia" }, { code: "cn", name: "China" },
        { code: "au", name: "Austrália" }, { code: "ar", name: "Argentina" }, { code: "mx", name: "México" },
        { code: "nl", name: "Holanda" }, { code: "tr", name: "Turquia" }, { code: "za", name: "África do Sul" },
        { code: "kr", name: "Coreia do Sul" }, { code: "se", name: "Suécia" }, { code: "no", name: "Noruega" },
        { code: "fi", name: "Finlândia" }, { code: "dk", name: "Dinamarca" }, { code: "pl", name: "Polônia" },
        { code: "ch", name: "Suíça" }, { code: "be", name: "Bélgica" }, { code: "pt", name: "Portugal" },
        { code: "cl", name: "Chile" }, { code: "co", name: "Colômbia" }, { code: "ua", name: "Ucrânia" },
        { code: "at", name: "Áustria" }, { code: "cz", name: "Tchéquia" }, { code: "ie", name: "Irlanda" },
        { code: "gr", name: "Grécia" }, { code: "hu", name: "Hungria" }, { code: "ro", name: "Romênia" },
        { code: "il", name: "Israel" }, { code: "ae", name: "Emirados Árabes" }, { code: "sg", name: "Singapura" },
        { code: "hk", name: "Hong Kong" }, { code: "nz", name: "Nova Zelândia" }, { code: "th", name: "Tailândia" }
    ];

    const renderCountries = () => {
        if (!locationsList) return;
        const countriesHTML = countries.map(country => `
            <div class="bg-white/5 ring-1 ring-white/10 p-4 rounded-lg flex items-center gap-3 text-slate-200">
                <span class="fi fi-${country.code} text-2xl"></span>
                <span class="font-medium">${country.name}</span>
            </div>
        `).join('');
        locationsList.innerHTML = countriesHTML;
    };

    const openModal = () => {
      renderCountries();
      locationsModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      locationsModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    showLocationsBtn.addEventListener('click', openModal);
    closeLocationsBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && !locationsModal.classList.contains('hidden')) closeModal(); });
  }

  // ==========================================================
  // LÓGICA DO FAQ
  // ==========================================================
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector("i");
      answer.classList.toggle("hidden");
      icon.classList.toggle("bx-chevron-down");
      icon.classList.toggle("bx-chevron-up");
    });
  });

  // ==========================================================
  // ANIMAÇÕES DE SCROLL
  // ==========================================================
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  if (animatedElements.length) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => scrollObserver.observe(el));
  }
  
  // ==========================================================
  // FUNÇÃO PARA CONFIGURAR O OBSERVER DA NAVBAR ATIVA
  // ==========================================================
  function setupNavObserver() {
    const navLinks = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    if (navLinks.length && sections.length) {
        const linkById = new Map(navLinks.map(a => [a.getAttribute('href').replace('#',''), a]));

        const activate = (id) => {
            navLinks.forEach(l => l.classList.remove('is-active'));
            const link = linkById.get(id);
            if (link) {
                link.classList.add('is-active');
            }
        };

        const navObserver = new IntersectionObserver((entries) => {
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            if (visibleEntries.length > 0) {
                const lastVisibleEntry = visibleEntries[visibleEntries.length - 1];
                activate(lastVisibleEntry.target.id);
            }
        }, { 
            root: null,
            threshold: 0.1,
            rootMargin: '-80px 0px -80% 0px'
        });

        sections.forEach(sec => navObserver.observe(sec));
    }
  }

  // ==========================================================
  // INICIALIZAÇÃO DE TODAS AS FUNÇÕES
  // ==========================================================
  
  setupNavObserver();

});
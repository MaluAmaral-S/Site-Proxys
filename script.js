document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // VARIÁVEIS E DADOS GLOBAIS
  // ==========================================================
  const fmtBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  
  const PRICING = {
    ipv4_dc: { name: 'Datacenter IPv4', icon: 'bx-chip', unit: 0.25, blurb: 'IPs de datacenter de protocolo IPv4' },
    ipv6_dc: { name: 'Datacenter IPv6', icon: 'bx-chip', unit: 0.12, blurb: 'IPs de datacenter de protocolo IPv6' },
    res_static: { name: 'Residenciais estáticos', icon: 'bx-home', unit: 1.20, blurb: 'IPs comerciais reais para uso contínuo' },
    res_ipv6_static: { name: 'IPv6 residenciais estáticos', icon: 'bx-home', unit: 0.90, blurb: 'Trilhões de IPs estáticos de ISP' },
    res_rot: { name: 'Residenciais rotativos', icon: 'bx-recycle', unit: 1.80, blurb: 'Pool residencial com rotação automática' },
    mobile_static: { name: 'Móveis estáticos', icon: 'bx-mobile', unit: 1.50, blurb: 'Proxy móvel estático rápido (3G/4G/5G)' },
    mobile_rot: { name: 'Móveis rotativos', icon: 'bx-mobile', unit: 2.40, blurb: 'Rede móvel com troca dinâmica de IP' },
  };
  const PLAN_QUANTITIES = [25, 50, 100, 200, 500, 1000];
  const PROXY_BENEFITS = {
    ipv4_dc: ['Alta compatibilidade com serviços', 'Baixa latência para automação', 'IPs dedicados estáveis'],
    ipv6_dc: ['Custo por IP mais baixo', 'Ideal para grandes volumes', 'Protocolo moderno (IPv6)'],
    res_static: ['IPs residenciais de longa duração', 'Excelente reputação e confiabilidade', 'Ideal para contas e validações'],
    res_ipv6_static: ['Grande disponibilidade de IPs', 'Menor custo em IPv6 residencial', 'Bom para testes em massa'],
    res_rot: ['Rotação automática de IP', 'Alta taxa de sucesso em scraping', 'Adequado para sites anti-bot'],
    mobile_static: ['IPs de operadoras móveis', 'Ótimo para redes sociais', 'Melhor taxa de entrega de SMS'],
    mobile_rot: ['Troca dinâmica de IP móvel', 'Excelente para gestão de múltiplas contas', 'Alta tolerância a bloqueios'],
  };
  const TERM_DISCOUNT = { 1: 0, 3: 0.05, 12: 0.15 };

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
  // LÓGICA DO FILTRO DE PLANOS (MOBILE/TABLET)
  // ==========================================================
  const planFilterTrigger = document.getElementById('plan-filter-trigger');
  const planFilterMobileContainer = document.getElementById('plan-filter-mobile');
  if (planFilterTrigger && planFilterMobileContainer) {
    planFilterTrigger.addEventListener('click', () => {
      planFilterMobileContainer.classList.toggle('is-open');
    });
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
        { code: "fr", name: "França" }, { code: "es", name: "Espanha" }, { code: "it", name: "Itália" },
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
  // LÓGICA DOS PLANOS
  // ==========================================================
  function animateValue(element, start, end, duration, formatter) {
    if (element.intervalId) clearInterval(element.intervalId);
    let current = start;
    const range = end - start;
    if (range === 0) { element.textContent = formatter.format(end); return; }
    const step = Math.sign(range) * Math.max(1, Math.round(Math.abs(range) / 100));
    const stepTime = Math.max(1, duration / (Math.abs(range) / Math.abs(step)));
    element.intervalId = setInterval(() => {
      current += step;
      if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
        current = end;
        clearInterval(element.intervalId);
      }
      element.textContent = formatter.format(current);
    }, stepTime);
  }

  function calcPriceMonthly(typeKey, qty, months = 1) {
    const type = PRICING[typeKey];
    if (!type) return 0;
    const base = type.unit * qty * months;
    const disc = TERM_DISCOUNT[months] || 0;
    return base * (1 - disc);
  }

  function renderPlanFilterTabs() {
    const tabs = document.getElementById('plan-filter-tabs');
    const fixed = document.getElementById('fixed-plans');
    const custom = document.getElementById('custom-planner');
    if (!tabs || !fixed || !custom) return;

    const types = Object.entries(PRICING);
    tabs.innerHTML = [
      ...types.map(([key, meta], idx) => `<button class="tab-btn ${idx === 0 ? 'is-active' : ''}" data-type="${key}"><i class='bx ${meta.icon}'></i> ${meta.name}</button>`),
      `<button class="tab-btn" data-type="__custom__"><i class='bx bx-slider-alt'></i> Personalizado</button>`
    ].join('');

    const activateType = (typeKey) => {
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
      const btn = tabs.querySelector(`.tab-btn[data-type="${typeKey}"]`);
      if (btn) btn.classList.add('is-active');
      
      const currentFilter = document.getElementById('plan-filter-current');
      if(currentFilter) currentFilter.textContent = btn ? btn.textContent.trim() : 'Selecionar tipo';

      if (typeKey === '__custom__') {
        fixed.classList.add('hidden');
        custom.classList.remove('hidden');
      } else {
        custom.classList.add('hidden');
        fixed.classList.remove('hidden');
        renderFixedPlans(typeKey);
      }
      if (planFilterMobileContainer) planFilterMobileContainer.classList.remove('is-open');
    };
    tabs.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => activateType(btn.dataset.type)));
    const firstType = types[0]?.[0];
    if (firstType) activateType(firstType);
  }

  function renderFixedPlans(filterTypeKey) {
    const mount = document.getElementById('fixed-plans');
    if (!mount) return;
    const [key, meta] = Object.entries(PRICING).find(([k]) => k === filterTypeKey) || [];
    if (!key) { mount.innerHTML = ''; return; }

    mount.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${PLAN_QUANTITIES.map(qty => `
          <div class="plan-type-card">
            <div class="flex items-center gap-3 mb-2">
              <i class='bx ${meta.icon} text-emerald-400 text-2xl'></i>
              <h3 class="text-lg font-semibold">${meta.name}</h3>
            </div>
            
            <p class="font-bold text-xl text-emerald-400 mb-4">${qty} Proxies</p>

            <ul class="text-slate-300 text-sm mb-4 list-none space-y-2 flex-grow">
              ${(PROXY_BENEFITS[key] || []).map(b => `<li class="flex items-center gap-2"><i class='bx bx-check text-emerald-400'></i><span>${b}</span></li>`).join('')}
            </ul>

            <div class="mt-auto">
                <div class="mb-4">
                  <div class="inline-flex bg-white/5 border border-white/10 rounded-lg overflow-hidden text-sm">
                    <button class="duration-btn px-4 py-2" data-months="1">1 mês</button>
                    <button class="duration-btn px-4 py-2" data-months="3">3 meses</button>
                    <button class="duration-btn px-4 py-2" data-months="12">12 meses</button>
                  </div>
                </div>

                <div class="text-center mb-4">
                  <div class="text-slate-400 text-xs">Total</div>
                  <div class="font-extrabold text-2xl plan-price" data-type="${key}" data-qty="${qty}">${fmtBRL.format(calcPriceMonthly(key, qty, 1))}</div>
                </div>
                
                <button class="btn-primary buy-btn w-full" data-type="${key}" data-qty="${qty}" data-months="1">Contratar</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    mount.querySelectorAll('.plan-type-card').forEach(card => {
      const priceEl = card.querySelector('.plan-price');
      const type = priceEl.dataset.type;
      const qty = Number(priceEl.dataset.qty);
      const buttons = card.querySelectorAll('.duration-btn');
      const buyBtn = card.querySelector('.buy-btn');
      const setActive = (selMonths) => {
        buttons.forEach(b => {
          const active = Number(b.dataset.months) === selMonths;
          b.classList.toggle('bg-emerald-400', active);
          b.classList.toggle('text-slate-950', active);
          b.classList.toggle('font-semibold', active);
        });
        priceEl.textContent = fmtBRL.format(calcPriceMonthly(type, qty, selMonths));
        buyBtn.dataset.months = String(selMonths);
      };
      setActive(1);
      buttons.forEach(btn => btn.addEventListener('click', () => setActive(Number(btn.dataset.months))));
    });
  }

  function updateCustomPlannerPrice() {
      const typeEl = document.getElementById('cp-type');
      if(!typeEl) return;
      const typeKey = typeEl.value;
      const qty = Math.max(1, parseInt(document.getElementById('cp-qty').value || '1', 10));
      const months = parseInt(document.getElementById('cp-term').value, 10);
      const unit = PRICING[typeKey]?.unit || 0;
      const discountPct = TERM_DISCOUNT[months] || 0;
      const subtotal = unit * qty * months;
      const total = subtotal * (1 - discountPct);
      document.getElementById('cp-unit').textContent = fmtBRL.format(unit);
      document.getElementById('cp-subtotal').textContent = fmtBRL.format(subtotal);
      document.getElementById('cp-discount').textContent = `${Math.round(discountPct * 100)}%`;
      const totalEl = document.getElementById('cp-total');
      const current = parseFloat((totalEl.textContent || '0').replace(/[^0-9,-]+/g,"").replace(',','.')) || 0;
      animateValue(totalEl, current, total, 300, { format(v){ return fmtBRL.format(v); } });
  }

  function wireCustomPlanner() {
    const ids = ['cp-type','cp-country','cp-qty','cp-term'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.addEventListener('input', updateCustomPlannerPrice);
    });
    updateCustomPlannerPrice();
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
            rootMargin: '-80px 0px -25% 0px'
        });

        sections.forEach(sec => navObserver.observe(sec));
    }
  }

  // ==========================================================
  // LÓGICA DO SCROLLBAR CUSTOMIZADO
  // ==========================================================
  function setupCustomScrollbar() {
    const plansContainer = document.getElementById('fixed-plans');
    const scrollbarThumb = document.getElementById('plans-scrollbar-thumb');
    const scrollbar = document.getElementById('plans-scrollbar');

    if (!plansContainer || !scrollbarThumb || !scrollbar) {
      return; // Se os elementos não existirem, não faz nada
    }

    const updateThumb = () => {
      const scrollLeft = plansContainer.scrollLeft;
      const scrollWidth = plansContainer.scrollWidth;
      const clientWidth = plansContainer.clientWidth;

      if (scrollWidth <= clientWidth) {
        scrollbar.style.display = 'none';
        return;
      }
      
      scrollbar.style.display = 'block';

      const thumbWidth = (clientWidth / scrollWidth) * 100;
      const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * (100 - thumbWidth);

      scrollbarThumb.style.width = `${thumbWidth}%`;
      scrollbarThumb.style.transform = `translateX(${thumbPosition}%)`;
    };

    plansContainer.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    
    // Usamos um observer para chamar o updateThumb quando os cards forem renderizados
    const observer = new MutationObserver(() => {
        updateThumb();
    });
    observer.observe(plansContainer, { childList: true });

    // Chamada inicial
    updateThumb();
  }

  // ==========================================================
  // INICIALIZAÇÃO DE TODAS AS FUNÇÕES
  // ==========================================================
  
  renderPlanFilterTabs();
  wireCustomPlanner();
  setupNavObserver();
  setupCustomScrollbar(); // Ativando a nova função

});
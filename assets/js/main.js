/**
 * Main Interactive Script - Portafolio Jonatan Alpirez
 * Carga todo el contenido dinámicamente desde ./data/portfolio.json
 */

const DATA_URL = './data/portfolio.json';

/**
 * Crea un elemento DOM de forma segura.
 */
function createEl(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === 'className') {
      node.className = value;
    } else if (key === 'textContent') {
      node.textContent = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(node.style, value);
    } else if (key.startsWith('data-')) {
      node.setAttribute(key, value);
    } else {
      node.setAttribute(key, value);
    }
  });

  const list = Array.isArray(children) ? children : [children];
  list.forEach((child) => {
    if (child === null || child === undefined) return;
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  });

  return node;
}

/**
 * Valida URLs para permitir solo rutas relativas seguras, hashes y HTTP(S)/mailto.
 */
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed;
  }
  return '#';
}

/**
 * Renderiza texto con soporte seguro para **negritas** y *cursivas* sin usar innerHTML.
 */
function appendFormattedText(parent, text) {
  if (!text) return;
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parent.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parent.appendChild(createEl('strong', { textContent: token.slice(2, -2) }));
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parent.appendChild(createEl('em', { textContent: token.slice(1, -1) }));
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parent.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
}

function createBrandContent(brand) {
  return [
    createEl('span', { className: 'brand-bracket', textContent: '<' }),
    document.createTextNode(brand.firstName || ''),
    createEl('span', { className: 'brand-dot', textContent: '.' }),
    document.createTextNode(brand.lastName || ''),
    createEl('span', { className: 'brand-bracket', textContent: ' />' })
  ];
}

function createSectionHeader(section) {
  const titleEl = createEl('h2', { className: 'section-title' }, [
    document.createTextNode(`${section.titlePrefix || ''} `),
    createEl('span', { className: 'gradient-text', textContent: section.titleHighlight || '' })
  ]);

  return createEl('div', { className: 'section-header' }, [
    createEl('span', { className: 'section-tag', textContent: section.tag || '' }),
    titleEl,
    createEl('p', { className: 'section-subtitle', textContent: section.subtitle || '' })
  ]);
}

function updateMetadata(meta = {}) {
  if (meta.title) document.title = meta.title;

  const mappings = [
    ['meta[name="description"]', meta.description],
    ['meta[name="keywords"]', meta.keywords],
    ['meta[name="author"]', meta.author],
    ['meta[property="og:title"]', meta.title],
    ['meta[property="og:description"]', meta.description]
  ];

  mappings.forEach(([selector, content]) => {
    if (!content) return;
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute('content', content);
  });
}

function renderHeader(data) {
  const brandEl = document.getElementById('nav-brand');
  const navMenuEl = document.getElementById('nav-menu');
  const navCtaEl = document.getElementById('nav-cta');
  const mobileMenuEl = document.getElementById('mobile-menu');

  if (brandEl && data.brand) {
    brandEl.replaceChildren(...createBrandContent(data.brand));
  }

  if (navCtaEl && data.brand) {
    navCtaEl.setAttribute('href', sanitizeUrl(data.brand.ctaHref || '#contacto'));
    navCtaEl.replaceChildren(
      createEl('i', { className: 'fa-regular fa-paper-plane' }),
      document.createTextNode(` ${data.brand.ctaLabel || 'Hablemos'}`)
    );
  }

  const navItems = data.navigation || [];
  if (navMenuEl) {
    navMenuEl.replaceChildren(
      ...navItems.map((item) =>
        createEl('a', {
          href: sanitizeUrl(item.href),
          className: 'nav-link',
          textContent: item.label
        })
      )
    );
  }

  if (mobileMenuEl) {
    mobileMenuEl.replaceChildren(
      ...navItems.map((item) =>
        createEl('a', {
          href: sanitizeUrl(item.href),
          className: 'mobile-nav-link',
          textContent: item.mobileLabel || item.label
        })
      )
    );
  }
}

function renderHero(data) {
  const container = document.getElementById('hero-container');
  if (!container || !data.hero) return;

  const { hero, profile = {} } = data;
  const email = profile.email || '';

  const infoCol = createEl('div', { className: 'hero-content' }, [
    createEl('div', { className: 'hero-badge-wrap' }, [
      createEl('span', { className: 'status-badge' }, [
        createEl('span', { className: 'status-pulse' }),
        document.createTextNode(` ${hero.status || ''}`)
      ])
    ]),
    createEl('h1', { className: 'hero-title' }, [
      document.createTextNode(`${hero.greeting || ''} `),
      createEl('br'),
      createEl('span', { className: 'gradient-text', textContent: hero.name || '' })
    ]),
    createEl('div', { className: 'hero-subtitle' }, [
      createEl('i', { className: hero.subtitleIcon || 'fa-solid fa-code' }),
      document.createTextNode(` ${hero.subtitle || ''}`)
    ]),
    createEl('p', { className: 'hero-description', textContent: hero.description || '' }),
    createEl('div', { className: 'hero-actions' }, [
      hero.primaryButton
        ? createEl('a', { href: sanitizeUrl(hero.primaryButton.href), className: 'btn btn-primary' }, [
            createEl('i', { className: hero.primaryButton.icon || 'fa-solid fa-rocket' }),
            document.createTextNode(` ${hero.primaryButton.label}`)
          ])
        : null,
      hero.secondaryButton
        ? createEl('a', { href: sanitizeUrl(hero.secondaryButton.href), className: 'btn btn-outline' }, [
            createEl('i', { className: hero.secondaryButton.icon || 'fa-regular fa-envelope' }),
            document.createTextNode(` ${hero.secondaryButton.label}`)
          ])
        : null,
      createEl(
        'button',
        {
          type: 'button',
          className: 'btn btn-ghost copy-email-btn',
          'data-email': email,
          title: 'Copiar correo al portapapeles'
        },
        [
          createEl('i', { className: 'fa-regular fa-copy' }),
          document.createTextNode(` ${hero.copyEmailLabel || 'Copiar Correo'}`)
        ]
      )
    ]),
    createEl('div', { className: 'hero-socials' }, [
      createEl('span', { className: 'social-label', textContent: hero.socialsLabel || 'Conéctate:' }),
      createEl(
        'div',
        { className: 'social-links' },
        (hero.socials || []).map((social) => {
          const attrs = {
            href: sanitizeUrl(social.href),
            className: 'social-btn',
            title: social.title
          };
          if (social.external) {
            attrs.target = '_blank';
            attrs.rel = 'noopener noreferrer';
          }
          return createEl('a', attrs, [createEl('i', { className: social.icon })]);
        })
      )
    ])
  ]);

  const avatarChildren = [
    createEl('div', { className: 'avatar-backdrop-glow' }),
    createEl('div', { className: 'avatar-ring' }, [
      createEl('img', {
        src: sanitizeUrl(hero.avatar?.src || './assets/img/jonatan.jpg'),
        alt: hero.avatar?.alt || 'Foto de perfil',
        className: 'avatar-img'
      })
    ]),
    ...(hero.floatingBadges || []).slice(0, 3).map((badge, idx) =>
      createEl('div', { className: `floating-badge badge-pos-${idx + 1}` }, [
        createEl('i', {
          className: badge.icon,
          style: badge.color ? { color: badge.color } : undefined
        }),
        createEl('span', { textContent: badge.label })
      ])
    )
  ];

  const visualCol = createEl('div', { className: 'hero-visual' }, [
    createEl('div', { className: 'avatar-wrapper' }, avatarChildren)
  ]);

  const statsRibbon = createEl(
    'div',
    { className: 'stats-ribbon' },
    (hero.stats || []).map((stat) =>
      createEl('div', { className: 'stat-item' }, [
        createEl('span', { className: 'stat-number', textContent: stat.number }),
        createEl('span', { className: 'stat-label', textContent: stat.label })
      ])
    )
  );

  container.replaceChildren(
    createEl('div', { className: 'hero-grid' }, [infoCol, visualCol]),
    statsRibbon
  );
}

function renderAbout(data) {
  const container = document.getElementById('about-container');
  if (!container || !data.about) return;

  const { about } = data;

  const paragraphs = (about.paragraphs || []).map((text) => {
    const p = createEl('p', { className: 'about-p' });
    appendFormattedText(p, text);
    return p;
  });

  const metaList = createEl(
    'div',
    { className: 'about-meta-list' },
    (about.metaItems || []).map((item) =>
      createEl('div', { className: 'about-meta-item' }, [
        createEl('div', { className: 'about-meta-icon' }, [
          createEl('i', { className: item.icon })
        ]),
        createEl('div', { className: 'about-meta-content' }, [
          createEl('span', { className: 'meta-title', textContent: item.title }),
          createEl('span', { className: 'meta-value', textContent: item.value })
        ])
      ])
    )
  );

  const bioCard = createEl('div', { className: 'about-bio-card' }, [...paragraphs, metaList]);

  const valueCards = createEl(
    'div',
    { className: 'value-cards' },
    (about.pillars || []).map((pillar) =>
      createEl('div', { className: 'value-card' }, [
        createEl('div', { className: 'value-icon-box' }, [
          createEl('i', { className: pillar.icon })
        ]),
        createEl('div', { className: 'value-content' }, [
          createEl('h4', { textContent: pillar.title }),
          createEl('p', { textContent: pillar.description })
        ])
      ])
    )
  );

  container.replaceChildren(
    createSectionHeader(about),
    createEl('div', { className: 'about-grid' }, [bioCard, valueCards])
  );
}

function renderSkills(data) {
  const container = document.getElementById('skills-container');
  if (!container || !data.skills) return;

  const { skills } = data;
  const grid = createEl(
    'div',
    { className: 'skills-grid' },
    (skills.categories || []).map((category) =>
      createEl('div', { className: 'skill-category-card' }, [
        createEl('div', { className: 'category-header' }, [
          createEl('i', { className: `${category.icon} category-icon` }),
          createEl('h3', { className: 'category-title', textContent: category.title })
        ]),
        createEl(
          'div',
          { className: 'skills-pill-list' },
          (category.items || []).map((skill) =>
            createEl('div', { className: 'skill-item' }, [
              createEl('span', { className: 'skill-name' }, [
                createEl('i', {
                  className: skill.icon,
                  style: skill.color ? { color: skill.color } : undefined
                }),
                document.createTextNode(` ${skill.name}`)
              ]),
              createEl('span', { className: 'skill-badge', textContent: skill.badge })
            ])
          )
        )
      ])
    )
  );

  container.replaceChildren(createSectionHeader(skills), grid);
}

function renderProjects(data) {
  const container = document.getElementById('projects-container');
  if (!container || !data.projects) return;

  const { projects } = data;
  const items = projects.items || [];

  const filterBar = createEl(
    'div',
    { className: 'projects-filter-bar' },
    (projects.filters || []).map((filter, idx) => {
      const count =
        filter.key === 'all'
          ? items.length
          : items.filter((item) => item.category === filter.key).length;

      return createEl('button', {
        type: 'button',
        className: idx === 0 ? 'filter-btn active' : 'filter-btn',
        'data-filter': filter.key,
        textContent: `${filter.label} (${count})`
      });
    })
  );

  const grid = createEl(
    'div',
    { className: 'projects-grid' },
    items.map((item) => {
      const descEl = createEl('p', { className: 'project-desc' });
      appendFormattedText(descEl, item.description);

      return createEl(
        'article',
        { className: 'project-card project-item', 'data-category': item.category },
        [
          createEl('div', { className: 'project-img-wrapper' }, [
            createEl('span', { className: 'project-badge-type' }, [
              createEl('i', { className: item.badgeIcon || 'fa-solid fa-folder' }),
              document.createTextNode(` ${item.badgeLabel || ''}`)
            ]),
            createEl('img', {
              src: sanitizeUrl(item.image),
              alt: item.imageAlt || item.title,
              className: 'project-img'
            })
          ]),
          createEl('div', { className: 'project-body' }, [
            createEl('h3', { className: 'project-title', textContent: item.title }),
            descEl,
            createEl(
              'div',
              { className: 'project-tags' },
              (item.tags || []).map((tag) =>
                createEl('span', { className: 'tech-tag', textContent: tag })
              )
            ),
            createEl(
              'div',
              { className: 'project-actions' },
              (item.links || []).map((link) => {
                const variant = link.variant || 'outline';
                return createEl(
                  'a',
                  {
                    href: sanitizeUrl(link.href),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: `btn btn-sm btn-${variant}`
                  },
                  [
                    createEl('i', { className: link.icon }),
                    document.createTextNode(` ${link.label}`)
                  ]
                );
              })
            )
          ])
        ]
      );
    })
  );

  container.replaceChildren(createSectionHeader(projects), filterBar, grid);
}

function renderEducation(data) {
  const container = document.getElementById('education-container');
  if (!container || !data.education) return;

  const { education } = data;
  const timeline = createEl(
    'div',
    { className: 'timeline-wrapper' },
    (education.items || []).map((item) =>
      createEl('div', { className: 'timeline-item' }, [
        createEl('div', { className: 'timeline-marker' }),
        createEl('div', { className: 'timeline-card' }, [
          createEl('div', { className: 'timeline-header' }, [
            createEl('div', {}, [
              createEl('h3', { className: 'timeline-role', textContent: item.role }),
              createEl('div', { className: 'timeline-institution', textContent: item.institution })
            ]),
            createEl('span', { className: 'timeline-badge', textContent: item.period })
          ]),
          createEl('p', { className: 'timeline-desc', textContent: item.description })
        ])
      ])
    )
  );

  container.replaceChildren(createSectionHeader(education), timeline);
}

function renderContact(data) {
  const container = document.getElementById('contact-container');
  if (!container || !data.contact) return;

  const { contact, profile = {} } = data;
  const email = profile.email || '';
  const formCfg = contact.form || {};

  const infoCard = createEl('div', { className: 'contact-info-card' }, [
    createEl('h3', { className: 'contact-info-title', textContent: contact.cardTitle }),
    createEl('p', { className: 'contact-info-desc', textContent: contact.cardDescription }),
    createEl(
      'div',
      { className: 'contact-methods' },
      (contact.methods || []).map((method) => {
        let valueNode;
        if (method.href) {
          const linkAttrs = {
            href: sanitizeUrl(method.href),
            className: 'method-link',
            textContent: method.value
          };
          if (method.external) {
            linkAttrs.target = '_blank';
            linkAttrs.rel = 'noopener noreferrer';
          }
          valueNode = createEl('a', linkAttrs);
        } else {
          valueNode = createEl('span', { className: 'method-link', textContent: method.value });
        }

        return createEl('div', { className: 'contact-method-item' }, [
          createEl('div', { className: 'method-icon' }, [
            createEl('i', { className: method.icon })
          ]),
          createEl('div', { className: 'method-details' }, [
            createEl('span', { className: 'method-label', textContent: method.label }),
            valueNode
          ])
        ]);
      })
    ),
    createEl(
      'button',
      {
        type: 'button',
        className: 'btn btn-outline copy-email-btn',
        'data-email': email,
        style: { width: '100%' }
      },
      [
        createEl('i', { className: 'fa-regular fa-copy' }),
        document.createTextNode(` ${contact.copyButtonLabel || 'Copiar mi correo al portapapeles'}`)
      ]
    )
  ]);

  const form = createEl('form', { id: 'contact-form', novalidate: '' }, [
    createEl('div', { className: 'form-group' }, [
      createEl('label', { for: 'name', className: 'form-label', textContent: formCfg.nameLabel || 'Nombre completo *' }),
      createEl('input', {
        type: 'text',
        id: 'name',
        name: 'name',
        className: 'form-control',
        placeholder: formCfg.namePlaceholder || '',
        required: ''
      })
    ]),
    createEl('div', { className: 'form-group' }, [
      createEl('label', { for: 'email', className: 'form-label', textContent: formCfg.emailLabel || 'Correo electrónico *' }),
      createEl('input', {
        type: 'email',
        id: 'email',
        name: 'email',
        className: 'form-control',
        placeholder: formCfg.emailPlaceholder || '',
        required: ''
      })
    ]),
    createEl('div', { className: 'form-group' }, [
      createEl('label', { for: 'subject', className: 'form-label', textContent: formCfg.subjectLabel || 'Asunto' }),
      createEl('input', {
        type: 'text',
        id: 'subject',
        name: 'subject',
        className: 'form-control',
        placeholder: formCfg.subjectPlaceholder || ''
      })
    ]),
    createEl('div', { className: 'form-group' }, [
      createEl('label', { for: 'message', className: 'form-label', textContent: formCfg.messageLabel || 'Mensaje *' }),
      createEl('textarea', {
        id: 'message',
        name: 'message',
        className: 'form-control',
        rows: '5',
        placeholder: formCfg.messagePlaceholder || '',
        required: ''
      })
    ]),
    createEl('button', { type: 'submit', className: 'btn btn-primary', style: { width: '100%' } }, [
      createEl('i', { className: 'fa-regular fa-paper-plane' }),
      document.createTextNode(` ${formCfg.submitLabel || 'Enviar Mensaje'}`)
    ]),
    createEl('div', { id: 'form-status', className: 'form-status', role: 'alert' })
  ]);

  const formWrapper = createEl('div', { className: 'contact-form-wrapper' }, [form]);

  container.replaceChildren(
    createSectionHeader(contact),
    createEl('div', { className: 'contact-grid' }, [infoCard, formWrapper])
  );
}

function renderFooter(data) {
  const container = document.getElementById('footer-container');
  if (!container || !data.footer) return;

  const { footer, brand = {}, navigation = [] } = data;

  const footerTop = createEl('div', { className: 'footer-top' }, [
    createEl('div', { className: 'footer-brand' }, [
      createEl('a', { href: '#hero', className: 'nav-brand' }, createBrandContent(brand)),
      createEl('p', { textContent: footer.description || '' })
    ]),
    createEl(
      'nav',
      { className: 'footer-nav', 'aria-label': 'Navegación del pie de página' },
      navigation.map((item) =>
        createEl('a', {
          href: sanitizeUrl(item.href),
          className: 'footer-link',
          textContent: item.label
        })
      )
    )
  ]);

  const footerBottom = createEl('div', { className: 'footer-bottom' }, [
    createEl('div', { className: 'footer-copy', textContent: footer.copyright || '' }),
    createEl('div', { className: 'footer-note', textContent: footer.note || '' })
  ]);

  container.replaceChildren(footerTop, footerBottom);
}

function renderLoadError(error) {
  const container = document.getElementById('hero-container');
  if (!container) return;

  const hint =
    window.location.protocol === 'file:'
      ? 'Abriste index.html directamente desde el disco (file://). Inicia el servidor local con "npm run dev" y abre http://localhost:8000.'
      : `Verifica que el archivo data/portfolio.json exista y tenga formato JSON válido. (${error.message})`;

  container.replaceChildren(
    createEl('div', { className: 'about-bio-card' }, [
      createEl('h2', { className: 'section-title', textContent: 'No se pudo cargar el contenido' }),
      createEl('p', { className: 'about-p', textContent: hint })
    ])
  );
}

function initInteractions(data) {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const backToTopBtn = document.getElementById('back-to-top');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast-notice');

  const targetEmail = data.profile?.email || 'jonatan.alpirez@gmail.com';
  const defaultSubject = data.contact?.form?.defaultSubject || 'Contacto desde Portafolio Web';
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.replaceChildren(
      createEl('i', { className: 'fa-solid fa-circle-check' }),
      createEl('span', { textContent: message })
    );
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 1. Sticky Navbar & Scroll Spy
  function handleScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 450);
    }

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  if (navToggle && mobileMenu) {
    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.replaceChildren(createEl('i', { className: 'fa-solid fa-bars' }));
    }

    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.replaceChildren(
        createEl('i', { className: isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars' })
      );
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        navbar &&
        !navbar.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        mobileMenu.classList.contains('open')
      ) {
        closeMobileMenu();
      }
    });
  }

  // 3. Back to Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Project Category Filter (cancela timers previos para evitar estados inconsistentes)
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          clearTimeout(card._filterTimer);
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card._filterTimer = setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            card._filterTimer = setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 5. Copy Email to Clipboard
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || targetEmail;
      navigator.clipboard
        .writeText(email)
        .then(() => showToast(`Correo copiado: ${email}`))
        .catch(() => showToast('Error al copiar correo'));
    });
  });

  // 6. Contact Form Submission
  if (contactForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const subject = document.getElementById('subject')?.value.trim() || defaultSubject;
      const message = document.getElementById('message')?.value.trim() || '';

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Por favor completa todos los campos requeridos.';
        }
        return;
      }

      if (!emailPattern.test(email)) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Por favor ingresa un correo electrónico válido.';
        }
        return;
      }

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hola,\n\nMi nombre es ${name} (${email}).\n\nMensaje:\n${message}`
      )}`;

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.textContent =
          '¡Gracias por contactarme! Abriendo tu cliente de correo para enviar el mensaje...';
      }

      showToast('¡Listo! Abriendo cliente de correo...');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }
}

function scrollToInitialHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView({ behavior: 'auto' });
  }
}

async function initPortfolio() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    updateMetadata(data.meta);
    renderHeader(data);
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderProjects(data);
    renderEducation(data);
    renderContact(data);
    renderFooter(data);

    initInteractions(data);
    scrollToInitialHash();
  } catch (error) {
    console.error('Error cargando data/portfolio.json:', error);
    renderLoadError(error);
  }
}

document.addEventListener('DOMContentLoaded', initPortfolio);

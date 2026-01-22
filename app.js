import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const container = document.getElementById('main-container');
    const bg = document.getElementById('main-bg');
    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const btnSite = document.getElementById('btn-site');
    const btnDemo = document.getElementById('btn-demo-trigger');
    const modal = document.getElementById('demo-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const demoForm = document.getElementById('demo-form');
    const htmlElement = document.documentElement;

    let currentLang = 'EN';
    let isDark = true;


    const bgImageUrl = 'https://r2-bucket.flowith.net/f/e08a497b5fb7d9e0/cyber_organic_neural_swarm_background_index_0%404096x2286.jpeg';
    const bgImage = new Image();
    bgImage.src = bgImageUrl;
    bgImage.onload = () => {
        gsap.to(bg, { opacity: 1, duration: 1.5, ease: "power2.out" });
        gsap.to(container, { opacity: 1, duration: 2, delay: 0.5, ease: "power3.out" });
        gsap.to(bg, { scale: 1, duration: 12, ease: "sine.inOut" });
    };

    const updateLanguage = (lang) => {
        currentLang = lang;
        const data = translations[lang];
        
        document.getElementById('hero-tagline').textContent = data.hero_tagline;
        document.getElementById('hero-title').innerHTML = data.hero_title;
        document.getElementById('hero-desc').textContent = data.hero_desc;
        document.getElementById('footer-text').textContent = data.footer_text;
        document.getElementById('current-lang').textContent = data.current_lang_label;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) el.textContent = data[key];
        });
        

        const inputs = demoForm.querySelectorAll('input');
        if (lang === 'PT') {
            inputs[0].placeholder = "Nome";
            inputs[1].placeholder = "E-mail Corporativo";
        } else {
            inputs[0].placeholder = "Name";
            inputs[1].placeholder = "Corporate Email";
        }
    };

    const updateTheme = () => {
        isDark = !isDark;
        htmlElement.classList.toggle('dark', isDark);
        htmlElement.classList.toggle('light', !isDark);
        document.querySelector('.theme-icon-light').classList.toggle('hidden', isDark);
        document.querySelector('.theme-icon-dark').classList.toggle('hidden', !isDark);
    };


    const triggerPortalTransition = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                window.open('https://singulai.site', '_blank');
                gsap.to([container, bg], { opacity: 1, scale: 1, duration: 1 });
            }
        });

        tl.to(container, { opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.inOut" })
          .to(bg, { scale: 2.5, filter: "blur(20px)", opacity: 0, duration: 1.5, ease: "expo.inOut" }, "-=0.4");
    };


    const openModal = () => {
        modal.classList.remove('hidden');
        gsap.to(modal, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(modal.querySelector('.glass-card'), 
            { scale: 0.9, y: 20 }, 
            { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        );
    };

    const closeModal = () => {
        gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') });
    };


    langToggle.addEventListener('click', () => {
        const nextLang = currentLang === 'PT' ? 'EN' : 'PT';
        gsap.to(container, { opacity: 0, y: 10, duration: 0.3, onComplete: () => {
            updateLanguage(nextLang);
            gsap.to(container, { opacity: 1, y: 0, duration: 0.5 });
        }});
    });

    themeToggle.addEventListener('click', () => {
        gsap.to('body', { opacity: 0.5, duration: 0.2, onComplete: () => {
            updateTheme();
            gsap.to('body', { opacity: 1, duration: 0.2 });
        }});
    });

    btnSite.addEventListener('click', (e) => {
        e.preventDefault();
        triggerPortalTransition();
    });

    btnDemo.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = demoForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = currentLang === 'PT' ? 'PROCESSANDO...' : 'PROCESSING...';
        btn.disabled = true;

        setTimeout(() => {
            alert(currentLang === 'PT' ? 'Acesso solicitado com sucesso! Entraremos em contato.' : 'Access requested! We will be in touch soon.');
            btn.textContent = originalText;
            btn.disabled = false;
            closeModal();
            demoForm.reset();
        }, 1500);
    });


    updateLanguage(currentLang);
});

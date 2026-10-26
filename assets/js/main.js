(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60 % 240);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));

  // Before / after results — prices in 억, after = current asking price
  const results = [
    { name: '약수하이츠', tag: '24평', bought: '25.08', before: 12, after: 16.4 },
    { name: '노량진우성', tag: '33평', bought: '25.09', before: 12.6, after: 16.2 },
    { name: '독립문극동', tag: '32평', bought: '25.09', before: 11.9, after: 15.5 },
    { name: '마포프레스티지자이', tag: '34평', bought: '25.06', before: 18.5, after: 23 },
    { name: '신길센트럴자이', tag: '34평', bought: '25.07', before: 14.9, after: 19.5 },
    { name: '신도림동아3차', tag: '24평', bought: '25.09', before: 11.6, after: 15.5 },
    { name: '현대3차', tag: '33평', bought: '26.01', before: 10.9, after: 14.5 },
    { name: '관악드림타운', tag: '24평', bought: '26.02', before: 9.2, after: 12 },
    { name: '보람마을아주', tag: '24평', bought: '25.11', before: 4.9, after: 6.8 },
    { name: '길음6단지래미안', tag: '32평', bought: '25.12', before: 12.5, after: 15 },
    { name: '목동신시가지7단지', tag: '22평', bought: '26.04', before: 20.8, after: 26 },
    { name: '고덕래미안힐스테이트', tag: '34평', bought: '25.08', before: 18.7, after: 21.5 },
  ];
  const resultsGrid = document.getElementById('resultsGrid');
  if (resultsGrid) {
    const fmt = (n) => String(Math.round(n * 100) / 100);
    const totalBefore = results.reduce((s, r) => s + r.before, 0);
    const totalGain = results.reduce((s, r) => s + (r.after - r.before), 0);
    document.getElementById('resultsAvg').textContent = `+${(totalGain / totalBefore * 100).toFixed(1)}%`;
    document.getElementById('resultsTotal').textContent = `${fmt(totalGain)}억`;

    const card = (r) => {
      const gain = r.after - r.before;
      return `<article class="result-card">
        <div class="result-card-head">
          <span class="result-card-tag">${r.tag}</span>
          <span class="result-card-rate">+${(gain / r.before * 100).toFixed(1)}%</span>
        </div>
        <h3 class="result-card-name">${r.name}</h3>
        <div class="result-card-compare">
          <div class="result-box result-box-before">
            <div class="result-box-label">BEFORE</div>
            <div class="result-box-price">${fmt(r.before)}억</div>
            <div class="result-box-date">${r.bought} 매수</div>
          </div>
          <span class="result-arrow" aria-hidden="true">→</span>
          <div class="result-box result-box-after">
            <div class="result-box-label">AFTER · 호가</div>
            <div class="result-box-price">${fmt(r.after)}<small>억</small></div>
          </div>
        </div>
        <div class="result-bar" aria-hidden="true"><div class="result-bar-base" style="width:${r.before / r.after * 100}%"></div></div>
        <div class="result-card-foot"><span>매수가</span><span class="result-card-gain">▲ ${fmt(gain)}억 상승</span></div>
      </article>`;
    };
    const render = (sortByRate) => {
      const list = sortByRate
        ? [...results].sort((a, b) => b.after / b.before - a.after / a.before)
        : results;
      resultsGrid.innerHTML = list.map(card).join('');
    };

    const sortBtns = document.querySelectorAll('.results-sort-btn');
    sortBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sortBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        render(btn.dataset.sort === 'rate');
      });
    });
    render(true);
  }

  // Marquees — duplicate each track's items so it can loop seamlessly; data-speed is px/s
  document.querySelectorAll('.review-track').forEach((track) => {
    [...track.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const speed = Number(track.dataset.speed) || 55;
    const setMarqueeSpeed = () => {
      track.style.setProperty('--marquee-duration', `${track.scrollWidth / 2 / speed}s`);
    };
    setMarqueeSpeed();
    window.addEventListener('resize', setMarqueeSpeed);
  });

  // Mobile sticky apply bar — shown past the hero, hidden while a full apply CTA is on screen
  const stickyApply = document.getElementById('sticky-apply');
  if (stickyApply) {
    const stickyLink = stickyApply.querySelector('a');
    const ctasInView = new Set();
    let pastHero = false;
    const updateSticky = () => {
      const show = pastHero && ctasInView.size === 0;
      stickyApply.classList.toggle('is-shown', show);
      stickyApply.setAttribute('aria-hidden', String(!show));
      stickyLink.tabIndex = show ? 0 : -1;
    };
    // isIntersecting stays true for a sliver of overlap, so compare the ratio itself
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.intersectionRatio >= 0.15 ? ctasInView.add(e.target) : ctasInView.delete(e.target)));
      updateSticky();
    }, { threshold: 0.15 });
    ['apply-card', 'final-cta'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) ctaObserver.observe(el);
    });
    window.addEventListener('scroll', () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      updateSticky();
    }, { passive: true });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
})();

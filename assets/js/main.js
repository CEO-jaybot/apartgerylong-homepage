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

  // Investment simulator
  const calcAmount = document.getElementById('calcAmount');
  const calcRegion = document.getElementById('calcRegion');
  const calcSize = document.getElementById('calcSize');
  if (calcAmount && calcRegion && calcSize) {
    const calcAmountValue = document.getElementById('calcAmountValue');
    const resYield = document.getElementById('resYield');
    const resRent = document.getElementById('resRent');
    const resGain = document.getElementById('resGain');

    const YIELD_BY_REGION = { gangnam: 3.2, seoul: 3.8, gyeonggi: 4.3, metro: 4.8, etc: 5.3 };
    const APPRECIATION_BY_REGION = { gangnam: 5.5, seoul: 4.0, gyeonggi: 3.2, metro: 2.5, etc: 1.8 };
    const YIELD_ADJUST_BY_SIZE = { small: -0.2, mid: 0, large: 0.3 };

    const formatEok = (v) => `${v.toFixed(1)}억원`;
    const formatManwon = (v) => `${Math.round(v).toLocaleString('ko-KR')}만원`;

    const updateCalculator = () => {
      const amountEok = parseFloat(calcAmount.value);
      const region = calcRegion.value;
      const size = calcSize.value;

      const min = parseFloat(calcAmount.min);
      const max = parseFloat(calcAmount.max);
      calcAmount.style.setProperty('--fill', `${((amountEok - min) / (max - min)) * 100}%`);
      calcAmountValue.textContent = formatEok(amountEok);

      const yieldRate = YIELD_BY_REGION[region] + YIELD_ADJUST_BY_SIZE[size];
      const appreciationRate = APPRECIATION_BY_REGION[region];
      const amountManwon = amountEok * 10000;

      const annualRent = amountManwon * (yieldRate / 100);
      const monthlyRent = annualRent / 12;
      const fiveYearGain = amountManwon * (appreciationRate / 100) * 5;

      resYield.innerHTML = `${yieldRate.toFixed(1)}<small>%</small>`;
      resRent.innerHTML = `${formatManwon(monthlyRent).replace('만원', '')}<small>만원</small>`;
      resGain.innerHTML = `${Math.round(fiveYearGain).toLocaleString('ko-KR')}<small>만원</small>`;
    };

    [calcAmount, calcRegion, calcSize].forEach((el) => el.addEventListener('input', updateCalculator));
    updateCalculator();
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

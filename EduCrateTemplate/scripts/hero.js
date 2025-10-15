(function(){
  const rotator = document.getElementById('hero-rotator');
  if(!rotator) return;

  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  const dotsEl = rotator.querySelector('.hero-dots');
  const heroSection = document.querySelector('.hero');

  const slides = [
    {
      title: 'Welcome to Hoërskool Noordheuwel',
      subtitle: 'Where Excellence Meets Education',
      image: 'images/hero.jpg'
    },
    {
      title: 'Student Leadership',
      subtitle: 'Building character and community',
      image: 'images/1.jpg'
    },
    {
      title: 'Rugby Pride',
      subtitle: 'Teamwork, grit, and sportsmanship',
      image: 'images/2.jpg'
    },
    {
      title: 'Academic Excellence',
      subtitle: 'Celebrating achievement and scholarship',
      image: 'images/3.jpg'
    },
    {
      title: 'Sports at Sunset',
      subtitle: 'School spirit on and off the court',
      image: 'images/basketball.jpg'
    },
    {
      title: 'Performing Arts',
      subtitle: 'Confidence and creativity on stage',
      image: 'images/sing.jpg'
    }
  ];

  let index = 0;

  function renderDots(){
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Show slide ${i+1}`);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    });
  }

  function goTo(i){
    index = i % slides.length;
    if(index < 0) index = slides.length - 1;
    const s = slides[index];
    if(titleEl) titleEl.textContent = s.title;
    if(subtitleEl) subtitleEl.textContent = s.subtitle;
    if(heroSection) heroSection.style.backgroundImage = `url('${s.image}')`;
    // update dots
    [...dotsEl.querySelectorAll('[role="tab"]')].forEach((d, di) => d.setAttribute('aria-selected', di===index?'true':'false'));
  }

  function next(){ goTo(index + 1); }

  // init
  renderDots();
  goTo(0);
  // auto-rotate every 8s, pause on focus within
  let timer = setInterval(next, 8000);
  rotator.addEventListener('focusin', () => clearInterval(timer));
  rotator.addEventListener('focusout', () => { timer = setInterval(next, 8000); });
})();

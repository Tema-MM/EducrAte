(function(){
  const container = document.getElementById('news-cards');
  if(!container) return;

  const maxCount = parseInt(container.getAttribute('data-count') || '3', 10);

  async function loadNews(){
    try {
      const res = await fetch('data/news.json', { headers: { 'Accept': 'application/json' }});
      if(!res.ok) throw new Error('Failed to load news');
      const items = await res.json();
      render(items);
    } catch (e) {
      // Fallback sample content
      render([
        { title: 'Welcome back', excerpt: 'A great term ahead with fresh goals.', url: 'news.html#welcome-back', date: '2025-01-10' },
        { title: 'Sports day results', excerpt: 'Amazing spirit and participation.', url: 'news.html#sports-day', date: '2025-02-02' },
        { title: 'New library wing', excerpt: 'More space for reading and research.', url: 'news.html#library', date: '2025-03-05' }
      ]);
    }
  }

  function render(items){
    const list = (items || []).slice(0, maxCount).map(item => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt || '')}</p>
        <a href="${item.url || 'news.html'}" class="read-more" aria-label="Read more: ${escapeHtml(item.title)}">Read More</a>
      `;
      return card;
    });
    container.replaceChildren(...list);
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }

  loadNews();
})();

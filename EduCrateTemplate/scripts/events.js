(function(){
  const listEl = document.getElementById('events-list');
  if(!listEl) return;

  function formatDateRange(startISO, endISO){
    try {
      const start = new Date(startISO);
      const end = new Date(endISO);
      const sameDay = start.toDateString() === end.toDateString();
      const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
      const timeFmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
      if(sameDay){
        return `${dateFmt.format(start)} • ${timeFmt.format(start)} – ${timeFmt.format(end)}`;
      }
      return `${dateFmt.format(start)} – ${dateFmt.format(end)}`;
    } catch {
      return `${startISO}`;
    }
  }

  async function loadEvents(){
    try {
      const res = await fetch('data/events.json', { headers: { 'Accept': 'application/json' }});
      if(!res.ok) throw new Error('Failed to load events');
      const events = await res.json();
      render(events);
    } catch (e) {
      render([
        { title: 'Open Day', start: '2025-10-20T09:00:00+02:00', end: '2025-10-20T12:00:00+02:00', location: 'Campus', url: 'events.html#open-day' }
      ]);
    }
  }

  function render(events){
    const nodes = (events || []).slice(0, 6).map(ev => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="title">${escapeHtml(ev.title)}</div>
        <div class="meta">${escapeHtml(formatDateRange(ev.start, ev.end))}${ev.location ? ' • ' + escapeHtml(ev.location) : ''}</div>
        <div style="margin-top:8px;"><a class="read-more" href="${ev.url || 'events.html'}" aria-label="Event details: ${escapeHtml(ev.title)}">Details</a></div>
      `;
      return li;
    });
    listEl.replaceChildren(...nodes);
  }

  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
  }

  loadEvents();
})();

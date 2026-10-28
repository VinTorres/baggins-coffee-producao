/* Comum a todas as páginas: chamadas à API, sessão do usuário e o menu da conta no topo */
window.BC = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  const PAPEL = { admin:'Admin', superuser:'Superuser', usuario:'Usuário' };

  async function api(path, { method = 'GET', body } = {}) {
    let r;
    try {
      r = await fetch('/api' + path, { method, credentials:'same-origin',
        headers: body ? { 'Content-Type':'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    } catch {
      throw new Error('Sem conexão com o servidor. Abra o site pelo "npm start" (http://localhost:3000).');
    }
    let data = {};
    try { data = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(data.erro || 'Algo deu errado. Tente de novo.'); e.status = r.status; throw e; }
    return data;
  }

  /* Link de entrar que volta para esta página depois do login */
  const entrarURL = () => 'entrar.html?volta=' + encodeURIComponent((location.pathname.split('/').pop() || 'index.html') + location.hash);

  let user = null;
  function renderConta() {
    const slot = document.getElementById('auth-slot');
    if (!slot) return;
    if (!user) {
      slot.innerHTML = `<a href="${entrarURL()}" class="rounded-full border border-amber/60 px-3.5 py-1 text-amber hover:bg-amber hover:text-forest focus-visible:outline-2 focus-visible:outline-amber">Entrar</a>`;
      return;
    }
    slot.innerHTML = `<details class="relative">
      <summary class="flex cursor-pointer list-none items-center gap-2 rounded-full border border-amber/60 px-3.5 py-1 hover:border-amber focus-visible:outline-2 focus-visible:outline-amber">
        <span class="flex size-5 items-center justify-center rounded-full bg-amber text-xs font-bold text-forest" aria-hidden="true">${esc(user.nome[0].toUpperCase())}</span>${esc(user.nome.split(' ')[0])}</summary>
      <div class="absolute right-0 z-40 mt-2 w-64 rounded-2xl bg-moss p-4 text-sm shadow-xl frame">
        <p class="font-semibold">${esc(user.nome)}</p>
        <p class="break-all text-cream/60">${esc(user.email)}</p>
        ${user.usuario ? `<p class="text-amber">@${esc(user.usuario)}</p>` : ''}
        <p class="mt-2 inline-block rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-semibold text-amber">${PAPEL[user.papel]}</p>
        <a href="perfil.html" class="mt-3 block font-semibold underline underline-offset-4 hover:text-amber">Meu perfil</a>
        ${user.papel === 'admin' ? '<a href="admin.html" class="mt-3 block font-semibold underline underline-offset-4 hover:text-amber">Gerenciar usuários</a>' : ''}
        <button type="button" id="sair" class="mt-3 block font-semibold text-rust underline underline-offset-4 hover:text-cream">Sair</button>
      </div></details>`;
    document.getElementById('sair').addEventListener('click', async () => {
      try { await api('/auth/logout', { method:'POST' }); } finally { location.reload(); }
    });
  }

  /* Promise que resolve com o usuário logado (ou null) */
  const pronto = api('/auth/eu').then(d => user = d.usuario).catch(() => null).then(() => { renderConta(); return user; });

  return { api, esc, PAPEL, entrarURL, pronto, get user() { return user; } };
})();

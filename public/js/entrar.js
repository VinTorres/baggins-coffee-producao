/* Entrar e criar conta (nome, e-mail e senha) */
const $ = id => document.getElementById(id);
const { api } = BC;

/* Só volta para páginas do próprio site */
const volta = (() => {
  const v = new URLSearchParams(location.search).get('volta') || '';
  return /^[a-z0-9_-]+\.html(#[\w-]*)?$/i.test(v) && !v.startsWith('entrar') ? v : 'index.html';
})();

function aba(cad) {
  $('tab-login').setAttribute('aria-selected', String(!cad));
  $('tab-cad').setAttribute('aria-selected', String(cad));
  $('tab-login').className = $('tab-cad').className = 'rounded-full px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-amber';
  $(cad ? 'tab-cad' : 'tab-login').classList.add('bg-amber', 'text-forest');
  $('form-login').classList.toggle('hidden', cad);
  $('form-cad').classList.toggle('hidden', !cad);
  $('titulo').textContent = cad ? 'Criar conta' : 'Entrar';
  $('sub').textContent = cad ? 'Só precisa de nome, e-mail e senha.' : 'Entre para cadastrar cafés, casas e receitas.';
  (cad ? $('c-nome') : $('l-email')).focus();
}
$('tab-login').addEventListener('click', () => aba(false));
$('tab-cad').addEventListener('click', () => aba(true));
aba(location.hash === '#criar');

async function enviar(e, path, body, errId) {
  e.preventDefault();
  const err = $(errId), btn = e.submitter || e.target.querySelector('button:not([type=button])');
  err.classList.add('hidden'); btn.disabled = true;
  try {
    await api(path, { method:'POST', body });
    location.href = volta;
  } catch (ex) {
    err.textContent = ex.message; err.classList.remove('hidden');
    btn.disabled = false;
  }
}
$('form-login').addEventListener('submit', e => enviar(e, '/auth/login', { email:$('l-email').value, senha:$('l-senha').value }, 'l-err'));
$('form-cad').addEventListener('submit', e => {
  if ($('c-senha').value.length < 8) { e.preventDefault(); $('c-err').textContent = 'A senha precisa ter pelo menos 8 caracteres.'; $('c-err').classList.remove('hidden'); return; }
  enviar(e, '/auth/cadastro', { nome:$('c-nome').value, email:$('c-email').value, senha:$('c-senha').value }, 'c-err');
});

/* Já está logado? Volta direto */
BC.pronto.then(u => { if (u) location.replace(volta); });

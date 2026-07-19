/* ==========================================================================
   HACK ACADEMY — Painel Administrativo
   Aprova/recusa solicitações de cadastro (tabela registration_requests) e
   gerencia a lista de administradores (tabela admin_users).

   IMPORTANTE: o acesso a esta página é restrito por regra de acesso da
   hospedagem (nível de servidor / Hosted Dispatcher), não por esta lógica de
   JavaScript — este arquivo cuida apenas das ações dentro do painel.
   ========================================================================== */

let ADMIN_CURRENT_FILTER = 'Pendente';
let ADMIN_ALL_REGISTRATIONS = [];

function formatAdminDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function registrationStatusBadge(status) {
  const map = {
    'Pendente': 'bg-amber-100 text-amber-700',
    'Aprovado': 'bg-emerald-100 text-emerald-700',
    'Recusado': 'bg-red-100 text-red-600'
  };
  return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}">${status}</span>`;
}

function renderRegistrationCard(reg) {
  const roleIcon = reg.requested_role === 'Professor' ? 'fa-chalkboard-user' : 'fa-user-graduate';
  const showActions = reg.status === 'Pendente';
  return `
    <div class="bg-white rounded-2xl shadow-sm p-5" id="reg-card-${reg.id}">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <span class="w-11 h-11 rounded-full bg-black text-brand-yellow flex items-center justify-center shrink-0"><i class="fa-solid ${roleIcon}"></i></span>
          <div>
            <p class="font-semibold text-slate-900">${reg.name}</p>
            <p class="text-xs text-slate-500">${reg.email}${reg.phone ? ' · ' + reg.phone : ''}</p>
          </div>
        </div>
        ${registrationStatusBadge(reg.status)}
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
        <span><i class="fa-solid fa-tag mr-1"></i>Perfil solicitado: <strong class="text-slate-700">${reg.requested_role}</strong></span>
        ${reg.course_interest ? `<span><i class="fa-solid fa-book mr-1"></i>Interesse: ${reg.course_interest}</span>` : ''}
        <span><i class="fa-regular fa-clock mr-1"></i>Enviado em ${formatAdminDate(reg.created_at)}</span>
      </div>
      ${reg.message ? `<p class="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-3">${reg.message}</p>` : ''}
      ${reg.status !== 'Pendente' ? `<p class="text-xs text-slate-400">Avaliado por ${reg.reviewed_by || '—'} em ${formatAdminDate(reg.reviewed_at)}</p>` : ''}
      ${showActions ? `
        <div class="flex gap-2 mt-3">
          <button data-id="${reg.id}" class="approve-reg-btn btn-accent flex-1 py-2 rounded-lg text-sm font-semibold"><i class="fa-solid fa-check mr-1.5"></i>Aprovar</button>
          <button data-id="${reg.id}" class="reject-reg-btn flex-1 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"><i class="fa-solid fa-xmark mr-1.5"></i>Recusar</button>
        </div>
      ` : ''}
    </div>
  `;
}

function applyRegistrationFilter() {
  const list = document.getElementById('registrations-list');
  const filtered = ADMIN_CURRENT_FILTER === 'Todos'
    ? ADMIN_ALL_REGISTRATIONS
    : ADMIN_ALL_REGISTRATIONS.filter((r) => r.status === ADMIN_CURRENT_FILTER);

  if (filtered.length === 0) {
    list.innerHTML = `<p class="text-slate-400 text-sm text-center py-10"><i class="fa-solid fa-inbox mr-2"></i>Nenhuma solicitação ${ADMIN_CURRENT_FILTER === 'Todos' ? '' : 'com status "' + ADMIN_CURRENT_FILTER + '"'} encontrada.</p>`;
    return;
  }
  list.innerHTML = filtered.map(renderRegistrationCard).join('');
  bindRegistrationActions();
}

function setupRegFilterTabs() {
  document.querySelectorAll('.reg-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.reg-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      ADMIN_CURRENT_FILTER = btn.getAttribute('data-filter');
      applyRegistrationFilter();
    });
  });
}

async function loadRegistrations() {
  try {
    const res = await fetch('tables/registration_requests?limit=200&sort=-created_at');
    const data = await res.json();
    ADMIN_ALL_REGISTRATIONS = (data.data || []).sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    document.getElementById('stat-pending').textContent = ADMIN_ALL_REGISTRATIONS.filter((r) => r.status === 'Pendente').length;
    document.getElementById('stat-approved').textContent = ADMIN_ALL_REGISTRATIONS.filter((r) => r.status === 'Aprovado').length;

    applyRegistrationFilter();
  } catch (err) {
    console.error('Erro ao carregar solicitações', err);
    document.getElementById('registrations-list').innerHTML = '<p class="text-red-500 text-sm text-center py-10">Não foi possível carregar as solicitações.</p>';
  }
}

async function reviewRegistration(id, newStatus) {
  const reviewer = HackAuth.getUser();
  const reviewerEmail = (reviewer && reviewer.email) ? reviewer.email : (reviewer && reviewer.name) || 'gestor';
  try {
    await fetch(`tables/registration_requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        reviewed_by: reviewerEmail,
        reviewed_at: Date.now()
      })
    });
    await loadRegistrations();
  } catch (err) {
    console.error('Erro ao avaliar solicitação', err);
    alert('Não foi possível salvar a avaliação. Tente novamente.');
  }
}

function bindRegistrationActions() {
  document.querySelectorAll('.approve-reg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Aprovar esta solicitação de cadastro?')) {
        reviewRegistration(btn.getAttribute('data-id'), 'Aprovado');
      }
    });
  });
  document.querySelectorAll('.reject-reg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Recusar esta solicitação de cadastro?')) {
        reviewRegistration(btn.getAttribute('data-id'), 'Recusado');
      }
    });
  });
}

/* ---------- Administradores ---------- */

function renderAdminCard(admin) {
  const levelBadge = admin.level === 'Gestor Master'
    ? '<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-yellow text-black">Gestor Master</span>'
    : '<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Administrador</span>';
  const accessBadge = admin.access_granted
    ? '<span class="text-emerald-600 text-xs"><i class="fa-solid fa-circle-check mr-1"></i>Acesso liberado</span>'
    : '<span class="text-amber-600 text-xs"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Aguardando liberação na regra de acesso</span>';
  return `
    <div class="bg-white rounded-2xl shadow-sm p-4">
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <p class="font-semibold text-slate-900 text-sm">${admin.name}</p>
        ${levelBadge}
      </div>
      <p class="text-xs text-slate-500 mb-2">${admin.email}</p>
      ${accessBadge}
    </div>
  `;
}

async function loadAdmins() {
  try {
    const res = await fetch('tables/admin_users?limit=100');
    const data = await res.json();
    const admins = data.data || [];
    document.getElementById('stat-admins').textContent = admins.length;
    const list = document.getElementById('admins-list');
    if (admins.length === 0) {
      list.innerHTML = '<p class="text-slate-400 text-sm text-center py-6">Nenhum administrador cadastrado ainda.</p>';
      return;
    }
    list.innerHTML = admins.map(renderAdminCard).join('');
  } catch (err) {
    console.error('Erro ao carregar administradores', err);
  }
}

function setupAddAdminForm() {
  const form = document.getElementById('add-admin-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewer = HackAuth.getUser();
    const addedBy = (reviewer && reviewer.email) || (reviewer && reviewer.name) || 'gestor';

    const payload = {
      name: document.getElementById('admin-name').value.trim(),
      email: document.getElementById('admin-email').value.trim().toLowerCase(),
      level: document.getElementById('admin-level').value,
      access_granted: false,
      added_by: addedBy
    };
    if (!payload.name || !payload.email) return;

    try {
      await fetch('tables/admin_users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      form.reset();
      await loadAdmins();
      alert('Administrador adicionado! Peça para o assistente (IA) liberar o e-mail "' + payload.email + '" na regra de acesso de /admin.html e publicar novamente — só depois disso a pessoa conseguirá entrar no painel.');
    } catch (err) {
      console.error('Erro ao adicionar administrador', err);
      alert('Não foi possível adicionar o administrador agora.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupRegFilterTabs();
  setupAddAdminForm();
  loadRegistrations();
  loadAdmins();
});

/* ==========================================================================
   HACK ACADEMY — Área do Aluno (simulação de progresso via localStorage)
   ========================================================================== */

function requireLogin() {
  const user = HackAuth.getUser();
  if (!user) {
    window.location.href = 'login.html?redirect=aluno.html';
    return null;
  }
  return user;
}

function progressCardHTML(course, progress) {
  return `
    <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-start">
      <img src="${course.image_url}" alt="${course.title}" class="w-full sm:w-32 h-24 object-cover rounded-lg">
      <div class="flex-1">
        <span class="badge badge-dark mb-2">${course.category}</span>
        <h3 class="font-semibold text-slate-900 mb-2">${course.title}</h3>
        <div class="progress-track mb-1.5">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        <p class="text-xs text-slate-500">${progress}% concluído</p>
      </div>
      <a href="curso.html?id=${course.id}" class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold self-center whitespace-nowrap">Continuar</a>
    </div>
  `;
}

function completedCardHTML(course) {
  return `
    <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-center">
      <img src="${course.image_url}" alt="${course.title}" class="w-full sm:w-32 h-24 object-cover rounded-lg">
      <div class="flex-1">
        <span class="badge badge-yellow mb-2">Concluído</span>
        <h3 class="font-semibold text-slate-900">${course.title}</h3>
        <p class="text-xs text-slate-500 mt-1"><i class="fa-solid fa-clock mr-1"></i>${course.duration_hours}h de conteúdo</p>
      </div>
      <a href="certificados.html" class="btn-accent px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">Ver Certificado</a>
    </div>
  `;
}

async function loadDashboard(user) {
  document.getElementById('student-name').textContent = user.name;
  try {
    const res = await fetch('tables/courses?limit=100');
    const data = await res.json();
    const all = data.data || [];

    // Simulação determinística: usa os primeiros cursos como "em andamento" e "concluídos"
    const inProgress = all.slice(0, 2);
    const completed = all.slice(2, 4);

    const earnedCertificates = all.filter(c => HackProgress.get(c.id).approved);

    document.getElementById('stat-in-progress').textContent = inProgress.length;
    document.getElementById('stat-completed').textContent = completed.length;
    document.getElementById('stat-certificates').textContent = earnedCertificates.length;

    document.getElementById('in-progress-list').innerHTML = inProgress.length
      ? inProgress.map((c, i) => progressCardHTML(c, i === 0 ? 65 : 30)).join('')
      : '<p class="text-slate-500 text-sm">Você ainda não iniciou nenhum curso. <a href="cursos.html" class="text-brand-yellow-dark font-semibold">Explore o catálogo</a>.</p>';

    document.getElementById('completed-list').innerHTML = completed.length
      ? completed.map(completedCardHTML).join('')
      : '<p class="text-slate-500 text-sm">Nenhum curso concluído ainda.</p>';

    const history = [...inProgress.map(c => ({ label: `Iniciou "${c.title}"`, icon: 'fa-play', color: 'text-brand-yellow-dark' })),
                      ...completed.map(c => ({ label: `Concluiu "${c.title}"`, icon: 'fa-circle-check', color: 'text-brand-yellow-dark' }))];
    document.getElementById('history-list').innerHTML = history.map(h =>
      `<li class="flex items-start gap-2"><i class="fa-solid ${h.icon} ${h.color} mt-0.5"></i><span>${h.label}</span></li>`
    ).join('') || '<li class="text-slate-400">Sem atividades recentes.</li>';
  } catch (err) {
    console.error('Erro ao carregar dashboard do aluno', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireLogin();
  if (user) loadDashboard(user);
});

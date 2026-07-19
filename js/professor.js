/* ==========================================================================
   HACK ACADEMY — Área do Professor (painel básico)
   ========================================================================== */

function requireLoginProfessor() {
  const user = HackAuth.getUser();
  if (!user) {
    window.location.href = 'login.html?redirect=professor.html';
    return null;
  }
  return user;
}

function myCourseRow(course) {
  return `
    <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-center">
      <img src="${course.image_url}" alt="${course.title}" class="w-full sm:w-28 h-20 object-cover rounded-lg">
      <div class="flex-1">
        <span class="badge badge-dark mb-1.5">${course.category}</span>
        <h3 class="font-semibold text-slate-900">${course.title}</h3>
        <p class="text-slate-500 text-xs mt-1"><i class="fa-solid fa-clock mr-1"></i>${course.duration_hours}h · <i class="fa-solid fa-signal ml-1 mr-1"></i>${course.level}</p>
      </div>
      <div class="flex gap-2">
        <a href="curso.html?id=${course.id}" class="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50">Visualizar</a>
        <button onclick="alert('Em breve: edição completa de aulas.')" class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">Editar</button>
      </div>
    </div>
  `;
}

async function loadTeacherDashboard(user) {
  document.getElementById('teacher-name').textContent = user.name;
  try {
    const res = await fetch('tables/courses?limit=100');
    const data = await res.json();
    const all = data.data || [];

    // Simula os cursos do professor pelo nome cadastrado (fallback: usa "Bruno Lima" como exemplo)
    let myCourses = all.filter(c => c.instructor_name.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
    if (myCourses.length === 0) myCourses = all.filter(c => c.instructor_name === 'Bruno Lima');
    if (myCourses.length === 0) myCourses = all.slice(0, 3);

    const totalHours = myCourses.reduce((sum, c) => sum + (c.duration_hours || 0), 0);

    document.getElementById('stat-my-courses').textContent = myCourses.length;
    document.getElementById('stat-my-students').textContent = myCourses.length * 27;
    document.getElementById('stat-my-certificates').textContent = myCourses.length * 18;
    document.getElementById('stat-my-hours').textContent = `${totalHours}h`;

    document.getElementById('my-courses-list').innerHTML = myCourses.length
      ? myCourses.map(myCourseRow).join('')
      : '<p class="text-slate-500 text-sm">Você ainda não publicou nenhum curso.</p>';

    document.getElementById('new-course-btn')?.addEventListener('click', () => {
      alert('Em breve: formulário completo de publicação de novos cursos.');
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard do professor', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireLoginProfessor();
  if (user) loadTeacherDashboard(user);
});

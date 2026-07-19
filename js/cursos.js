/* ==========================================================================
   HACK ACADEMY — Catálogo de Cursos (filtros, busca, trilha via querystring)
   ========================================================================== */

let ALL_COURSES = [];
let CURRENT_FILTER = 'Todos';
let CURRENT_TRACK = null;

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function courseCardFull(course) {
  const skills = (course.skills || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
  return `
    <a href="curso.html?id=${course.id}" class="course-card group rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col fade-in-up">
      <div class="h-44 overflow-hidden relative">
        <img src="${course.image_url}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <span class="absolute top-3 left-3 badge badge-dark bg-white/95">${course.level}</span>
      </div>
      <div class="p-5 flex flex-col flex-1">
        <span class="badge badge-yellow mb-3 self-start">${course.category}</span>
        <h3 class="font-semibold text-slate-900 mb-1.5 leading-snug">${course.title}</h3>
        <p class="text-slate-500 text-sm mb-3 line-clamp-2">${course.short_description || ''}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${skills.map(s => `<span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">${s}</span>`).join('')}
        </div>
        <div class="mt-auto flex items-center justify-between text-xs text-slate-500 mb-4">
          <span><i class="fa-solid fa-user mr-1"></i>${course.instructor_name}</span>
          <span><i class="fa-solid fa-clock mr-1"></i>${course.duration_hours}h</span>
        </div>
        <span class="btn-primary text-center py-2.5 rounded-lg text-sm font-semibold">Saiba Mais</span>
      </div>
    </a>
  `;
}

function renderCourses(list) {
  const grid = document.getElementById('courses-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('results-count');
  if (!grid) return;

  count.textContent = `${list.length} curso${list.length === 1 ? '' : 's'} encontrado${list.length === 1 ? '' : 's'}`;

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(courseCardFull).join('');
}

function applyFilters() {
  const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  let list = ALL_COURSES;

  if (CURRENT_TRACK) {
    list = list.filter(c => (c.track || '').includes(CURRENT_TRACK));
  } else if (CURRENT_FILTER !== 'Todos') {
    list = list.filter(c => c.category === CURRENT_FILTER);
  }

  if (search) {
    list = list.filter(c =>
      c.title.toLowerCase().includes(search) ||
      (c.instructor_name || '').toLowerCase().includes(search) ||
      (c.skills || '').toLowerCase().includes(search) ||
      (c.category || '').toLowerCase().includes(search)
    );
  }

  renderCourses(list);
}

function setupFilterTabs() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CURRENT_FILTER = btn.getAttribute('data-filter');
      CURRENT_TRACK = null;
      applyFilters();
    });
  });
}

async function loadCourses() {
  try {
    const res = await fetch('tables/courses?limit=100');
    const data = await res.json();
    ALL_COURSES = data.data || [];

    // Verifica parâmetros de URL (categoria ou trilha)
    const categoriaParam = getQueryParam('categoria');
    const trilhaParam = getQueryParam('trilha');

    if (trilhaParam) {
      CURRENT_TRACK = decodeURIComponent(trilhaParam);
    } else if (categoriaParam) {
      const cat = decodeURIComponent(categoriaParam);
      CURRENT_FILTER = cat;
      const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    }

    applyFilters();
  } catch (err) {
    console.error('Erro ao carregar cursos', err);
    document.getElementById('courses-grid').innerHTML = '<p class="text-slate-500 col-span-full text-center">Não foi possível carregar os cursos agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilterTabs();
  document.getElementById('search-input')?.addEventListener('input', applyFilters);
  loadCourses();
});

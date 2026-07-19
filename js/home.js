/* ==========================================================================
   HACK ACADEMY — Home: contadores animados + cursos em destaque
   ========================================================================== */

/** Anima números de contador (data-counter) quando entram na tela. */
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => observer.observe(c));
}

/** Renderiza o card de um curso. */
function courseCardHTML(course) {
  const skills = (course.skills || '').split(',').slice(0, 2).map(s => s.trim()).filter(Boolean);
  return `
    <a href="curso.html?id=${course.id}" class="course-card group rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
      <div class="h-40 overflow-hidden">
        <img src="${course.image_url}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-5 flex flex-col flex-1">
        <span class="badge badge-dark mb-3 self-start">${course.category}</span>
        <h3 class="font-semibold text-slate-900 mb-1.5 leading-snug">${course.title}</h3>
        <p class="text-slate-500 text-xs mb-4"><i class="fa-solid fa-user mr-1"></i>${course.instructor_name} · <i class="fa-solid fa-clock ml-1 mr-1"></i>${course.duration_hours}h</p>
        <div class="mt-auto flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">${course.level}</span>
          <span class="text-brand-yellow-dark text-sm font-semibold inline-flex items-center gap-1">Saiba mais <i class="fa-solid fa-arrow-right text-xs"></i></span>
        </div>
      </div>
    </a>
  `;
}

/** Carrega cursos em destaque na home. */
async function loadFeaturedCourses() {
  const grid = document.getElementById('featured-courses-grid');
  if (!grid) return;
  try {
    const res = await fetch('tables/courses?limit=100');
    const data = await res.json();
    const all = data.data || [];
    let featured = all.filter(c => c.featured);
    if (featured.length === 0) featured = all;
    featured = featured.slice(0, 4);
    grid.innerHTML = featured.map(courseCardHTML).join('');
  } catch (err) {
    console.error('Erro ao carregar cursos em destaque', err);
    grid.innerHTML = '<p class="text-slate-500 col-span-full text-center">Não foi possível carregar os cursos agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  loadFeaturedCourses();
});

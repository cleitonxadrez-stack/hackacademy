/* ==========================================================================
   HACK ACADEMY — Página de Professores
   ========================================================================== */

function instructorCardHTML(instructor) {
  return `
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden fade-in-up">
      <div class="h-56 overflow-hidden">
        <img src="${instructor.photo_url}" alt="${instructor.name}" class="w-full h-full object-cover">
      </div>
      <div class="p-6">
        <span class="badge badge-dark mb-3">${instructor.area}</span>
        <h3 class="font-display font-bold text-lg text-slate-900 mb-2">${instructor.name}</h3>
        <div class="text-slate-500 text-sm mb-4 leading-relaxed">${instructor.bio || ''}</div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500"><i class="fa-solid fa-book mr-1.5"></i>${instructor.courses_count || 0} curso(s)</span>
          <a href="${instructor.linkedin_url || '#'}" target="_blank" rel="noopener" class="text-brand-yellow-dark font-semibold link-underline">LinkedIn</a>
        </div>
      </div>
    </div>
  `;
}

async function loadInstructors() {
  const grid = document.getElementById('instructors-grid');
  if (!grid) return;
  try {
    const res = await fetch('tables/instructors?limit=100');
    const data = await res.json();
    const all = data.data || [];
    grid.innerHTML = all.map(instructorCardHTML).join('');
  } catch (err) {
    console.error('Erro ao carregar professores', err);
    grid.innerHTML = '<p class="text-slate-500 col-span-full text-center">Não foi possível carregar os professores agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadInstructors);

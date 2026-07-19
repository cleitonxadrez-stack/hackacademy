/* ==========================================================================
   HACK ACADEMY — Página de detalhe do curso
   ========================================================================== */

function getCourseIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function showNotFound() {
  document.getElementById('course-loading').classList.add('hidden');
  document.getElementById('course-not-found').classList.remove('hidden');
}

function renderCourse(course) {
  document.getElementById('course-loading').classList.add('hidden');
  document.getElementById('course-content').classList.remove('hidden');

  document.title = `${course.title} — HACK ACADEMY`;
  document.getElementById('page-title').textContent = `${course.title} — HACK ACADEMY`;
  document.getElementById('breadcrumb-category').textContent = course.category;
  document.getElementById('course-category-badge').textContent = course.category;
  document.getElementById('course-title').textContent = course.title;
  document.getElementById('course-short-desc').textContent = course.short_description || '';
  document.getElementById('course-instructor').textContent = course.instructor_name;
  document.getElementById('course-duration').textContent = course.duration_hours;
  document.getElementById('course-level').textContent = course.level;
  document.getElementById('course-image').src = course.image_url;
  document.getElementById('course-image').alt = course.title;

  document.getElementById('course-description').innerHTML = course.description || '';
  document.getElementById('course-objectives').innerHTML = course.objectives || '';
  document.getElementById('course-syllabus').innerHTML = course.syllabus || '';
  document.getElementById('course-practical').innerHTML = course.practical_project || '';

  document.getElementById('info-duration').textContent = `${course.duration_hours}h`;
  document.getElementById('info-level').textContent = course.level;
  document.getElementById('info-category').textContent = course.category;

  const skills = (course.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  document.getElementById('course-skills').innerHTML = skills.map(s =>
    `<span class="badge badge-dark">${s}</span>`
  ).join('');

  document.getElementById('instructor-initial').textContent = (course.instructor_name || '?').charAt(0);
  document.getElementById('instructor-name-side').textContent = course.instructor_name;

  // Sala de Aula (slides + material complementar + Desafio HACK reunidos)
  if (course.slides_url) {
    const classroomCard = document.getElementById('course-classroom-card');
    const classroomBtn = document.getElementById('course-classroom-btn');
    classroomBtn.href = `sala-de-aula.html?id=${course.id}`;
    classroomCard.classList.remove('hidden');
  }

  // Se o aluno já estiver logado e aprovado neste curso, exibe banner/cards de certificado
  const user = HackAuth.getUser();
  if (user) {
    const progress = HackProgress.get(course.id);
    if (progress.approved) {
      const banner = document.getElementById('course-approved-banner');
      document.getElementById('course-approved-cert-code').textContent = progress.certificateCode || '';
      banner.classList.remove('hidden');

      const certCard = document.getElementById('course-certificate-card');
      certCard.classList.remove('hidden');

      // Ajusta o CTA principal e o texto de dica quando já concluído/aprovado
      const startBtn = document.getElementById('start-course-btn');
      startBtn.textContent = 'Revisar na Sala de Aula';
      document.getElementById('start-course-hint').textContent = 'Curso concluído · Certificado já liberado';
    }
  }

  document.getElementById('start-course-btn').addEventListener('click', () => {
    const loggedUser = HackAuth.getUser();
    if (!loggedUser) {
      window.location.href = `login.html?redirect=curso.html?id=${course.id}`;
    } else if (course.slides_url) {
      window.location.href = `sala-de-aula.html?id=${course.id}`;
    } else {
      alert(`Você iniciou o curso "${course.title}"! Acompanhe seu progresso na Área do Aluno.`);
      window.location.href = 'aluno.html';
    }
  });
}

async function loadCourse() {
  const id = getCourseIdFromUrl();
  if (!id) return showNotFound();
  try {
    const res = await fetch(`tables/courses/${id}`);
    if (!res.ok) return showNotFound();
    const course = await res.json();
    renderCourse(course);
  } catch (err) {
    console.error('Erro ao carregar curso', err);
    showNotFound();
  }
}

document.addEventListener('DOMContentLoaded', loadCourse);

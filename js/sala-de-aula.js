/* ==========================================================================
   HACK ACADEMY — Sala de Aula (página única do curso)
   Slides em foco principal → material complementar → Desafio HACK → certificado
   ========================================================================== */

let SDA_COURSE = null;
let SDA_QUESTIONS = [];
let SDA_CURRENT_INDEX = 0;
let SDA_SCORE = 0;
let SDA_ANSWERED = false;
const SDA_OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Visualizador de slides (PDF.js) — navega ao clicar/usar as setas
let SDA_PDF_DOC = null;
let SDA_PDF_PAGE_NUM = 1;
let SDA_PDF_TOTAL_PAGES = 1;
let SDA_PDF_RENDERING = false;

if (window['pdfjs-dist/build/pdf']) {
  // fallback caso a lib exponha um namespace diferente (não usado normalmente)
}
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

function getCourseIdFromUrlSDA() {
  return new URLSearchParams(window.location.search).get('id');
}

function showClassroomNotFound() {
  document.getElementById('classroom-loading').classList.add('hidden');
  document.getElementById('classroom-not-found').classList.remove('hidden');
}

/* ---------- Status pills / banner de aprovação ---------- */
function refreshClassroomStatus() {
  const progress = HackProgress.get(SDA_COURSE.id);

  const slidesPill = document.getElementById('classroom-status-slides');
  if (progress.slidesDone) {
    slidesPill.className = 'status-pill status-pill-done';
    slidesPill.innerHTML = '<i class="fa-solid fa-circle-check"></i>Teoria 100% concluída';
  } else {
    slidesPill.className = 'status-pill status-pill-pending';
    slidesPill.innerHTML = '<i class="fa-solid fa-display"></i>Teoria em andamento';
  }

  const quizPill = document.getElementById('classroom-status-quiz');
  if (progress.approved) {
    quizPill.className = 'status-pill status-pill-done';
    quizPill.innerHTML = '<i class="fa-solid fa-trophy"></i>Aprovado';
  } else if (progress.quizDone) {
    quizPill.className = 'status-pill status-pill-pending';
    quizPill.innerHTML = '<i class="fa-solid fa-rotate-right"></i>Refazer Desafio';
  } else {
    quizPill.className = 'status-pill status-pill-pending';
    quizPill.innerHTML = '<i class="fa-solid fa-gamepad"></i>Desafio pendente';
  }

  const banner = document.getElementById('classroom-approved-banner');
  if (progress.approved) {
    banner.classList.remove('hidden');
    document.getElementById('approved-cert-code').textContent = progress.certificateCode || '';
  } else {
    banner.classList.add('hidden');
  }

  // Desbloqueia/bloqueia o Desafio HACK
  const lockOverlay = document.getElementById('quiz-lock-overlay');
  const quizInner = document.getElementById('quiz-inner');
  if (progress.slidesDone) {
    lockOverlay.classList.add('hidden');
    quizInner.classList.remove('classroom-locked');
  } else {
    lockOverlay.classList.remove('hidden');
    quizInner.classList.add('classroom-locked');
  }

  // Marca o botão de slides concluídos
  const markBtn = document.getElementById('mark-slides-done-btn');
  if (progress.slidesDone) {
    markBtn.innerHTML = '<i class="fa-solid fa-circle-check mr-1.5"></i>Slides concluídos';
    markBtn.classList.remove('btn-primary');
    markBtn.classList.add('btn-accent');
    markBtn.disabled = true;
  }

  // Certificado
  renderCertificateSection(progress);
}

function renderCertificateSection(progress) {
  const section = document.getElementById('certificate-section');
  if (!progress.approved) {
    section.classList.add('hidden');
    return;
  }
  const user = HackAuth.getUser();
  if (!user) return;
  section.classList.remove('hidden');
  const wrap = document.getElementById('certificate-wrap');
  if (wrap.dataset.rendered === SDA_COURSE.id) return; // evita re-gerar o PDF a cada refresh de status
  wrap.dataset.rendered = SDA_COURSE.id;
  wrap.innerHTML = renderCertificateCard(SDA_COURSE, user, progress);
  bindCertificateDownloadButtons();
  mountCertificatePreview(SDA_COURSE, user, progress);
}

/* ---------- Slides (PDF.js — avança ao clicar) ---------- */
async function sdaLoadPdf(url) {
  const loadingEl = document.getElementById('slide-loading');
  loadingEl.classList.remove('hidden');
  try {
    const loadingTask = window.pdfjsLib.getDocument(url);
    SDA_PDF_DOC = await loadingTask.promise;
    SDA_PDF_TOTAL_PAGES = SDA_PDF_DOC.numPages;
    SDA_PDF_PAGE_NUM = 1;
    await sdaRenderPdfPage(SDA_PDF_PAGE_NUM);
  } catch (err) {
    console.error('Erro ao carregar PDF dos slides', err);
    loadingEl.innerHTML = '<p class="text-slate-300 text-sm px-6 text-center">Não foi possível carregar a visualização dos slides. <a href="' + url + '" target="_blank" class="text-brand-yellow underline">Abra o PDF em uma nova aba</a>.</p>';
  }
}

async function sdaRenderPdfPage(num) {
  if (!SDA_PDF_DOC || SDA_PDF_RENDERING) return;
  SDA_PDF_RENDERING = true;
  const loadingEl = document.getElementById('slide-loading');
  loadingEl.classList.remove('hidden');

  try {
    const page = await SDA_PDF_DOC.getPage(num);
    const canvas = document.getElementById('slide-canvas');
    const wrap = document.getElementById('slide-canvas-wrap');
    const context = canvas.getContext('2d');

    const availableWidth = wrap.clientWidth - 32;
    const availableHeight = wrap.clientHeight - 32;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(availableWidth / baseViewport.width, availableHeight / baseViewport.height) * (window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: Math.max(scale, 0.5) });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = (viewport.width / (window.devicePixelRatio || 1)) + 'px';
    canvas.style.height = (viewport.height / (window.devicePixelRatio || 1)) + 'px';

    await page.render({ canvasContext: context, viewport }).promise;

    document.getElementById('slide-counter').textContent = `${num} / ${SDA_PDF_TOTAL_PAGES}`;
    document.getElementById('slide-progress-bar').style.width = `${(num / SDA_PDF_TOTAL_PAGES) * 100}%`;
    document.getElementById('slide-prev-btn').disabled = num <= 1;
    document.getElementById('slide-next-btn').disabled = false;

    // Chegou ao último slide: libera o botão de concluir teoria.
    if (num >= SDA_PDF_TOTAL_PAGES) {
      document.getElementById('mark-slides-done-btn').disabled = false;
    }
  } catch (err) {
    console.error('Erro ao renderizar slide', err);
  } finally {
    loadingEl.classList.add('hidden');
    SDA_PDF_RENDERING = false;
  }
}

function sdaGoToSlide(delta) {
  const next = SDA_PDF_PAGE_NUM + delta;
  if (next < 1 || next > SDA_PDF_TOTAL_PAGES) return;
  SDA_PDF_PAGE_NUM = next;
  sdaRenderPdfPage(SDA_PDF_PAGE_NUM);
}

function setupSlideViewerControls() {
  document.getElementById('slide-canvas-wrap').addEventListener('click', () => sdaGoToSlide(1));
  document.getElementById('slide-next-btn').addEventListener('click', (e) => { e.stopPropagation(); sdaGoToSlide(1); });
  document.getElementById('slide-prev-btn').addEventListener('click', (e) => { e.stopPropagation(); sdaGoToSlide(-1); });
  document.addEventListener('keydown', (e) => {
    if (!SDA_PDF_DOC) return;
    if (e.key === 'ArrowRight' || e.key === ' ') sdaGoToSlide(1);
    if (e.key === 'ArrowLeft') sdaGoToSlide(-1);
  });
}

function markSlidesDone() {
  HackProgress.set(SDA_COURSE.id, { slidesDone: true, slidesProgress: 100 });
  refreshClassroomStatus();
  document.getElementById('quiz-embed-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Desafio HACK (embutido) ---------- */
function sdaOptionLetterLabel(letter) {
  return `<span class="quiz-option-letter">${letter}</span>`;
}

function sdaRenderQuestion() {
  const question = SDA_QUESTIONS[SDA_CURRENT_INDEX];
  SDA_ANSWERED = false;

  document.getElementById('quiz-scenario-badge').innerHTML =
    `<i class="fa-solid fa-map-pin mr-1.5"></i> Desafio HACK ${String(SDA_CURRENT_INDEX + 1).padStart(2, '0')}`;
  document.getElementById('quiz-scenario-title').textContent = question.scenario_title || '';
  document.getElementById('quiz-scenario-text').innerHTML = question.scenario_text || '';
  document.getElementById('quiz-question-text').textContent = question.question_text || '';

  const optionsWrap = document.getElementById('quiz-options');
  optionsWrap.innerHTML = '';
  SDA_OPTION_LETTERS.forEach((letter) => {
    const text = question[`option_${letter.toLowerCase()}`];
    if (!text) return;
    const btn = document.createElement('button');
    btn.className = 'quiz-option w-full text-left p-4 rounded-xl border border-slate-200 hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors flex items-start gap-3';
    btn.setAttribute('data-letter', letter);
    btn.innerHTML = `${sdaOptionLetterLabel(letter)}<span class="flex-1 text-slate-700 text-sm sm:text-base">${text}</span>`;
    btn.addEventListener('click', () => sdaSelectOption(letter));
    optionsWrap.appendChild(btn);
  });

  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');

  document.getElementById('quiz-question-section').classList.remove('hidden');
  document.getElementById('quiz-result-section').classList.add('hidden');
  document.getElementById('quiz-progress-section').classList.remove('hidden');

  sdaUpdateProgress();
}

function sdaUpdateProgress() {
  const total = SDA_QUESTIONS.length;
  const current = SDA_CURRENT_INDEX + 1;
  document.getElementById('quiz-progress-label').textContent = `Desafio ${current} de ${total}`;
  document.getElementById('quiz-score-label').innerHTML = `<i class="fa-solid fa-star text-brand-yellow-dark mr-1"></i>${SDA_SCORE} acerto${SDA_SCORE === 1 ? '' : 's'}`;
  document.getElementById('quiz-progress-bar').style.width = `${(SDA_CURRENT_INDEX / total) * 100}%`;
}

function sdaSelectOption(letter) {
  if (SDA_ANSWERED) return;
  SDA_ANSWERED = true;

  const question = SDA_QUESTIONS[SDA_CURRENT_INDEX];
  const correct = question.correct_option;
  const isCorrect = letter === correct;

  document.querySelectorAll('#quiz-options .quiz-option').forEach((btn) => {
    const btnLetter = btn.getAttribute('data-letter');
    btn.disabled = true;
    btn.classList.remove('hover:border-brand-yellow', 'hover:bg-brand-yellow/5');
    if (btnLetter === correct) {
      btn.classList.add('quiz-option-correct');
    } else if (btnLetter === letter && !isCorrect) {
      btn.classList.add('quiz-option-wrong');
    } else {
      btn.classList.add('opacity-50');
    }
  });

  const feedback = document.getElementById('quiz-feedback');
  const icon = document.getElementById('quiz-feedback-icon');
  const title = document.getElementById('quiz-feedback-title');
  const orientation = document.getElementById('quiz-feedback-orientation');

  feedback.classList.remove('hidden');
  if (isCorrect) {
    SDA_SCORE++;
    feedback.className = 'mt-6 p-5 rounded-xl bg-green-50 border border-green-200';
    icon.className = 'fa-solid fa-circle-check text-green-600';
    title.textContent = 'Resposta correta! Muito bem.';
    title.className = 'text-green-700';
  } else {
    feedback.className = 'mt-6 p-5 rounded-xl bg-red-50 border border-red-200';
    icon.className = 'fa-solid fa-circle-xmark text-red-500';
    title.textContent = `Não foi essa. A alternativa correta é a "${correct}".`;
    title.className = 'text-red-600';
  }
  orientation.innerHTML = question.orientation || '';

  sdaUpdateProgress();

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.classList.remove('hidden');
  const isLast = SDA_CURRENT_INDEX === SDA_QUESTIONS.length - 1;
  nextBtn.innerHTML = isLast
    ? 'Ver resultado final <i class="fa-solid fa-flag-checkered text-sm"></i>'
    : 'Próximo desafio <i class="fa-solid fa-arrow-right text-sm"></i>';
}

function sdaNextQuestion() {
  if (SDA_CURRENT_INDEX < SDA_QUESTIONS.length - 1) {
    SDA_CURRENT_INDEX++;
    sdaRenderQuestion();
  } else {
    sdaShowResult();
  }
}

function sdaShowResult() {
  document.getElementById('quiz-progress-section').classList.add('hidden');
  document.getElementById('quiz-question-section').classList.add('hidden');
  document.getElementById('quiz-result-section').classList.remove('hidden');

  const total = SDA_QUESTIONS.length;
  const percentage = Math.round((SDA_SCORE / total) * 100);

  document.getElementById('quiz-result-score').textContent = `${SDA_SCORE}/${total}`;
  document.getElementById('quiz-result-percentage').textContent = `${percentage}%`;

  let summary;
  if (percentage === 100) {
    summary = 'Perfeito! Você demonstrou domínio completo da postura de um estudante HACK. Parabéns!';
  } else if (percentage >= 70) {
    summary = 'Muito bom! Você já entende bem a metodologia HACK. Revise as orientações das questões que errou para fixar ainda mais.';
  } else if (percentage >= 40) {
    summary = 'Você está no caminho certo. Recomendamos revisar o material complementar e refazer o desafio para reforçar os conceitos.';
  } else {
    summary = 'Vamos com calma! Reveja os slides e o material complementar do curso e tente novamente — o objetivo é aprender, não decorar.';
  }
  document.getElementById('quiz-result-summary').textContent = summary;

  const progress = HackProgress.registerQuizResult(SDA_COURSE.id, SDA_SCORE, total);

  const approvedEl = document.getElementById('quiz-result-approved');
  const retryEl = document.getElementById('quiz-result-retry');
  const certLink = document.getElementById('quiz-result-cert-link');
  if (progress.approved) {
    approvedEl.classList.remove('hidden');
    retryEl.classList.add('hidden');
    certLink.classList.remove('hidden');
  } else {
    approvedEl.classList.add('hidden');
    retryEl.classList.remove('hidden');
    certLink.classList.add('hidden');
  }

  refreshClassroomStatus();
  document.getElementById('quiz-result-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function sdaRestartQuiz() {
  SDA_CURRENT_INDEX = 0;
  SDA_SCORE = 0;
  document.getElementById('quiz-result-section').classList.add('hidden');
  sdaRenderQuestion();
}

/* ---------- Carregamento inicial ---------- */
async function loadClassroom() {
  const user = HackAuth.getUser();
  if (!user) {
    window.location.href = `login.html?redirect=sala-de-aula.html?id=${getCourseIdFromUrlSDA() || ''}`;
    return;
  }

  const courseId = getCourseIdFromUrlSDA();
  if (!courseId) return showClassroomNotFound();

  try {
    const res = await fetch(`tables/courses/${courseId}`);
    if (!res.ok) return showClassroomNotFound();
    const course = await res.json();

    if (!course.slides_url) return showClassroomNotFound();
    SDA_COURSE = course;

    document.title = `Sala de Aula — ${course.title} — HACK ACADEMY`;
    document.getElementById('page-title').textContent = `Sala de Aula — ${course.title}`;
    document.getElementById('breadcrumb-course-link').textContent = course.title;
    document.getElementById('breadcrumb-course-link').href = `curso.html?id=${course.id}`;
    document.getElementById('classroom-category-badge').textContent = course.category;
    document.getElementById('classroom-title').textContent = course.title;
    document.getElementById('classroom-instructor').textContent = course.instructor_name;
    document.getElementById('classroom-duration').textContent = course.duration_hours;
    document.getElementById('classroom-level').textContent = course.level;

    document.getElementById('slides-download-link').href = course.slides_url;
    setupSlideViewerControls();
    await sdaLoadPdf(course.slides_url);

    if (course.material_complementar_url) {
      document.getElementById('material-section').classList.remove('hidden');
      document.getElementById('material-cover-link').href = course.material_complementar_url;
    }

    document.getElementById('mark-slides-done-btn').addEventListener('click', markSlidesDone);

    if (course.has_quiz) {
      const quizRes = await fetch('tables/quiz_questions?limit=100');
      const quizData = await quizRes.json();
      const all = quizData.data || [];
      SDA_QUESTIONS = all
        .filter((q) => q.course_id === course.id)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

      if (SDA_QUESTIONS.length > 0) {
        document.getElementById('quiz-embed-section').classList.remove('hidden');
        document.getElementById('quiz-next-btn').addEventListener('click', sdaNextQuestion);
        document.getElementById('quiz-restart-btn').addEventListener('click', sdaRestartQuiz);
        sdaRenderQuestion();
      }
    }

    document.getElementById('classroom-loading').classList.add('hidden');
    document.getElementById('classroom-content').classList.remove('hidden');

    refreshClassroomStatus();
  } catch (err) {
    console.error('Erro ao carregar sala de aula', err);
    showClassroomNotFound();
  }
}

document.addEventListener('DOMContentLoaded', loadClassroom);

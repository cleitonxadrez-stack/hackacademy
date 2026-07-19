/* ==========================================================================
   HACK ACADEMY — Página Certificados
   Exibe os certificados realmente conquistados pelo aluno (aprovado no
   Desafio HACK com 70%+ de acerto), usando HackProgress + js/certificado.js
   ========================================================================== */

async function loadCertificates() {
  const user = HackAuth.getUser();
  const list = document.getElementById('certificates-list');
  const loginRequired = document.getElementById('login-required');

  if (!user) {
    loginRequired.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch('tables/courses?limit=100');
    const data = await res.json();
    const all = data.data || [];

    const earned = all
      .map((course) => ({ course, progress: HackProgress.get(course.id) }))
      .filter((item) => item.progress.approved);

    if (earned.length === 0) {
      list.innerHTML = `
        <div class="text-center bg-white rounded-2xl p-12 shadow-sm">
          <i class="fa-solid fa-certificate text-4xl text-slate-200 mb-4"></i>
          <h2 class="font-semibold text-xl text-slate-800 mb-2">Você ainda não possui certificados</h2>
          <p class="text-slate-500 mb-6">Conclua os slides de um curso e acerte 7 ou mais de 10 no Desafio HACK para liberar seu certificado.</p>
          <a href="cursos.html" class="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold">Ver Cursos Disponíveis</a>
        </div>`;
      return;
    }

    list.innerHTML = earned.map((item) => renderCertificateCard(item.course, user, item.progress)).join('');

    bindCertificateDownloadButtons();

    earned.forEach((item) => {
      mountCertificatePreview(item.course, user, item.progress);
    });
  } catch (err) {
    console.error('Erro ao carregar certificados', err);
  }
}

document.addEventListener('DOMContentLoaded', loadCertificates);

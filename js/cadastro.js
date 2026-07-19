/* ==========================================================================
   HACK ACADEMY — Solicitação de Cadastro (Aluno/Professor)
   Grava a solicitação na tabela `registration_requests` com status "Pendente".
   Um gestor precisa aprovar em admin.html para o acesso ser considerado liberado.
   ========================================================================== */

let REG_SELECTED_ROLE = 'Aluno';

function setupRegRoleTabs() {
  const tabAluno = document.getElementById('reg-tab-aluno');
  const tabProfessor = document.getElementById('reg-tab-professor');
  if (!tabAluno || !tabProfessor) return;

  tabAluno.addEventListener('click', () => {
    REG_SELECTED_ROLE = 'Aluno';
    tabAluno.classList.add('active');
    tabProfessor.classList.remove('active');
  });
  tabProfessor.addEventListener('click', () => {
    REG_SELECTED_ROLE = 'Professor';
    tabProfessor.classList.add('active');
    tabAluno.classList.remove('active');
  });
}

function setupRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('registration-submit-btn');

    const payload = {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      phone: document.getElementById('reg-phone').value.trim(),
      requested_role: REG_SELECTED_ROLE,
      course_interest: document.getElementById('reg-course').value.trim(),
      message: document.getElementById('reg-message').value.trim(),
      status: 'Pendente'
    };

    if (!payload.name || !payload.email) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
      const res = await fetch('tables/registration_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Falha ao enviar solicitação');

      form.classList.add('hidden');
      document.getElementById('registration-success').classList.remove('hidden');
    } catch (err) {
      console.error('Erro ao enviar solicitação de cadastro', err);
      alert('Não foi possível enviar sua solicitação agora. Tente novamente em breve.');
      btn.disabled = false;
      btn.innerHTML = 'Enviar solicitação de cadastro';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupRegRoleTabs();
  setupRegistrationForm();
});

/* ==========================================================================
   HACK ACADEMY — Formulário de contato
   ========================================================================== */

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn');
    const successMsg = document.getElementById('contact-success');

    const payload = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      subject: document.getElementById('contact-subject').value.trim(),
      message: document.getElementById('contact-message').value.trim()
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
      const res = await fetch('tables/contact_messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Falha ao enviar');

      form.reset();
      successMsg.classList.remove('hidden');
      setTimeout(() => successMsg.classList.add('hidden'), 6000);
    } catch (err) {
      console.error('Erro ao enviar mensagem de contato', err);
      alert('Não foi possível enviar sua mensagem agora. Tente novamente em breve.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Enviar mensagem <i class="fa-solid fa-paper-plane text-sm"></i>';
    }
  });
}

document.addEventListener('DOMContentLoaded', setupContactForm);

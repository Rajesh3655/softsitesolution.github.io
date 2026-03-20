/* contact.js — EmailJS integration */
(function() {
  const SERVICE_ID   = 'service_b9q299l';
  const TEMPLATE_ID  = 'template_5qiv81p';
  const PUBLIC_KEY   = 'k5ubOqKiKKdsPPOtL';

  document.addEventListener('DOMContentLoaded', function() {
    emailjs.init(PUBLIC_KEY);

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name    = form.querySelector('[name="from_name"]').value.trim();
      const email   = form.querySelector('[name="reply_to"]').value.trim();
      const subject = form.querySelector('[name="subject"]')?.value.trim() || 'General Inquiry';
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Disable button
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Sending…';
      submitBtn.style.opacity = '0.75';

      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:   name,
        reply_to:    email,
        subject:     subject,
        message:     message,
        page_source: 'SoftSiteSolutions Contact Page',
      }).then(function() {
        showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success', 5000);
        form.reset();
      }).catch(function(err) {
        console.error('EmailJS error:', err);
        showToast('Failed to send message. Please email us directly at softsitesolutions@gmail.com', 'error', 6000);
      }).finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        submitBtn.style.opacity = '1';
      });
    });
  });
})();

/* Spinner keyframe */
const style = document.createElement('style');
style.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(style);

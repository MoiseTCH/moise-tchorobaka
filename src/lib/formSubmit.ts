/*
  Shared form-submission handler for Contact and Get a Quote.

  INTEGRATION POINT — READ BEFORE DEPLOYING:
  This targets Netlify Forms' convention: a POST to "/" with
  x-www-form-urlencoded data including the form's own "form-name" field.
  Netlify's build bots detect the static HTML form (data-netlify="true" +
  hidden form-name input, both already on the <form> elements in
  contact.astro / get-a-quote.astro) and provision an inbox for it
  automatically — no API key, no secret, nothing to configure in code.

  If this project is NOT deployed to Netlify, this integration will not
  work as-is and needs to be swapped for whatever form service is chosen
  (e.g. Formspree, a custom serverless function) — that requires an
  endpoint URL and possibly a form ID which are not available in this
  environment, so no fallback service has been invented or guessed at.
  The validation, duplicate-submit prevention, and accessible
  success/error handling below are all provider-agnostic and would not
  need to change if the fetch target does.

  No credentials of any kind are used or required by this file.
*/

export interface FormHandlerOptions {
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export function initFormHandler(form: HTMLFormElement, statusEl: HTMLElement, options: FormHandlerOptions) {
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitBtn) return;
  const originalLabel = submitBtn.textContent ?? '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Duplicate-submission guard — a disabled button can't be clicked
    // again while a request is already in flight.
    if (submitBtn.disabled) return;

    // Honeypot spam check — Netlify's convention is a hidden field named
    // "bot-field"; if it has a value, a bot filled it in and we silently
    // drop the submission rather than sending it or showing an error that
    // would help a bot learn to avoid the trap.
    const honeypot = form.querySelector<HTMLInputElement>('input[name="bot-field"]');
    if (honeypot && honeypot.value) return;

    submitBtn.disabled = true;
    submitBtn.textContent = options.sendingLabel;
    statusEl.textContent = '';

    const formData = new FormData(form);
    const body = new URLSearchParams(formData as unknown as Record<string, string>).toString();

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (response.ok) {
        form.hidden = true;
        statusEl.textContent = options.successMessage;
        statusEl.setAttribute('role', 'status');
      } else {
        throw new Error(`Form submission failed with status ${response.status}`);
      }
    } catch {
      statusEl.textContent = options.errorMessage;
      statusEl.setAttribute('role', 'alert');
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

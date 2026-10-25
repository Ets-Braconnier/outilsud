/** Contact form: creates an email draft, does not send directly. */
import {prepareEmail} from './common.js';
document.querySelector('#contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const d = Object.fromEntries(new FormData(event.currentTarget));
  prepareEmail('Contact via le site Outilsud', `Nom : ${d.name}\nE-mail : ${d.email}\n\n${d.message}`);
});

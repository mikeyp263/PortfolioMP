'use strict';
const scenarios = {
 lead: [
  ['Inquiry received','INTAKE','A new conversation starts.','A customer sends a message, submits a form, or reaches out through social media.','TRIGGER','New inbound inquiry'],
  ['Contact routed','CRM','The inquiry has a place.','The contact enters the CRM and the appropriate pipeline so the team can track what happens next.','ACTION','Contact routed to the pipeline'],
  ['AI responds','CONVERSATION','The conversation keeps moving.','AI engages the customer based on the channel, conversation timing, and configured workflow.','ACTION','AI response workflow activated'],
  ['Next step','FOLLOW-UP','There’s a next step.','Appointment workflows support booking and reminders. Follow-up sequences reconnect with contacts who go quiet.','PATHS','Booking or re-engagement']
 ],
 inventory: [
  ['Database','SOURCE','Inventory starts with data.','The Sugar Sweet Georgia Puppies database holds the inventory information used by its connected business systems.','SOURCE','Puppy inventory database'],
  ['n8n integration','CONNECT','n8n connects the systems.','The integration connects database information to the tools used by the business.','CONNECTION','Database → n8n'],
  ['HighLevel','OPERATIONS','Inventory is available in the CRM.','Live puppy inventory is brought into HighLevel for use in the business’s operations.','DESTINATION','HighLevel inventory'],
  ['Website','WEBSITE','Customers can explore inventory.','The website also displays live inventory. HighLevel and the website are destinations of the integration; this sequence is a walkthrough, not a sync timing guarantee.','DESTINATION','Website inventory']
 ],
 waitlist: [
  ['Breed interest','INTEREST','A customer has a breed in mind.','Breed interest gives the business context for organizing the customer’s inquiry.','INPUT','Customer’s breed preference'],
  ['Organize contact','CRM','Keep that preference with the contact.','Breed-interest information helps organize contacts in the CRM.','ACTION','Customer interest recorded'],
  ['Waitlist','WORKFLOW','Add interest to the waitlist.','The breed-specific waitlist workflow organizes interested customers for follow-up.','ACTION','Breed waitlist workflow'],
  ['Follow-up','RECONNECT','Keep the conversation going.','Follow-up workflows help the business reconnect with customers on the waitlist.','ACTION','Waitlist follow-up']
 ]
};
let selected = 'lead';
let step = 0;
const list = document.getElementById('steps');
const next = document.getElementById('next');
function render() {
 const flow = scenarios[selected];
 list.replaceChildren(...flow.map((item, i) => {
  const li = document.createElement('li');
  const number = document.createElement('span');
  number.textContent = String(i + 1).padStart(2, '0');
  li.append(number, document.createTextNode(item[0]));
  li.className = i === step ? 'active' : i < step ? 'done' : '';
  if (i === step) li.setAttribute('aria-current', 'step');
  return li;
 }));
 const current = flow[step];
 document.getElementById('stage-label').textContent = `${String(step + 1).padStart(2, '0')} / ${current[1]}`;
 document.getElementById('stage-title').textContent = current[2];
 document.getElementById('stage-copy').textContent = current[3];
 document.querySelector('#stage-event span').textContent = current[4];
 document.querySelector('#stage-event strong').textContent = current[5];
 next.textContent = step === flow.length - 1 ? 'Replay ↺' : 'Next step →';
}
document.querySelectorAll('[data-scenario]').forEach(button => {
 button.addEventListener('click', () => {
  selected = button.dataset.scenario;
  step = 0;
  document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render();
 });
});
next.addEventListener('click', () => { step = (step + 1) % scenarios[selected].length; render(); });
document.getElementById('reset').addEventListener('click', () => { step = 0; render(); });

// Keep every portfolio section one click away and indicate the current section.
const sectionLinks = [...document.querySelectorAll('.sidebar nav a')];
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  if (!visible.length) return;
  const id = visible[0].target.id;
  sectionLinks.forEach(link => {
   if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'location');
   else link.removeAttribute('aria-current');
  });
 }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
 document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}
document.querySelectorAll('[data-open-demo]').forEach(link => {
 link.addEventListener('click', () => {
  const button = document.querySelector('[data-scenario="' + link.dataset.openDemo + '"]');
  if (button) button.click();
 });
});

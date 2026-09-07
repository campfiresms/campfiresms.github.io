// The transcript remains fully readable without JavaScript.
const replay = document.querySelector('.demo-replay');
const messages = [...document.querySelectorAll('.relay-window-body p')];
if (replay && messages.length) {
  replay.hidden = false;
  replay.addEventListener('click', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    replay.disabled = true;
    messages.forEach(message => { message.style.visibility = 'hidden'; });
    messages.forEach((message, index) => {
      window.setTimeout(() => {
        message.style.visibility = 'visible';
        if (index === messages.length - 1) replay.disabled = false;
      }, 600 + index * 1100);
    });
  });
}

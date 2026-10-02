(() => {
  "use strict";

  const demo = document.querySelector("[data-demo]");
  if (!demo) return;
  const replay = demo.querySelector(".demo-replay");
  const pause = demo.querySelector(".demo-pause");
  const beats = [...demo.querySelectorAll("[data-beat]")];
  const route = demo.querySelector(".delivery-path");
  const agentStatus = demo.querySelector("[data-agent-status]");
  const progress = demo.querySelector("[data-progress]");
  const composer = demo.querySelector("[data-compose]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reply = demo.querySelector(".sms-from-you p").textContent;

  // A scripted presentation of the exchange. It never sends SMS or calls an agent.
  // Both screens remain fully readable without JavaScript or with reduced motion.
  const timeline = [
    { at: 0, beat: 0, agent: "Checking the sender", progress: "Your agent checks the lead" },
    { at: 1300, beat: 1, direction: "to-phone", agent: "Waiting for your reply", progress: "Your agent sends you a text" },
    { at: 2000, beat: 2 },
    { at: 4500, beat: 3, direction: "to-agent", progress: "You reply from your text inbox" },
    { at: 5200, beat: 4, agent: "Following your instruction", progress: "Your reply reaches the agent" },
    { at: 6800, beat: 5, agent: "Staff verifying the sender", progress: "Your agent asks staff to verify" },
    { at: 7900, direction: "to-phone" },
    { at: 8600, beat: 6, progress: "Staff verifying · PDF unopened" },
  ];
  let frame = 0;
  let playing = false;
  let paused = false;
  let elapsed = 0;
  let lastTime = null;
  let step = 0;
  let autoStarted = false;

  const reveal = (beat) => beats.find((element) => element.dataset.beat === String(beat))?.classList.add("is-visible");
  const resetRoute = () => route.classList.remove("to-phone", "to-agent");

  function finish() {
    window.cancelAnimationFrame(frame);
    playing = false;
    paused = false;
    demo.classList.remove("is-playing", "is-paused", "is-typing");
    beats.forEach((beat) => beat.classList.remove("is-visible"));
    resetRoute();
    composer.textContent = "Text Message";
    agentStatus.textContent = "Staff verifying the sender";
    progress.textContent = "Staff verifying · PDF unopened";
    pause.hidden = true;
  }

  function tick(time) {
    if (!playing) return;
    if (lastTime !== null && !paused && !document.hidden) elapsed += time - lastTime;
    lastTime = time;
    if (!paused && !document.hidden) {
      while (step < timeline.length && elapsed >= timeline[step].at) {
        const event = timeline[step++];
        if (event.beat !== undefined) reveal(event.beat);
        if (event.agent) agentStatus.textContent = event.agent;
        if (event.progress) progress.textContent = event.progress;
        if (event.direction) {
          resetRoute();
          route.classList.add(event.direction);
        }
      }
      if (elapsed >= 2800 && elapsed < 4500) {
        demo.classList.add("is-typing");
        const count = Math.min(reply.length, Math.ceil((elapsed - 2800) / 1700 * reply.length));
        composer.textContent = reply.slice(0, count) || "Text Message";
      } else {
        demo.classList.remove("is-typing");
        composer.textContent = "Text Message";
      }
      if (elapsed >= 10000) {
        finish();
        return;
      }
    }
    frame = window.requestAnimationFrame(tick);
  }

  function play() {
    autoStarted = true;
    finish();
    if (reducedMotion.matches) return;
    playing = true;
    elapsed = 0;
    lastTime = null;
    step = 0;
    demo.classList.add("is-playing");
    agentStatus.textContent = "Checking the sender";
    progress.textContent = "Your agent checks the lead";
    reveal(0);
    pause.textContent = "Pause";
    pause.hidden = false;
    frame = window.requestAnimationFrame(tick);
  }

  replay.hidden = false;
  replay.addEventListener("click", play);
  pause.addEventListener("click", () => {
    paused = !paused;
    demo.classList.toggle("is-paused", paused);
    pause.textContent = paused ? "Resume" : "Pause";
  });
  document.addEventListener("visibilitychange", () => { lastTime = null; });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) finish();
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !autoStarted) {
        play();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(demo.querySelector(".demo-phone"));
  }
})();

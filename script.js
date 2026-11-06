document.addEventListener("DOMContentLoaded", () => {

  /* SECTION NAVIGATION */
  const sections = document.querySelectorAll(".section");
  let current = 0;

  window.nextSection = function() {
    sections[current].classList.remove("active");
    current++;
    if(current >= sections.length) current = sections.length - 1;
    sections[current].classList.add("active");

    if (sections[current].classList.contains("story")) startTyping();
  };

  /* SLIDESHOW AUTOPLAY */
  const slides = document.querySelectorAll(".slide-img");
  let slideIndex = 0;

  function showSlide() {
    slides.forEach(s => s.classList.remove("active"));
    slides[slideIndex].classList.add("active");
    slideIndex = (slideIndex + 1) % slides.length;
  }

  setInterval(showSlide, 4000);

  /* TYPING EFFECT */
  const storyText = document.querySelector(".story-text p");
  const fullText = storyText.innerHTML;
  storyText.innerHTML = "";

  function startTyping() {
    let i = 0;
    function type() {
      if (i < fullText.length) {
        storyText.innerHTML += fullText.charAt(i);
        i++;
        setTimeout(type, 35);
      }
    }
    type();
  }

  /* FLOATING EMOJI ON HOVER */
  document.querySelectorAll(".interactive-btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      spawnEmoji("💖", btn.getBoundingClientRect());
    });
  });

  function spawnEmoji(emoji, rect) {
    const el = document.createElement("div");
    el.textContent = emoji;
    el.style.position = "absolute";
    el.style.left = rect.left + rect.width / 2 + "px";
    el.style.top = rect.top + "px";
    el.style.fontSize = "20px";
    document.body.appendChild(el);

    let move = setInterval(() => {
      el.style.top = el.offsetTop - 2 + "px";
      el.style.opacity -= 0.03;
      if (el.style.opacity <= 0) {
        el.remove();
        clearInterval(move);
      }
    }, 20);
  }

  /* MINI SURPRISE CLICK EMOJIS */
  document.querySelector(".story").addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") return;
    const emojis = ["💖","✨","🌸","💌","🥰","🌟"];
    const pop = document.createElement("div");
    pop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    pop.style.position = "absolute";
    pop.style.left = e.clientX + "px";
    pop.style.top = e.clientY + "px";
    pop.style.fontSize = "24px";
    document.body.appendChild(pop);

    setTimeout(() => {
      pop.style.top = e.clientY - 100 + "px";
      pop.style.opacity = 0;
    }, 10);

    setTimeout(() => pop.remove(), 1000);
  });

  /* YES CONFETTI + SPARKLES */
  function confetti() {
    for (let i = 0; i < 30; i++) {
      const h = document.createElement("div");
      h.textContent = "❤️";
      h.style.position = "absolute";
      h.style.left = Math.random() * 100 + "vw";
      h.style.top = "-10px";
      document.body.appendChild(h);

      let fall = setInterval(() => {
        h.style.top = h.offsetTop + 4 + "px";
        if (h.offsetTop > window.innerHeight) {
          h.remove();
          clearInterval(fall);
        }
      }, 30);
    }
  }

  function sparkle() {
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("div");
      s.textContent = "✨";
      s.style.position = "absolute";
      s.style.left = Math.random() * 100 + "vw";
      s.style.top = Math.random() * 100 + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  }

 window.sendAnswer = function(answer) {
  fetch("https://script.google.com/macros/s/AKfycbyc3VpybSLG4Tnu2iuDMhW5j902p6snyaTBl4xrrJLyeug9CRAI6dTH2HVG6oIXIpg7/exec", {  // <-- replace this
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({ response: answer })
  })
  .then(res => res.text())
  .then(() => {
    // Show final section + confetti
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.querySelector(".final").classList.add("active");

    confetti();
    sparkle();
  })
  .catch(err => {
    console.error("Google Sheets error:", err);
  });
};

});

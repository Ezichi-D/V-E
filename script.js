
document.addEventListener("DOMContentLoaded", () => {

  /* SECTION NAVIGATION */
  const sections = document.querySelectorAll(".section");
  let current = 0;

  window.nextSection = function() {
    if (current >= sections.length - 1) return;

    sections[current].classList.remove("active");
    current++;

    sections[current].classList.add("active");

    if (sections[current].classList.contains("story")) {
      startTyping();
    }
  };


  /* SLIDESHOW AUTOPLAY */
  const slides = document.querySelectorAll(".slide-img");
  let slideIndex = 0;

  function showSlide() {
    if (!slides.length) return;

    slides.forEach(slide => slide.classList.remove("active"));

    slides[slideIndex].classList.add("active");

    slideIndex = (slideIndex + 1) % slides.length;
  }

  if (slides.length > 1) {
    setInterval(showSlide, 4000);
  }


  /* TYPING EFFECT */
  const storyText = document.querySelector(".story-text p");
  const fullText = storyText ? storyText.innerHTML : "";
  let typingStarted = false;

  function startTyping() {
    if (!storyText || typingStarted) return;

    typingStarted = true;
    storyText.innerHTML = "";

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


  /* FLOATING EMOJI ON BUTTON HOVER */
  document.querySelectorAll(".interactive-btn").forEach(btn => {

    btn.addEventListener("mouseenter", () => {
      spawnEmoji("💖", btn.getBoundingClientRect());
    });

  });


  function spawnEmoji(emoji, rect) {
    const el = document.createElement("div");

    el.textContent = emoji;
    el.style.position = "fixed";
    el.style.left = rect.left + rect.width / 2 + "px";
    el.style.top = rect.top + "px";
    el.style.fontSize = "20px";
    el.style.pointerEvents = "none";

    document.body.appendChild(el);

    let opacity = 1;

    const move = setInterval(() => {
      el.style.top = (parseFloat(el.style.top) - 2) + "px";

      opacity -= 0.03;
      el.style.opacity = opacity;

      if (opacity <= 0) {
        el.remove();
        clearInterval(move);
      }

    }, 20);
  }


  /* MINI SURPRISE CLICK EMOJIS */
  const storySection = document.querySelector(".story");

  if (storySection) {

    storySection.addEventListener("click", e => {

      if (e.target.closest("button")) return;

      const emojis = ["💖", "✨", "🌸", "💌", "🥰", "🌟"];

      const pop = document.createElement("div");

      pop.textContent = emojis[
        Math.floor(Math.random() * emojis.length)
      ];

      pop.style.position = "fixed";
      pop.style.left = e.clientX + "px";
      pop.style.top = e.clientY + "px";
      pop.style.fontSize = "24px";
      pop.style.pointerEvents = "none";
      pop.style.transition = "all 1s ease";

      document.body.appendChild(pop);

      setTimeout(() => {
        pop.style.top = (e.clientY - 100) + "px";
        pop.style.opacity = 0;
      }, 10);

      setTimeout(() => pop.remove(), 1000);

    });

  }


  /* YES CONFETTI */
  function confetti() {

    for (let i = 0; i < 30; i++) {

      const h = document.createElement("div");

      h.textContent = "❤️";
      h.style.position = "fixed";
      h.style.left = Math.random() * 100 + "vw";
      h.style.top = "-10px";
      h.style.fontSize = "20px";
      h.style.pointerEvents = "none";

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


  /* SPARKLE ANIMATION */
  function sparkle() {

    for (let i = 0; i < 20; i++) {

      const s = document.createElement("div");

      s.textContent = "✨";
      s.style.position = "fixed";
      s.style.left = Math.random() * 100 + "vw";
      s.style.top = Math.random() * 100 + "vh";
      s.style.fontSize = "20px";
      s.style.pointerEvents = "none";

      document.body.appendChild(s);

      setTimeout(() => s.remove(), 2000);

    }

  }


  /* VALENTINE RESPONSE */
  let answerSubmitted = false;

  window.sendAnswer = function(answer) {

    if (answerSubmitted) return;

    answerSubmitted = true;

    // Disable both YES buttons
    document.querySelectorAll(".question button").forEach(btn => {
      btn.disabled = true;
    });

    // Hide all sections
    sections.forEach(section => {
      section.classList.remove("active");
    });

    // Immediately show the final section
    const finalSection = document.querySelector(".final");

    if (finalSection) {
      finalSection.classList.add("active");
    }

    // Launch celebrations
    confetti();
    sparkle();


    // Send response to Google Sheets independently
    fetch("https://script.google.com/macros/s/AKfycbyc3VpybSLG4Tnu2iuDMhW5j902p6snyaTBl4xrrJLyeug9CRAI6dTH2HVG6oIXIpg7/exec", {

      method: "POST",
      mode: "no-cors",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify({
        response: answer
      })

    })

    .catch(err => {
      console.error("Google Sheets submission error:", err);
    });

  };

});

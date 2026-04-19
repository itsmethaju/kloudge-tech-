(function () {
  "use strict";

  // CURSOR
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (cursor && ring) {
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll("a, button, .svc-card, .t-card, .contact-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        ring.style.width = "52px";
        ring.style.height = "52px";
        ring.style.borderColor = "rgba(0,245,255,0.8)";
      });
      el.addEventListener("mouseleave", function () {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(0,245,255,0.5)";
      });
    });
  }

  // PARTICLES
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W;
    let H;
    const particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,245,255," + (this.alpha + Math.sin(this.pulse) * 0.05) + ")";
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    let mouseX = W / 2;
    let mouseY = H / 2;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      particles.forEach(function (p) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          p.vx += (dx / dist) * 0.05;
          p.vy += (dy / dist) * 0.05;
        }
      });
    });

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(0,245,255," + (1 - dist / 120) * 0.08 + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animParticles);
    }

    animParticles();
  }

  // COUNTER ANIMATION
  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      const target = +el.dataset.count;
      const suffix = String(el.dataset.count) === "98" ? "%" : "+";
      let current = 0;
      const step = target / 60;
      const interval = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(interval);
      }, 20);
    });
  }

  setTimeout(animateCounters, 600);

  // SCROLL REVEAL
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(function (el) {
    observer.observe(el);
  });
})();

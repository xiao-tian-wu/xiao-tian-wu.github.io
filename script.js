(function () {
  const reel = document.querySelector(".reel");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const navLinks = Array.from(document.querySelectorAll("[data-slide]"));
  const topNavLinks = Array.from(document.querySelectorAll(".topbar [data-slide]"));
  const previousButton = document.querySelector(".previous");
  const nextButton = document.querySelector(".next");
  let activeIndex = 0;
  let scrollTimer;
  let animationFrame;
  let isAnimating = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setActive(index, updateHash) {
    const previousIndex = activeIndex;
    activeIndex = clamp(index, 0, slides.length - 1);

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    topNavLinks.forEach(function (link) {
      link.classList.toggle("active", Number(link.dataset.slide) === activeIndex);
    });

    document.body.dataset.slide = String(activeIndex);
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;

    const activeNav = topNavLinks.find(function (link) {
      return Number(link.dataset.slide) === activeIndex;
    });

    if (activeNav && window.innerWidth <= 760 && previousIndex !== activeIndex) {
      const nav = activeNav.parentElement;
      if (nav) {
        const targetLeft = activeNav.offsetLeft - (nav.clientWidth - activeNav.offsetWidth) / 2;
        nav.scrollTo({ left: targetLeft, behavior: "smooth" });
      }
    }

    if (updateHash) {
      history.replaceState(null, "", "#" + slides[activeIndex].id);
    }
  }

  function updateVisualState() {
    const width = reel.clientWidth || 1;
    const position = reel.scrollLeft / width;

    slides.forEach(function (slide, slideIndex) {
      const distance = clamp(slideIndex - position, -1, 1);
      const reveal = 1 - Math.abs(distance);
      slide.style.setProperty("--parallax-x", distance * 16 + "px");
      slide.style.setProperty("--content-opacity", reveal.toFixed(3));
      slide.style.setProperty("--content-x", distance * 24 + "px");
      slide.style.setProperty("--content-y", (1 - reveal) * 10 + "px");
      slide.style.setProperty("--content-scale", (0.992 + reveal * 0.008).toFixed(3));
    });
  }

  function stopAnimation() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }

    isAnimating = false;
    reel.classList.remove("is-animating");
  }

  function easeInOutCubic(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function goTo(index, smooth) {
    const targetIndex = clamp(index, 0, slides.length - 1);
    const start = reel.scrollLeft;
    const end = targetIndex * reel.clientWidth;
    const distance = Math.abs(end - start);

    stopAnimation();

    if (smooth === false || distance < 1) {
      reel.scrollLeft = end;
      updateVisualState();
      setActive(targetIndex, true);
      return;
    }

    isAnimating = true;
    reel.classList.add("is-animating");
    document.body.dataset.direction = end > start ? "next" : "previous";
    setActive(targetIndex, true);

    const pages = distance / Math.max(reel.clientWidth, 1);
    const duration = Math.min(1050, 760 + Math.max(0, pages - 1) * 120);
    const startedAt = performance.now();

    function animate(now) {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOutCubic(elapsed);
      reel.scrollLeft = start + (end - start) * eased;
      updateVisualState();

      if (elapsed < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        reel.scrollLeft = end;
        stopAnimation();
        updateVisualState();
        setActive(targetIndex, true);
      }
    }

    animationFrame = window.requestAnimationFrame(animate);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      goTo(Number(link.dataset.slide));
    });
  });

  previousButton.addEventListener("click", function () {
    goTo(activeIndex - 1);
  });

  nextButton.addEventListener("click", function () {
    goTo(activeIndex + 1);
  });

  reel.addEventListener(
    "scroll",
    function () {
      updateVisualState();
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        if (isAnimating) return;
        const index = Math.round(reel.scrollLeft / reel.clientWidth);
        const target = index * reel.clientWidth;

        if (Math.abs(reel.scrollLeft - target) > 1) {
          goTo(index);
        } else {
          setActive(index, true);
        }
      }, 110);
    },
    { passive: true },
  );

  reel.addEventListener("pointerdown", stopAnimation, { passive: true });
  reel.addEventListener("wheel", function () {
    if (isAnimating) stopAnimation();
  }, { passive: true });

  window.addEventListener("keydown", function (event) {
    const activeElement = document.activeElement;
    const isTyping = activeElement && /input|textarea|select/i.test(activeElement.tagName);
    if (isTyping) return;

    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  window.addEventListener("resize", function () {
    stopAnimation();
    goTo(activeIndex, false);
  });

  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  document.documentElement.classList.add("motion-ready");

  const hashIndex = slides.findIndex(function (slide) {
    return "#" + slide.id === window.location.hash;
  });

  setActive(hashIndex >= 0 ? hashIndex : 0, false);
  requestAnimationFrame(function () {
    if (hashIndex > 0) {
      goTo(hashIndex, false);
    } else {
      updateVisualState();
    }
  });
})();

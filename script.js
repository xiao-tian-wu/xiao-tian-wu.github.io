(function () {
  const reel = document.querySelector(".reel");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const navLinks = Array.from(document.querySelectorAll("[data-slide]"));
  const topNavLinks = Array.from(document.querySelectorAll(".topbar [data-slide]"));
  const previousButton = document.querySelector(".previous");
  const nextButton = document.querySelector(".next");
  let activeIndex = 0;
  let scrollTimer;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setActive(index, updateHash) {
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

    if (activeNav && window.innerWidth <= 760) {
      activeNav.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    if (updateHash) {
      history.replaceState(null, "", "#" + slides[activeIndex].id);
    }
  }

  function goTo(index, smooth) {
    const targetIndex = clamp(index, 0, slides.length - 1);
    reel.scrollTo({
      left: targetIndex * reel.clientWidth,
      behavior: smooth === false ? "auto" : "smooth",
    });
    setActive(targetIndex, true);
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
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        const index = Math.round(reel.scrollLeft / reel.clientWidth);
        setActive(index, true);
      }, 80);
    },
    { passive: true },
  );

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
    goTo(activeIndex, false);
  });

  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  const hashIndex = slides.findIndex(function (slide) {
    return "#" + slide.id === window.location.hash;
  });

  setActive(hashIndex >= 0 ? hashIndex : 0, false);
  requestAnimationFrame(function () {
    if (hashIndex > 0) goTo(hashIndex, false);
  });
})();

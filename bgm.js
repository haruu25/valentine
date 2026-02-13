(() => {
  const AUDIO_SRC = "assets/musik.mp3";
  const KEY_ENABLED = "bgm_enabled";
  const KEY_TIME = "bgm_time";

  const audio = document.createElement("audio");
  audio.id = "bgm";
  audio.src = AUDIO_SRC;
  audio.loop = true;
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.volume = 0.9;
  audio.style.display = "none";
  document.body.appendChild(audio);

  // restore time setelah metadata kebaca (lebih aman)
  audio.addEventListener("loadedmetadata", () => {
    const saved = parseFloat(localStorage.getItem(KEY_TIME) || "0");
    if (!Number.isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved;
    }
  });

  async function tryPlay() {
    try {
      await audio.play();
      localStorage.setItem(KEY_ENABLED, "1");
    } catch (e) {
      // autoplay diblok: normal, akan nyala pas ada tap
    }
  }

  // simpan progress
  setInterval(() => {
    if (!audio.paused && !isNaN(audio.currentTime)) {
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
    }
  }, 1000);

  // trigger paling awal (capture) biar kejadian sebelum link pindah page
  function onFirstInteract() {
    tryPlay();
    remove();
  }

  function add() {
    document.addEventListener("pointerdown", onFirstInteract, {
      once: true,
      capture: true,
    });
    document.addEventListener("touchstart", onFirstInteract, {
      once: true,
      capture: true,
    });
    document.addEventListener("click", onFirstInteract, {
      once: true,
      capture: true,
    });
  }

  function remove() {
    document.removeEventListener("pointerdown", onFirstInteract, {
      capture: true,
    });
    document.removeEventListener("touchstart", onFirstInteract, {
      capture: true,
    });
    document.removeEventListener("click", onFirstInteract, { capture: true });
  }

  window.addEventListener("load", () => {
    // selalu coba play saat load
    tryPlay();
    // dan selalu pasang listener, karena iOS butuh tap
    add();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlay();
  });
})();

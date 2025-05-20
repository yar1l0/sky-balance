(function () {
  const ERROR_MESSAGES = [
    "Network Error",
    "VPN Detected",
    "Access via VPN is not permitted",
  ];

  function isBlockedPopup(el) {
    return ERROR_MESSAGES.some((msg) => (el.innerText || "").includes(msg));
  }

  function allowAppScroll() {
    const main = document.querySelector("main");
    if (main) {
      main.style.overflowY = "auto";
      main.style.overflowX = "hidden";
    }

    document.querySelectorAll(".details-pane").forEach((pane) => {
      pane.style.overflow = "auto";
    });
  }

  function closePopup(el) {
    const overlay = el.previousElementSibling;
    if (overlay?.dataset.state === "open") overlay.style.display = "none";

    el.style.display = "none";

    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
    document.body.removeAttribute("data-scroll-locked");

    allowAppScroll();
  }

  function observePopups() {
    document
      .querySelectorAll('div[role="dialog"][data-state="open"]')
      .forEach((el) => {
        if (isBlockedPopup(el)) closePopup(el);
      });

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.matches('div[role="dialog"][data-state="open"]') &&
            isBlockedPopup(node)
          ) {
            closePopup(node);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Блокировка скролла
  (function disableScroll() {
    const preventOptions = { capture: true, passive: false };
    const disableScrollHandler = (e) => e.stopImmediatePropagation();

    ["wheel", "touchmove"].forEach((event) => {
      document.documentElement.addEventListener(event, disableScrollHandler, preventOptions);
      document.body.addEventListener(event, disableScrollHandler, preventOptions);
    });
  })();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observePopups);
  } else {
    observePopups();
  }
})();

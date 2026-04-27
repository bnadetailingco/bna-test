/**
 * BNA Detailing Co. — Chat Widget
 * Drop-in script. Add to any page with:
 *   <script src="chatbot-widget.js"></script>
 *
 * To override the backend URL on a specific page, set BEFORE loading this script:
 *   <script>window.BNA_CHATBOT_BACKEND_URL = "https://your-custom-url.com";</script>
 */
(function () {
  "use strict";

  // ── Config ──────────────────────────────────────────────────────────────────
  const BASE_URL = (window.BNA_CHATBOT_BACKEND_URL || "https://bna-bot.onrender.com").replace(/\/chat$/, "");
  const BACKEND_URL = BASE_URL + "/chat";
  const QUOTE_URL   = BASE_URL + "/quote";

  // ── Inject CSS ───────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #bna-widget, #bna-widget * {
      box-sizing: border-box; margin: 0; padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #bna-widget {
      position: fixed; inset: 0; pointer-events: none;
      z-index: 2147483640;
    }

    #bna-bubble {
      position: fixed; right: 28px; bottom: 100px; z-index: 2147483647;
      display: flex !important; align-items: center; justify-content: center;
      width: 58px; height: 58px; border: none; border-radius: 50%;
      background: #111; box-shadow: 0 4px 16px rgba(0,0,0,.25);
      cursor: pointer !important; pointer-events: auto !important;
      transition: transform .2s, background .2s;
    }
    #bna-bubble:hover { transform: scale(1.08); background: #222; }
    #bna-bubble svg { width: 26px; height: 26px; fill: #fff; }
    #bna-bubble .icon-close { display: none; }
    #bna-bubble.open .icon-chat { display: none; }
    #bna-bubble.open .icon-close { display: block; }

    #bna-bubble-label {
      position: fixed; right: 20px; bottom: 170px; z-index: 2147483645;
      max-width: 180px; padding: 8px 12px; border-radius: 14px;
      background: #111; color: #fff; font-size: 12px; line-height: 1.2;
      text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,.18);
    }
    #bna-bubble-label.hidden { display: none; }
    #bna-bubble-label::after {
      content: ""; position: absolute; right: 26px; bottom: -6px;
      width: 12px; height: 12px; background: #111; transform: rotate(45deg);
    }

    #bna-notif {
      position: fixed; right: 22px; bottom: 92px; z-index: 2147483647;
      display: none; width: 12px; height: 12px; border: 2px solid #fff;
      border-radius: 50%; background: #e53e3e;
    }
    #bna-notif.show { display: block; }

    #bna-window {
      position: fixed; right: 24px; bottom: 172px; z-index: 2147483646;
      display: flex; flex-direction: column;
      width: 420px; max-width: calc(100vw - 32px);
      height: 580px; max-height: calc(100vh - 182px);
      overflow: hidden; border-radius: 18px; background: #fff;
      box-shadow: 0 8px 40px rgba(0,0,0,.18);
      opacity: 0; pointer-events: none;
      transform: scale(.92) translateY(12px);
      transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .18s ease;
    }
    #bna-window.open { opacity: 1; pointer-events: auto; transform: scale(1) translateY(0); }

    #bna-header {
      display: flex; flex-shrink: 0; align-items: center; gap: 10px;
      padding: 14px 16px; background: #111; color: #fff;
    }
    #bna-header-avatar {
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      width: 36px; height: 36px; border-radius: 50%; background: #333;
      font-size: 11px; font-weight: 700; letter-spacing: .08em;
    }
    #bna-header-info { flex: 1; }
    #bna-header-name { font-size: 14px; font-weight: 600; color: #fff; }
    #bna-header-status { display: flex; align-items: center; gap: 4px; margin-top: 1px; color: #aaa; font-size: 11px; }
    #bna-status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #48bb78; }
    #bna-close-btn {
      display: flex; align-items: center; padding: 4px;
      border: none; border-radius: 6px; background: none; color: #aaa; cursor: pointer; transition: color .15s;
    }
    #bna-close-btn:hover { color: #fff; }

    #bna-messages {
      display: flex; flex: 1; flex-direction: column; gap: 10px;
      overflow-y: auto; padding: 16px 18px; background: #f7f7f7; scroll-behavior: smooth;
    }
    #bna-messages::-webkit-scrollbar { width: 4px; }
    #bna-messages::-webkit-scrollbar-track { background: transparent; }
    #bna-messages::-webkit-scrollbar-thumb { border-radius: 4px; background: #ddd; }

    .bna-msg { display: flex; flex-direction: column; max-width: 75%; }
    .bna-msg.bot { align-self: flex-start; }
    .bna-msg.user { align-self: flex-end; max-width: 70%; padding-right: 12px; }
    .bna-msg.user .bna-bubble-msg { margin-right: 0; }
    .bna-bubble-msg { padding: 10px 13px; font-size: 13.5px; line-height: 1.5; word-break: break-word; overflow-wrap: break-word; }
    .bna-msg.bot .bna-bubble-msg {
      border: 1px solid #e8e8e8; border-radius: 14px 14px 14px 4px; background: #fff; color: #111;
    }
    .bna-msg.user .bna-bubble-msg { border-radius: 14px 14px 4px 14px; background: #111; color: #fff; }
    .bna-msg-label { margin-top: 3px; padding: 0 4px; color: #aaa; font-size: 10px; }
    .bna-msg.user .bna-msg-label { text-align: right; }

    #bna-typing {
      display: none; align-items: center; align-self: flex-start; gap: 4px;
      padding: 10px 14px; border: 1px solid #e8e8e8; border-radius: 14px 14px 14px 4px; background: #fff;
    }
    #bna-typing.show { display: flex; }
    #bna-typing span {
      width: 5px; height: 5px; border-radius: 50%; background: #999;
      animation: bna-bounce .9s infinite;
    }
    #bna-typing span:nth-child(2) { animation-delay: .15s; }
    #bna-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes bna-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    #bna-input-area {
      display: flex; flex-shrink: 0; align-items: center; gap: 8px;
      padding: 12px 14px; border-top: 1px solid #eee; background: #fff;
    }
    #bna-input {
      flex: 1; min-height: 38px; max-height: 100px; resize: none; overflow-y: auto; height: auto;
      padding: 9px 14px; border: 1px solid #e0e0e0; border-radius: 22px;
      outline: none; background: #f7f7f7; color: #111;
      font-family: inherit; font-size: 13.5px; line-height: 1.4; transition: border-color .15s;
    }
    #bna-input:focus { border-color: #999; background: #fff; }
    #bna-input::placeholder { color: #bbb; }

    #bna-send {
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      width: 38px; height: 38px; border: none; border-radius: 50%;
      background: #111; cursor: pointer; transition: background .15s, transform .1s;
    }
    #bna-send:hover { background: #333; }
    #bna-send:active { transform: scale(.94); }
    #bna-send:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    #bna-send svg { width: 16px; height: 16px; margin-left: 2px; fill: #fff; }

    #bna-footer { flex-shrink: 0; padding: 6px; background: #fff; color: #bbb; font-size: 10px; text-align: center; }

    #bna-close-confirm { display: none; flex-shrink: 0; padding: 14px; border-top: 1px solid #eee; background: #fff; }
    #bna-close-confirm.show { display: block; }
    #bna-close-confirm-text { margin-bottom: 10px; color: #555; font-size: 12px; text-align: center; }
    #bna-close-confirm-actions { display: flex; gap: 8px; }
    .bna-close-confirm-btn {
      flex: 1; padding: 9px 12px; border: 1px solid #ddd; border-radius: 20px;
      background: #fff; color: #111; cursor: pointer; font-size: 12px;
    }
    .bna-close-confirm-btn.primary { border-color: #111; background: #111; color: #fff; }

    @media (max-width: 640px) {
      #bna-bubble { right: 18px; bottom: 96px; }
      #bna-bubble-label { right: 12px; bottom: 166px; }
      #bna-notif { right: 12px; bottom: 138px; }
      #bna-window { right: 12px; bottom: 166px; width: calc(100vw - 24px); height: min(560px, calc(100vh - 182px)); }
    }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ──────────────────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.id = "bna-widget";
  wrapper.innerHTML = `
    <div id="bna-bubble-label">Questions? Chat with us.</div>
    <div id="bna-notif" class="show"></div>

    <button id="bna-bubble" aria-label="Open BNA chat" type="button">
      <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>
      <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <div id="bna-window" role="dialog" aria-label="BNA Detailing chat">
      <div id="bna-header">
        <div id="bna-header-avatar">BNA</div>
        <div id="bna-header-info">
          <div id="bna-header-name">BNA Detailing Co.</div>
          <div id="bna-header-status">
            <span id="bna-status-dot"></span> Online now
          </div>
        </div>
        <button id="bna-close-btn" aria-label="Close chat" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div id="bna-messages">
        <div id="bna-typing">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div id="bna-input-area">
        <textarea id="bna-input" placeholder="Ask about services, pricing, or booking..." rows="1" aria-label="Type your message"></textarea>
        <button id="bna-send" aria-label="Send message" type="button" disabled>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <div id="bna-footer">Powered by BNA Detailing Co.</div>

      <div id="bna-close-confirm">
        <div id="bna-close-confirm-text">Close this chat?</div>
        <div id="bna-close-confirm-actions">
          <button id="bna-cancel-close" class="bna-close-confirm-btn" type="button">Keep Chat Open</button>
          <button id="bna-confirm-close" class="bna-close-confirm-btn primary" type="button">Yes, Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // ── Logic ────────────────────────────────────────────────────────────────────
  const bubble       = document.getElementById("bna-bubble");
  const bubbleLabel  = document.getElementById("bna-bubble-label");
  const windowEl     = document.getElementById("bna-window");
  const messages     = document.getElementById("bna-messages");
  const input        = document.getElementById("bna-input");
  const sendBtn      = document.getElementById("bna-send");
  const typing       = document.getElementById("bna-typing");
  const notif        = document.getElementById("bna-notif");
  const closeBtn     = document.getElementById("bna-close-btn");
  const closeConfirm = document.getElementById("bna-close-confirm");
  const confirmClose = document.getElementById("bna-confirm-close");
  const cancelClose  = document.getElementById("bna-cancel-close");

  const conversationHistory = [];
  let isOpen = false, isWaiting = false, hasGreeted = false;
  let quoteStep = null;
  let quoteData  = emptyQuote();

  function emptyQuote() { return { vehicle: null, service: null, condition: null, addons: [] }; }
  function resetQuote()  { quoteStep = null; quoteData = emptyQuote(); }

  function isQuoteTrigger(t) { return /\b(price|quote|how much|estimate)\b/i.test(t); }
  function isCancelPhrase(t) { return /cancel|stop|never mind|nevermind|forget it|exit|quit/i.test(t); }

  function normService(t) {
    const l = t.toLowerCase();
    if (/exterior|wash|outside/.test(l)) return "exterior";
    if (/interior|inside/.test(l)) return "interior";
    return "full";
  }
  function normCondition(t) {
    const l = t.toLowerCase();
    if (/clean|pretty clean|light/.test(l)) return "light";
    if (/heavy|dirty|bad/.test(l)) return "heavy";
    return "medium";
  }
  function detectAddons(t) {
    const l = t.toLowerCase(), a = [];
    if (/pet/.test(l)) a.push("pet");
    if (/odor|odour|smell|smoke/.test(l)) a.push("ozone");
    return a;
  }

  async function requestQuote() {
    const res = await fetch(QUOTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteData }),
    });
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? await res.json()
      : { error: "Quote service unavailable." };
    if (!res.ok) throw new Error(data.error || "Quote error");
    return data;
  }

  function botSay(text) {
    appendMessage("bot", text);
    conversationHistory.push({ role: "assistant", content: text });
  }

  async function handleQuoteFlow(text) {
    if (quoteStep !== null && isCancelPhrase(text)) {
      resetQuote();
      botSay("No problem! Feel free to ask me anything about our services.");
      return true;
    }
    if (quoteStep === null) {
      if (!isQuoteTrigger(text)) return false;
      resetQuote();
      quoteStep = "vehicle";
      botSay("Let me give you a quick quote. What type of vehicle are we working with?");
      return true;
    }
    if (quoteStep === "vehicle") { quoteData.vehicle = text; quoteStep = "service"; botSay("Are you looking for interior, exterior, or full detail?"); return true; }
    if (quoteStep === "service") { quoteData.service = normService(text); quoteStep = "condition"; botSay("How is the condition: pretty clean, normal use, or heavy?"); return true; }
    if (quoteStep === "condition") { quoteData.condition = normCondition(text); quoteStep = "addons"; botSay("Any pet hair or odor issues?"); return true; }
    if (quoteStep === "addons") {
      quoteData.addons = detectAddons(text);
      try {
        const q = await requestQuote();
        const label = quoteData.service === "interior" ? "detail" : quoteData.service === "exterior" ? "wash/detail" : "full detail";
        botSay(`Based on what you told me:\n\n$${q.min.toFixed(2)} – $${q.max.toFixed(2)}\n\nThat includes a ${label} based on your vehicle and condition.`);
        botSay(`We're booking up quickly this week. Want me to lock this in for you?\n${q.bookingUrl}`);
      } finally { resetQuote(); }
      return true;
    }
    return false;
  }

  function hideBubbleLabel()  { bubbleLabel.classList.add("hidden"); }
  function showCloseConfirm() { closeConfirm.classList.add("show"); }
  function hideCloseConfirm() { closeConfirm.classList.remove("show"); }

  function closeChatWindow() {
    hideCloseConfirm(); isOpen = false;
    windowEl.classList.remove("open"); bubble.classList.remove("open");
  }

  function toggleChat() {
    if (isOpen && closeConfirm.classList.contains("show")) { closeChatWindow(); return; }
    isOpen = !isOpen;
    bubble.classList.toggle("open", isOpen);
    notif.classList.remove("show");
    hideCloseConfirm();
    if (isOpen) {
      hideBubbleLabel();
      windowEl.classList.add("open");
      if (!hasGreeted) { hasGreeted = true; triggerGreeting(); }
      setTimeout(() => input.focus(), 250);
    } else {
      windowEl.classList.remove("open");
    }
  }

  bubble.addEventListener("click", toggleChat);
  bubble.addEventListener("touchend", (e) => { e.preventDefault(); toggleChat(); });
  window.__bnaToggle = toggleChat;
  closeBtn.addEventListener("click", () => { if (!isOpen) return; showCloseConfirm(); });
  confirmClose.addEventListener("click", closeChatWindow);
  cancelClose.addEventListener("click", hideCloseConfirm);

  async function triggerGreeting() {
    showTyping();
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "__greeting__" }] }),
      });
      const data = await res.json();
      hideTyping();
      if (data.reply) appendMessage("bot", data.reply);
    } catch {
      hideTyping();
      appendMessage("bot", "Hey! What kind of vehicle are we working with today?");
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isWaiting) return;
    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });
    input.value = ""; input.style.height = "auto";
    sendBtn.disabled = true; isWaiting = true; showTyping();
    try {
      const handled = await handleQuoteFlow(text);
      if (handled) { hideTyping(); return; }
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory.slice(-48) }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Server error"); }
      const data = await res.json();
      hideTyping();
      if (data.reply) { appendMessage("bot", data.reply); conversationHistory.push({ role: "assistant", content: data.reply }); }
    } catch (err) {
      hideTyping();
      appendMessage("bot", "Something went wrong. Try again in a second.");
    } finally { isWaiting = false; updateSendBtn(); }
  }

  function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  function appendMessage(role, text) {
    const el = document.createElement("div");
    el.className = "bna-msg " + role;
    const escaped = escapeHtml(text);
    const linked = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">$1</a>');
    const formatted = linked.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    el.innerHTML = `<div class="bna-bubble-msg">${formatted}</div><div class="bna-msg-label">${role === "bot" ? "BNA Bot" : "You"}</div>`;
    messages.insertBefore(el, typing);
    scrollBottom();
  }

  function showTyping() { typing.classList.add("show"); messages.appendChild(typing); scrollBottom(); }
  function hideTyping() { typing.classList.remove("show"); }
  function scrollBottom() { setTimeout(() => { messages.scrollTop = messages.scrollHeight; }, 50); }
  function updateSendBtn() { sendBtn.disabled = !input.value.trim() || isWaiting; }

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
    updateSendBtn();
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  sendBtn.addEventListener("click", sendMessage);

})();

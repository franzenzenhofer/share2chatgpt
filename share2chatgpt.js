(function() {
  'use strict';

  var PREFIX = 's2c';
  var CHATGPT_BASE = 'https://chatgpt.com/';
  var VERSION = '1.0.0';

  var PROMPTS = {
    en: 'Read this page and summarize the key points: {url}',
    de: 'Lies diese Seite und fasse die wichtigsten Punkte zusammen: {url}',
    es: 'Lee esta pagina y resume los puntos clave: {url}',
    fr: 'Lis cette page et resume les points cles: {url}'
  };

  var LABELS = {
    en: 'Discuss with ChatGPT',
    de: 'Mit ChatGPT besprechen',
    es: 'Discutir con ChatGPT',
    fr: 'Discuter avec ChatGPT'
  };

  /* Static SVG icon - OpenAI logo. Safe: constant string, no user input. */
  var ICON_PATH = 'M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.69.258a6.043 6.043 0 00-5.775 4.257 5.984 5.984 0 00-4.005 2.903 6.05 6.05 0 00.75 7.09 5.985 5.985 0 00.516 4.911 6.05 6.05 0 006.51 2.9A6.065 6.065 0 0013.253 24a6.043 6.043 0 005.775-4.257 5.984 5.984 0 004.005-2.903 6.045 6.045 0 00-.75-7.019zM13.253 22.614a4.527 4.527 0 01-2.908-1.055l.144-.08 4.826-2.788a.785.785 0 00.397-.682v-6.81l2.04 1.178a.072.072 0 01.04.056v5.637a4.54 4.54 0 01-4.54 4.544zM3.604 18.466a4.52 4.52 0 01-.54-3.04l.144.085 4.826 2.787a.783.783 0 00.788 0l5.892-3.403v2.356a.072.072 0 01-.03.062l-4.878 2.817a4.54 4.54 0 01-6.202-1.664zM2.34 7.896a4.527 4.527 0 012.366-1.99v5.737a.782.782 0 00.393.676l5.892 3.403-2.04 1.178a.073.073 0 01-.068.006l-4.878-2.818A4.54 4.54 0 012.34 7.872zm17.077 3.972l-5.892-3.403 2.04-1.179a.073.073 0 01.068-.005l4.878 2.817a4.536 4.536 0 01-1.607 8.124v-5.678a.79.79 0 00-.397-.676zm2.03-3.065l-.144-.085-4.826-2.787a.783.783 0 00-.788 0L9.797 9.334V6.978a.072.072 0 01.03-.062l4.878-2.817a4.538 4.538 0 016.742 4.704zm-12.77 4.2l-2.04-1.178a.072.072 0 01-.04-.057V6.132a4.538 4.538 0 017.448-3.49l-.144.081-4.826 2.787a.785.785 0 00-.397.682zm1.108-2.393l2.626-1.516 2.626 1.516v3.032l-2.626 1.516-2.626-1.516z';

  var CSS = [
    '.s2c-btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:8px;cursor:pointer;font-family:system-ui,-apple-system,sans-serif;font-weight:500;text-decoration:none;line-height:1;transition:background .15s ease,transform .1s ease,box-shadow .15s ease;box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
    '.s2c-btn:active{transform:scale(.97)}',
    '.s2c-btn:focus-visible{outline:2px solid #10a37f;outline-offset:2px}',
    '.s2c-btn svg{flex-shrink:0;display:block}',
    '.s2c-label{white-space:nowrap}',
    '.s2c-sm{font-size:13px;padding:6px 12px}.s2c-sm svg{width:14px;height:14px}',
    '.s2c-md{font-size:14px;padding:8px 16px}.s2c-md svg{width:16px;height:16px}',
    '.s2c-lg{font-size:16px;padding:10px 20px}.s2c-lg svg{width:20px;height:20px}',
    '.s2c-light{background:#f9fafb;color:#1a1a1a;border:1px solid #e5e7eb}',
    '.s2c-light:hover{background:#f0fdf4;border-color:#10a37f;box-shadow:0 1px 3px rgba(16,163,127,.15)}',
    '.s2c-dark{background:#1a1a2e;color:#e5e7eb;border:1px solid #374151}',
    '.s2c-dark:hover{background:#10a37f;color:#fff;border-color:#10a37f}',
    '.s2c-minimal{background:transparent;color:#10a37f;border:none;padding:4px 8px}',
    '.s2c-minimal:hover{background:rgba(16,163,127,.08)}'
  ].join('\n');

  function createIcon() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', ICON_PATH);
    svg.appendChild(path);
    return svg;
  }

  function resolvePrompt(template, data) {
    return template
      .replace(/\{url\}/g, data.url || '')
      .replace(/\{title\}/g, data.title || '')
      .replace(/\{text\}/g, data.text || '');
  }

  function buildChatGPTUrl(config) {
    var lang = config.lang || 'en';
    var template = config.prompt || PROMPTS[lang] || PROMPTS.en;
    var promptText = resolvePrompt(template, {
      url: config.url || '',
      title: config.title || '',
      text: config.text || ''
    });

    var params = new URLSearchParams();
    params.set('q', promptText);
    if (config.hints) params.set('hints', config.hints);
    if (config.temporaryChat) params.set('temporary-chat', config.temporaryChat);

    return CHATGPT_BASE + '?' + params.toString();
  }

  function injectStyles() {
    if (document.getElementById(PREFIX + '-styles')) return;
    var style = document.createElement('style');
    style.id = PREFIX + '-styles';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function createButton(el) {
    var config = {
      url:    el.getAttribute('data-url') || window.location.href,
      title:  el.getAttribute('data-title') || document.title,
      text:   el.getAttribute('data-text') || '',
      prompt: el.getAttribute('data-prompt') || null,
      hints:  el.getAttribute('data-hints') || null,
      temporaryChat: el.getAttribute('data-temporary-chat') || null,
      theme:  el.getAttribute('data-theme') || 'light',
      size:   el.getAttribute('data-size') || 'md',
      label:  el.getAttribute('data-label') || null,
      lang:   el.getAttribute('data-lang') || 'en'
    };

    if (!config.label) {
      config.label = LABELS[config.lang] || LABELS.en;
    }

    var href = buildChatGPTUrl(config);

    var link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = PREFIX + '-btn ' + PREFIX + '-' + config.theme + ' ' + PREFIX + '-' + config.size;
    link.setAttribute('aria-label', config.label);

    link.appendChild(createIcon());

    var span = document.createElement('span');
    span.className = PREFIX + '-label';
    span.textContent = config.label;
    link.appendChild(span);

    el.appendChild(link);
  }

  function init() {
    injectStyles();
    var elements = document.querySelectorAll('[data-share2chatgpt]');
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].hasAttribute('data-s2c-init')) {
        createButton(elements[i]);
        elements[i].setAttribute('data-s2c-init', '');
      }
    }
  }

  window.Share2ChatGPT = {
    version: VERSION,
    init: init,
    buildUrl: buildChatGPTUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function() {
  'use strict';

  var PREFIX = 's2c';
  var CHATGPT_BASE = 'https://chatgpt.com/';
  var VERSION = '1.1.0';

  var PROMPTS = {
    en: 'Read this page and summarize the key points as bullet points: {url}',
    de: 'Lies diese Seite und fasse die wichtigsten Punkte als Aufzaehlung zusammen: {url}',
    es: 'Lee esta pagina y resume los puntos clave en viñetas: {url}',
    fr: 'Lis cette page et resume les points cles sous forme de liste: {url}'
  };

  var LABELS = {
    en: 'Discuss with ChatGPT',
    de: 'Mit ChatGPT besprechen',
    es: 'Discutir con ChatGPT',
    fr: 'Discuter avec ChatGPT'
  };

  var THEMES = {
    light: true,
    dark: true,
    minimal: true
  };

  var SIZES = {
    sm: true,
    md: true,
    lg: true
  };

  var LANGS = {
    en: true,
    de: true,
    es: true,
    fr: true
  };

  /* Static SVG icon - OpenAI logo. Safe: constant string, no user input. */
  var ICON_PATH = 'M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.69.258a6.043 6.043 0 00-5.775 4.257 5.984 5.984 0 00-4.005 2.903 6.05 6.05 0 00.75 7.09 5.985 5.985 0 00.516 4.911 6.05 6.05 0 006.51 2.9A6.065 6.065 0 0013.253 24a6.043 6.043 0 005.775-4.257 5.984 5.984 0 004.005-2.903 6.045 6.045 0 00-.75-7.019zM13.253 22.614a4.527 4.527 0 01-2.908-1.055l.144-.08 4.826-2.788a.785.785 0 00.397-.682v-6.81l2.04 1.178a.072.072 0 01.04.056v5.637a4.54 4.54 0 01-4.54 4.544zM3.604 18.466a4.52 4.52 0 01-.54-3.04l.144.085 4.826 2.787a.783.783 0 00.788 0l5.892-3.403v2.356a.072.072 0 01-.03.062l-4.878 2.817a4.54 4.54 0 01-6.202-1.664zM2.34 7.896a4.527 4.527 0 012.366-1.99v5.737a.782.782 0 00.393.676l5.892 3.403-2.04 1.178a.073.073 0 01-.068.006l-4.878-2.818A4.54 4.54 0 012.34 7.872zm17.077 3.972l-5.892-3.403 2.04-1.179a.073.073 0 01.068-.005l4.878 2.817a4.536 4.536 0 01-1.607 8.124v-5.678a.79.79 0 00-.397-.676zm2.03-3.065l-.144-.085-4.826-2.787a.783.783 0 00-.788 0L9.797 9.334V6.978a.072.072 0 01.03-.062l4.878-2.817a4.538 4.538 0 016.742 4.704zm-12.77 4.2l-2.04-1.178a.072.072 0 01-.04-.057V6.132a4.538 4.538 0 017.448-3.49l-.144.081-4.826 2.787a.785.785 0 00-.397.682zm1.108-2.393l2.626-1.516 2.626 1.516v3.032l-2.626 1.516-2.626-1.516z';

  var CSS = [
    '.s2c-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;max-width:100%;min-height:42px;padding:10px 18px;border:1px solid transparent;border-radius:999px;cursor:pointer;font-family:system-ui,-apple-system,sans-serif;font-weight:600;letter-spacing:-.01em;text-decoration:none;line-height:1.2;transition:transform .16s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease,color .22s ease;box-sizing:border-box;-webkit-tap-highlight-color:transparent;overflow:hidden;isolation:isolate}',
    '.s2c-btn::before{content:"";position:absolute;inset:1px;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0));opacity:0;pointer-events:none;transition:opacity .22s ease}',
    '.s2c-btn:hover{transform:translateY(-1px)}',
    '.s2c-btn:hover::before{opacity:1}',
    '.s2c-btn:active{transform:translateY(0) scale(.98)}',
    '.s2c-btn:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(16,163,127,.22),0 0 0 1px #10a37f}',
    '.s2c-btn svg{flex-shrink:0;display:block}',
    '.s2c-label{overflow-wrap:anywhere}',
    '.s2c-sm{font-size:13px;padding:8px 14px;min-height:36px}.s2c-sm svg{width:14px;height:14px}',
    '.s2c-md{font-size:14px;padding:10px 18px;min-height:42px}.s2c-md svg{width:16px;height:16px}',
    '.s2c-lg{font-size:16px;padding:12px 22px;min-height:48px}.s2c-lg svg{width:18px;height:18px}',
    '.s2c-light{background:linear-gradient(180deg,#fff,#f3f8f6);color:#111827;border-color:rgba(16,163,127,.16);box-shadow:0 10px 30px rgba(15,23,42,.08),0 2px 6px rgba(15,23,42,.06)}',
    '.s2c-light:hover{background:linear-gradient(180deg,#fff,#ebfbf5);border-color:rgba(16,163,127,.5);box-shadow:0 14px 32px rgba(16,163,127,.16),0 6px 14px rgba(15,23,42,.08)}',
    '.s2c-dark{background:linear-gradient(180deg,#16312b,#10201d);color:#f8fafc;border-color:rgba(114,255,213,.18);box-shadow:0 16px 34px rgba(3,12,10,.35),inset 0 1px 0 rgba(255,255,255,.04)}',
    '.s2c-dark:hover{background:linear-gradient(180deg,#10a37f,#0d8b6d);color:#fff;border-color:rgba(185,255,236,.5);box-shadow:0 18px 36px rgba(16,163,127,.28)}',
    '.s2c-minimal{background:rgba(16,163,127,.08);color:#0f8a6b;border-color:rgba(16,163,127,.12);box-shadow:none;padding:8px 12px;min-height:34px}',
    '.s2c-minimal:hover{background:rgba(16,163,127,.14);border-color:rgba(16,163,127,.26);box-shadow:0 8px 18px rgba(16,163,127,.12)}'
  ].join('\n');

  function toText(value) {
    return value == null ? '' : String(value).trim();
  }

  function normalizeChoice(value, allowed, fallback) {
    var normalized = toText(value).toLowerCase();
    return allowed[normalized] ? normalized : fallback;
  }

  function getDefaultLocationHref() {
    if (typeof window === 'undefined' || !window.location || !window.location.href) return '';
    return /^https?:/i.test(window.location.href) ? window.location.href : '';
  }

  function getDefaultTitle() {
    return typeof document !== 'undefined' && document.title ? document.title : '';
  }

  function normalizeUrl(value, fallbackUrl) {
    var fallback = toText(fallbackUrl);
    var candidate = toText(value);
    var base = getDefaultLocationHref() || undefined;

    if (!candidate) return fallback;

    try {
      var parsed = new URL(candidate, base);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return fallback;
      return parsed.toString();
    } catch (error) {
      return fallback;
    }
  }

  function normalizeHints(value) {
    return toText(value).toLowerCase() === 'search' ? 'search' : '';
  }

  function normalizeTemporaryChat(value) {
    return toText(value).toLowerCase() === 'true' ? 'true' : '';
  }

  function normalizeConfig(config) {
    var source = config || {};
    var lang = normalizeChoice(source.lang, LANGS, 'en');
    var fallbackUrl = source.fallbackUrl == null ? getDefaultLocationHref() : toText(source.fallbackUrl);

    return {
      url: normalizeUrl(source.url, fallbackUrl),
      title: toText(source.title) || getDefaultTitle(),
      text: toText(source.text),
      prompt: toText(source.prompt),
      hints: normalizeHints(source.hints),
      temporaryChat: normalizeTemporaryChat(source.temporaryChat),
      theme: normalizeChoice(source.theme, THEMES, 'light'),
      size: normalizeChoice(source.size, SIZES, 'md'),
      label: toText(source.label),
      lang: lang
    };
  }

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
    var safeConfig = normalizeConfig(config);
    var template = safeConfig.prompt || PROMPTS[safeConfig.lang] || PROMPTS.en;
    var promptText = resolvePrompt(template, {
      url: safeConfig.url,
      title: safeConfig.title,
      text: safeConfig.text
    });

    var params = new URLSearchParams();
    params.set('q', promptText);
    if (safeConfig.hints) params.set('hints', safeConfig.hints);
    if (safeConfig.temporaryChat) params.set('temporary-chat', safeConfig.temporaryChat);

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
    var config = normalizeConfig({
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
    });

    if (!config.label) {
      config.label = LABELS[config.lang] || LABELS.en;
    }

    var href = buildChatGPTUrl(config);

    var link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer external';
    link.referrerPolicy = 'strict-origin-when-cross-origin';
    link.className = PREFIX + '-btn ' + PREFIX + '-' + config.theme + ' ' + PREFIX + '-' + config.size;
    link.setAttribute('aria-label', config.label);

    el.textContent = '';
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
    buildUrl: buildChatGPTUrl,
    normalizeUrl: normalizeUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

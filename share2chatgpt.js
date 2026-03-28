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

  var VARIANTS = {
    button: true,
    icon: true,
    link: true
  };

  var LANGS = {
    en: true,
    de: true,
    es: true,
    fr: true
  };

  /* Official ChatGPT logo SVG path (CC0 public domain, Wikimedia Commons) */
  var ICON_PATH = 'm297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z';
  var ICON_VIEWBOX = '0 0 320 320';

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
    '.s2c-minimal:hover{background:rgba(16,163,127,.14);border-color:rgba(16,163,127,.26);box-shadow:0 8px 18px rgba(16,163,127,.12)}',
    '.s2c-icon-only{padding:0;min-height:0;width:32px;height:32px;border-radius:50%;gap:0}',
    '.s2c-icon-only.s2c-sm{width:26px;height:26px}',
    '.s2c-icon-only.s2c-lg{width:40px;height:40px}',
    '.s2c-icon-only .s2c-label{display:none}',
    '.s2c-link-only{background:none!important;border:none!important;box-shadow:none!important;padding:0;min-height:0;border-radius:0;font-weight:500;gap:6px}',
    '.s2c-link-only::before{display:none}',
    '.s2c-link-only:hover{background:none!important;border:none!important;box-shadow:none!important;text-decoration:underline;transform:none}',
    '.s2c-link-only:active{transform:none;opacity:.7}',
    '.s2c-link-only.s2c-light{color:#111827}',
    '.s2c-link-only.s2c-light:hover{color:#10a37f}',
    '.s2c-link-only.s2c-dark{color:#a8e6cf}',
    '.s2c-link-only.s2c-dark:hover{color:#10a37f}',
    '.s2c-link-only.s2c-minimal{color:#10a37f}',
    '.s2c-link-only.s2c-minimal:hover{color:#0d8b6d}',
    '.s2c-link-only svg{width:14px;height:14px}',
    '.s2c-link-only.s2c-sm svg{width:12px;height:12px}.s2c-link-only.s2c-sm{font-size:12px}',
    '.s2c-link-only.s2c-lg svg{width:16px;height:16px}.s2c-link-only.s2c-lg{font-size:16px}'
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
      variant: normalizeChoice(source.variant, VARIANTS, 'button'),
      icon: source.icon !== 'false' && source.icon !== false,
      label: toText(source.label),
      lang: lang
    };
  }

  function createIcon() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', ICON_VIEWBOX);
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
      variant: el.getAttribute('data-variant') || 'button',
      icon:   el.getAttribute('data-icon'),
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

    var classes = PREFIX + '-btn ' + PREFIX + '-' + config.theme + ' ' + PREFIX + '-' + config.size;
    if (config.variant === 'icon') classes += ' ' + PREFIX + '-icon-only';
    if (config.variant === 'link') classes += ' ' + PREFIX + '-link-only';
    link.className = classes;
    link.setAttribute('aria-label', config.label);

    el.textContent = '';
    if (config.icon) link.appendChild(createIcon());

    if (config.variant !== 'icon') {
      var span = document.createElement('span');
      span.className = PREFIX + '-label';
      span.textContent = config.label;
      link.appendChild(span);
    }

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

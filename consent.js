/* Consentement cookies + mesure d'audience (Vercel Web Analytics).
   Rien n'est chargé tant que le visiteur n'a pas cliqué sur « Accepter ».
   Le choix est conservé 6 mois (recommandation CNIL), puis redemandé. */
(function(){
  var KEY = 'pd_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182;

  function read(){
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && (v.choice === 'yes' || v.choice === 'no') && Date.now() - v.at < MAX_AGE) return v.choice;
    } catch (e) {}
    return null;
  }
  function save(choice){
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, at: Date.now() })); } catch (e) {}
  }

  function loadAnalytics(){
    if (window.__vaLoaded) return;
    window.__vaLoaded = true;
    window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
    var s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  window.track = function(name, data){
    if (window.__vaLoaded && typeof window.va === 'function') window.va('event', { name: name, data: data });
  };

  var css = '#cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin:0 auto;background:#0d2a20;border:1px solid #c8a96a;padding:24px 26px;box-shadow:0 20px 60px rgba(0,0,0,.45);font:300 .9rem/1.65 Manrope,-apple-system,sans-serif;color:#f3ecdf}'
    + '#cc p{color:rgba(243,236,223,.78);margin:0 0 18px}#cc a{color:#e2cc9b;text-decoration:underline}'
    + '#cc strong{font:400 1.15rem "Bodoni Moda",Didot,serif;color:#f3ecdf;display:block;margin-bottom:6px}'
    + '#cc .cc-b{display:flex;gap:10px;flex-wrap:wrap}'
    + '#cc button{flex:1 1 140px;padding:14px 18px;font:600 .64rem Manrope,-apple-system,sans-serif;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;border:1px solid #c8a96a;background:transparent;color:#e2cc9b}'
    + '#cc button:focus-visible{outline:1px solid #e2cc9b;outline-offset:3px}'
    + '#cc .cc-yes{background:linear-gradient(135deg,#d9bf86,#b8955a);color:#0d2a20;border-color:transparent}';

  function showBanner(){
    if (document.getElementById('cc')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('div');
    box.id = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Gestion des cookies');
    box.innerHTML = '<p><strong>Cookies & mesure d\'audience</strong>'
      + 'J\'utilise un outil de statistiques anonymes pour savoir quelles pages sont consultées et améliorer le site. '
      + 'Rien n\'est activé sans ton accord. <a href="/confidentialite">En savoir plus</a></p>'
      + '<div class="cc-b"><button type="button" class="cc-no">Refuser</button><button type="button" class="cc-yes">Accepter</button></div>';
    document.body.appendChild(box);
    box.querySelector('.cc-yes').onclick = function(){ save('yes'); box.remove(); loadAnalytics(); };
    box.querySelector('.cc-no').onclick = function(){ save('no'); box.remove(); if (window.__vaLoaded) location.reload(); };
  }

  window.openCookieSettings = function(){
    try { localStorage.removeItem(KEY); } catch (e) {}
    showBanner();
  };

  function init(){
    var c = read();
    if (c === 'yes') loadAnalytics();
    else if (c === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

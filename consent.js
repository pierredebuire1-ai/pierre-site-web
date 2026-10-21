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

  var css = '#cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin:0 auto;background:#0d0f1c;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.5);font:400 .9rem/1.55 Inter,-apple-system,sans-serif;color:#f2f3fa}'
    + '#cc p{color:rgba(242,243,250,.78);margin:0 0 14px}#cc a{color:#00d4ff;text-decoration:underline}'
    + '#cc .cc-b{display:flex;gap:10px;flex-wrap:wrap}'
    + '#cc button{flex:1 1 140px;padding:12px 18px;border-radius:100px;font:700 .88rem Inter,-apple-system,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:transparent;color:#f2f3fa}'
    + '#cc button:focus-visible{outline:2px solid #00d4ff;outline-offset:2px}'
    + '#cc .cc-yes{background:#f2f3fa;color:#05060f;border-color:#f2f3fa}';

  function showBanner(){
    if (document.getElementById('cc')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('div');
    box.id = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Gestion des cookies');
    box.innerHTML = '<p><strong style="color:#fff">Cookies & mesure d\'audience</strong><br>'
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

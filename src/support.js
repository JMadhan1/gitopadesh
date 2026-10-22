// Support page: follows the language chosen on the main site; copy button for the UPI ID.
(function () {
  var langs = ['en', 'hi', 'te'];
  function stored() {
    try { var v = JSON.parse(localStorage.getItem('lang')); return langs.indexOf(v) >= 0 ? v : 'en'; } catch (e) { return 'en'; }
  }
  function show(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-l]').forEach(function (el) { el.hidden = el.getAttribute('data-l') !== l; });
    document.querySelectorAll('[data-pick]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-pick') === l); });
    try { localStorage.setItem('lang', JSON.stringify(l)); } catch (e) {}
  }
  document.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-pick')); });
  });
  show(stored());
  var btn = document.getElementById('copyUpi');
  if (btn) btn.addEventListener('click', function () {
    var id = document.getElementById('upiId').textContent.trim();
    var l = document.documentElement.lang;
    var done = function () {
      var lab = btn.querySelector('[data-l="' + l + '"]');
      if (!lab) return;
      var old = lab.textContent; lab.textContent = btn.getAttribute('data-done-' + l) || old;
      setTimeout(function () { lab.textContent = old; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(id).then(done, function () {});
    else { var r = document.createRange(); r.selectNodeContents(document.getElementById('upiId')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  });
})();

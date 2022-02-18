var loadIO = function () {};
document.addEventListener('DOMContentLoaded', function () {
  loadIO();
  window.addEventListener('scroll', function () {
    if (window.scrollY > document.getElementById('top_intro').clientHeight) {
      document.getElementById('btnGoToTop').removeAttribute('hidden');
    } else {
      document.getElementById('btnGoToTop').setAttribute('hidden', 'true');
    }
  });
});

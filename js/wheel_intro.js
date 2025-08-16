
// Minimal, one-shot intro animation for the wheel rotor.
// Does not modify existing behavior or rotation logic.
(function(){
  function runIntro(){
    var rotor = document.getElementById('wheel-rotor');
    if(!rotor) return;
    // Add the class a bit later so styles are applied after initial layout
    requestAnimationFrame(function(){
      rotor.classList.add('intro-animate');
      rotor.addEventListener('animationend', function(){
        rotor.classList.remove('intro-animate');
      }, { once: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();

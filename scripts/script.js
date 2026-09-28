// Theme Engine & Interaction Script
//------------------------------------------------------------------------------

// Touch detection
var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
document.documentElement.classList.add(isTouch ? 'touchevents' : 'no-touchevents');

document.addEventListener('DOMContentLoaded', function() {

  // Reset the window scroll position to top on page load
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Fix touch device touch events (passive for scroll performance)
  document.querySelectorAll('body *').forEach(function(el) {
    el.addEventListener('touchstart', function() {}, { passive: true });
  });

  // Initialize and sync theme slider with current active theme
  var currentThemeMatch = document.body.className.match(/theme--(\d+)/);
  var slider = document.querySelector('.app-aside .slider');
  if (currentThemeMatch && slider) {
    slider.value = parseInt(currentThemeMatch[1], 10);
  }

  // Theme slider — hover to expand (non-touch devices only)
  if (!isTouch) {
    var themeOption = document.querySelector('.option.theme');
    if (themeOption) {
      themeOption.addEventListener('mouseenter', function() {
        document.body.classList.add('theme-slider--is--visible');
      });
      themeOption.addEventListener('mouseleave', function() {
        document.body.classList.remove('theme-slider--is--visible');
      });
    }
  }

  // Theme slider — tap to expand (touch devices only)
  if (isTouch) {
    var themeOptionTouch = document.querySelector('.option.theme');
    if (themeOptionTouch) {
      themeOptionTouch.addEventListener('click', function() {
        document.body.classList.add('theme-slider--is--visible');
      });
    }
    // Dismiss theme slider when tapping anywhere else on the page
    document.documentElement.addEventListener('click', function(event) {
      if (!event.target.closest('.option.theme')) {
        document.body.classList.remove('theme-slider--is--visible');
      }
    });
  }

  // Theme slider — value change
  var themeSlider = document.querySelector('.app-aside .slider');
  if (themeSlider) {
    themeSlider.addEventListener('input', function() {
      var val = parseInt(this.value, 10);
      var padded = val < 10 ? '0' + val : '' + val;
      appThemeSet('theme--' + padded, val);
    });
  }

}); // End DOMContentLoaded

// Keyboard Shortcuts
// reference https://www.w3.org/2002/09/tests/keys.html
document.addEventListener('keydown', function(key) {
  // Avoid interfering when typing in inputs/textareas
  if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  switch(parseInt(key.which, 10)) {
    // 'w' key — toggle white/black theme
    case 87:
      appTheme();
      break;

    // 'b' key — toggle black/white theme
    case 66:
      appTheme();
      break;

    // 's' key — cycle through all themes
    case 83:
      appThemeSpectrum();
      break;
  }
});

// Remove all theme-- classes from body
function appThemeRemoveAll() {
  var toRemove = [];
  document.body.classList.forEach(function(cls) {
    if (/^theme--/.test(cls)) {
      toRemove.push(cls);
    }
  });
  toRemove.forEach(function(cls) {
    document.body.classList.remove(cls);
  });
}

// Set active theme, sync slider, and persist preference
function appThemeSet(themeClass, sliderVal) {
  appThemeRemoveAll();
  document.body.classList.add(themeClass);
  try {
    localStorage.setItem('suman-theme', themeClass);
  } catch(e) {}
  var slider = document.querySelector('.app-aside .slider');
  if (slider && typeof sliderVal !== 'undefined') {
    slider.value = sliderVal;
  }
}

// Toggle between black (theme--00) and white (theme--16)
function appTheme() {
  if (document.body.classList.contains('theme--00')) {
    appThemeSet('theme--16', 16);
  } else {
    appThemeSet('theme--00', 0);
  }
}

// Cycle through all themes sequentially (16 → 15 → ... → 00 → 16)
function appThemeSpectrum() {
  var themes = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'];

  var currentIndex = -1;
  for (var i = 0; i < themes.length; i++) {
    if (document.body.classList.contains('theme--' + themes[i])) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === -1) currentIndex = 16;

  var nextIndex = currentIndex === 0 ? 16 : currentIndex - 1;
  appThemeSet('theme--' + themes[nextIndex], nextIndex);
}

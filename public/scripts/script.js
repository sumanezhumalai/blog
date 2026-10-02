// Theme Engine & Interaction Script
//------------------------------------------------------------------------------

var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

document.addEventListener('DOMContentLoaded', function() {
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Initialize and sync theme slider with current active theme
  var currentThemeMatch = document.body.className.match(/theme--(\d+)/);
  var slider = document.querySelector('.app-aside .slider');
  var initialVal = currentThemeMatch ? parseInt(currentThemeMatch[1], 10) : 16;
  if (slider) {
    slider.value = initialVal;
  }
  document.documentElement.style.setProperty('--theme-val', initialVal);

  var themeOption = document.querySelector('.option.theme');
  if (themeOption) {
    if (!isTouch) {
      themeOption.addEventListener('mouseenter', function() {
        document.body.classList.add('theme-slider--is--visible');
      });
      themeOption.addEventListener('mouseleave', function() {
        document.body.classList.remove('theme-slider--is--visible');
      });
    } else {
      themeOption.addEventListener('click', function() {
        document.body.classList.add('theme-slider--is--visible');
      });
      document.documentElement.addEventListener('click', function(event) {
        if (!event.target.closest('.option.theme')) {
          document.body.classList.remove('theme-slider--is--visible');
        }
      });
    }
  }

  if (slider) {
    slider.addEventListener('input', function() {
      var val = parseInt(this.value, 10);
      var padded = val < 10 ? '0' + val : '' + val;
      appThemeSet('theme--' + padded, val);
    });
  }
});

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  var key = e.key ? e.key.toLowerCase() : '';
  if (key === 'w' || key === 'b') {
    appTheme();
  } else if (key === 's') {
    appThemeSpectrum();
  }
});

// Remove all theme-- classes from body
function appThemeRemoveAll() {
  var toRemove = [];
  document.body.classList.forEach(function(cls) {
    if (/^theme--/.test(cls)) toRemove.push(cls);
  });
  toRemove.forEach(function(cls) {
    document.body.classList.remove(cls);
  });
}

// Set active theme, sync slider, and persist preference
function appThemeSet(themeClass, sliderVal) {
  appThemeRemoveAll();
  document.body.classList.add(themeClass);
  document.documentElement.style.setProperty('--theme-val', sliderVal);
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
  var match = document.body.className.match(/theme--(\d+)/);
  var current = match ? parseInt(match[1], 10) : 16;
  var next = current === 0 ? 16 : current - 1;
  var padded = next < 10 ? '0' + next : '' + next;
  appThemeSet('theme--' + padded, next);
}

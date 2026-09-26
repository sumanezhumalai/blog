// Script
//------------------------------------------------------------------------------


// Touch detection — replaces Modernizr
// Runs synchronously (before DOMContentLoaded) so that CSS rules that select
// html.touchevents / html.no-touchevents apply on first paint with no flash.
// No caveats: ('ontouchstart' in window) + maxTouchPoints covers all modern browsers.
var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
document.documentElement.classList.add(isTouch ? 'touchevents' : 'no-touchevents');


document.addEventListener('DOMContentLoaded', function() {

  // Reset the window scroll position to top on every page load and re-load
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Fix touch device touch events (passive for scroll performance)
  document.querySelectorAll('body *').forEach(function(el) {
    el.addEventListener('touchstart', function() {}, { passive: true });
  });

  // Set the copyright to the current year in local time
  var currentYear = new Date().getFullYear();
  var yearEl = document.querySelector('.copyright .year');
  if (yearEl) yearEl.textContent = currentYear;

  // Detect if user prefers dark mode and apply it
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (document.body.classList.contains('theme--16')) {
      appThemeRemoveAll();
      document.body.classList.add('theme--00');
      var slider = document.querySelector('.app-aside .slider');
      if (slider) slider.value = 0;
    }
  }

  // Auto hide app cover on load
  function hideAppCoverDelay() {
    window.setTimeout(hideAppCover, 1750);
  }
  function hideAppCover() {
    document.body.classList.remove('cover--is--visible');
  }
  hideAppCoverDelay();

  // Auto remove body loading class to prevent UI bugs
  function removeLoadingClassDelay() {
    window.setTimeout(removeLoadingClass, 3250);
  }
  function removeLoadingClass() {
    document.body.classList.remove('is--loading');
  }
  removeLoadingClassDelay();

  // Mobile nav trigger
  var navToggle = document.querySelector('.app-header .navigation');
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      if (document.body.classList.contains('mobile-nav--is--visible')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close mobile nav when any nav item is clicked
  document.querySelectorAll('.app-nav .item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (document.body.classList.contains('mobile-nav--is--visible')) {
        closeMobileNav();
      }
    });
  });

  // Scroll to Contact from app nav
  var navContactItem = document.querySelector('.app-nav .item.contact');
  if (navContactItem) {
    navContactItem.addEventListener('click', function() {
      if (document.body.classList.contains('mobile-nav--is--visible')) {
        // Wait for nav close animation before scrolling
        window.setTimeout(scrollToContact, 300);
      } else {
        scrollToContact();
      }
    });
  }

  // Auto hide mobile nav on window resize to prevent visibility bugs
  window.addEventListener('resize', function() {
    if (document.body.classList.contains('mobile-nav--is--visible')) {
      closeMobileNav();
    }
  });

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
      // Pad single-digit values with leading zero to match class names (e.g. 'theme--05')
      var padded = val < 10 ? '0' + val : '' + val;
      appThemeRemoveAll();
      document.body.classList.add('theme--' + padded);
    });
  }

  // Grid overlay toggle button
  var gridOption = document.querySelector('.option.grid');
  if (gridOption) {
    gridOption.addEventListener('click', function() {
      appGridOverlay();
    });
  }

  // Scroll to Contact from inline text links within sections
  document.querySelectorAll('.section a.contact').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToContact();
    });
  });

}); // End DOMContentLoaded



// Keyboard Shortcuts
// reference https://www.w3.org/2002/09/tests/keys.html
document.addEventListener('keydown', function(key) {

  switch(parseInt(key.which, 10)) {

    // 'g' key — toggle grid overlay
    case 71:
      appGridOverlay();
      break;

    // ';' key — toggle grid overlay
    case 186:
      appGridOverlay();
      break;

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



// Scroll to Contact (footer)
// Uses native scrollIntoView — smooth, efficient, no easing library required.
function scrollToContact() {
  var sectionContact = document.querySelector('.app-main .section.contact');
  if (sectionContact) {
    sectionContact.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Open mobile nav
function openMobileNav() {
  document.body.classList.add('mobile-nav--is--transitioning');
  // 1ms delay allows the browser to paint the transitioning class before adding visible,
  // which triggers the CSS opacity transition correctly.
  window.setTimeout(function() {
    document.body.classList.add('mobile-nav--is--visible');
  }, 1);
}

// Close mobile nav
function closeMobileNav() {
  document.body.classList.remove('mobile-nav--is--visible');
  window.setTimeout(function() {
    document.body.classList.remove('mobile-nav--is--transitioning');
  }, 500);
}

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

// Toggle between black (theme--00) and white (theme--16)
function appTheme() {
  var slider = document.querySelector('.app-aside .slider');
  if (document.body.classList.contains('theme--00')) {
    appThemeRemoveAll();
    document.body.classList.add('theme--16');
    if (slider) slider.value = 16;
  } else {
    appThemeRemoveAll();
    document.body.classList.add('theme--00');
    if (slider) slider.value = 0;
  }
}

// Cycle through all themes sequentially (16 → 15 → ... → 00 → 16)
function appThemeSpectrum() {
  var slider = document.querySelector('.app-aside .slider');
  var themes = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'];

  // Find the currently active theme index
  var currentIndex = -1;
  for (var i = 0; i < themes.length; i++) {
    if (document.body.classList.contains('theme--' + themes[i])) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === -1) currentIndex = 16; // fallback to white if none found

  // Cycle downward: 16→15→...→00→16
  var nextIndex = currentIndex === 0 ? 16 : currentIndex - 1;
  appThemeRemoveAll();
  document.body.classList.add('theme--' + themes[nextIndex]);
  if (slider) slider.value = nextIndex;
}

// Toggle grid overlay
function appGridOverlay() {
  var overlay = document.querySelector('.app-grid-overlay');
  if (overlay) overlay.classList.toggle('is--visible');
}



// Nav scroll-spy
// Uses IntersectionObserver instead of polling on scroll/resize/load events.
// Marks the contact nav item active when the contact section enters the viewport.
// Wire additional section observers here as blog content is added in Astro.
(function() {

  var appNavItems    = document.querySelectorAll('.app-nav .item');
  var sectionContact = document.querySelector('.app-main .section.contact');

  if (!sectionContact || !appNavItems.length) return;

  var navItemContact = document.querySelector('.app-nav .item.contact');
  var navItemFirst   = document.querySelector('.app-nav .item:first-child');

  function setActive(activeItem) {
    appNavItems.forEach(function(item) { item.classList.remove('is--active'); });
    if (activeItem) activeItem.classList.add('is--active');
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setActive(navItemContact);
      } else {
        setActive(navItemFirst); // Default: first item active when at top
      }
    });
  }, {
    // Fire when the midpoint of the contact section crosses the viewport edge
    threshold: 0,
    rootMargin: '0px 0px -50% 0px'
  });

  observer.observe(sectionContact);

})(); // End nav scroll-spy

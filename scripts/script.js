// Script
//------------------------------------------------------------------------------


$(document).ready(function() {

  // Reset the window scroll position to top on every page load and re-load
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Fix touch device touch events
  $('body *').on('touchstart', function (){});

  // Set the copyright to the current year in local time
  var currentYear = new Date().getFullYear();
  $('.copyright .year').html(currentYear);

  // Detect if user prefers dark mode and apply it
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if ( $('body').hasClass('theme--16') ){
         appThemeRemoveAll();
         $('body').addClass('theme--00');
         $('.app-aside .slider').val(0);
    }
  }

  // Auto hide app cover on load
  function hideAppCoverDelay() {
    window.setTimeout(hideAppCover, 1750);
  }
  function hideAppCover() {
    $('body').removeClass('cover--is--visible');
  }
  hideAppCoverDelay();

  // Auto remove body loading class to prevent UI bugs
  function removeLoadingClassDelay() {
    window.setTimeout(removeLoadingClass, 3250);
  }
  function removeLoadingClass() {
    $('body').removeClass('is--loading');
  }
  removeLoadingClassDelay();

  // Mobile nav trigger
  $('.app-header .navigation').click(function() {
    if ( $('body').hasClass('mobile-nav--is--visible') ){
      closeMobileNav();
    }
    else {
      openMobileNav();
    }
  });

  // Close mobile nav when any nav item is clicked
  $('.app-nav .item').click(function() {
    if ( $('body').hasClass('mobile-nav--is--visible') ){
      closeMobileNav();
    }
  });

  // Scroll to Contact from app nav
  $('.app-nav .item.contact').click(function() {
    if ( $('body').hasClass('mobile-nav--is--visible') ){
      function scrollDelay() {
        window.setTimeout(scrollToContact, 300);
      }
      scrollDelay();
    }
    else {
      scrollToContact();
    }
  });

  // Auto hide mobile nav on window resize to prevent visibility bugs
  $(window).on( 'resize', function() {
    if ( $('body').hasClass('mobile-nav--is--visible') ){
      closeMobileNav();
    }
  });

  // Make theme slider visible on hover (non-touch devices)
  $('html.no-touchevents .option.theme').mouseenter(function() {
    $('body').addClass('theme-slider--is--visible');
  });
  $('html.no-touchevents .option.theme').mouseleave(function() {
    $('body').removeClass('theme-slider--is--visible');
  });

  // Make theme slider visible on tap (touch devices)
  $('html.touchevents .option.theme').click(function() {
    $('body').addClass('theme-slider--is--visible');
  });
  // Dismiss theme slider when tapping elsewhere
  $('html.touchevents').click(function(event) {
    if (!$(event.target).closest('.option.theme').length) {
      $('body').removeClass('theme-slider--is--visible');
    }
  });

  // Theme slider
  $('.app-aside .slider').on('input', function() {
    var sliderValue = $(this).val();

    // pad with leading zero
    if ( sliderValue < 10 ){
      sliderValue = 0 + sliderValue;
    }

    appThemeRemoveAll();
    $('body').addClass('theme--' + sliderValue);
  });

  // Grid overlay toggle
  $('.option.grid').click(function() {
    appGridOverlay();
  });

  // Scroll to Contact from text links within sections
  $('.section a.contact').click(function() {
    scrollToContact();
  });

}); // End document ready



// Keyboard Shortcuts
// reference https://www.w3.org/2002/09/tests/keys.html
$(document).keydown(function(key) {

    switch(parseInt(key.which,10)) {

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
function scrollToContact() {

  var pageHeight = $(document).height();
  var viewportHeight = $(window).height();

  var sectionContact = $('.app-main .section.contact');
  var sectionContactHeight = sectionContact.height();
  var sectionContactTop = sectionContact.offset().top;

  if ( sectionContactHeight > viewportHeight ) {
    $('html, body').animate({ scrollTop: sectionContactTop }, 750, 'easeOutCubic');
  }
  else {
    $('html, body').animate({ scrollTop: pageHeight - viewportHeight }, 750, 'easeOutCubic');
  }

}

// Open mobile nav
function openMobileNav() {
  $('body').addClass('mobile-nav--is--transitioning');
  function addVisibleClassDelay() {
    window.setTimeout(addVisibleClass, 1);
  }
  function addVisibleClass() {
    $('body').addClass('mobile-nav--is--visible');
  }
  addVisibleClassDelay();
}

// Close mobile nav
function closeMobileNav() {
  $('body').removeClass('mobile-nav--is--visible');
  function removeTransitioningClassDelay() {
    window.setTimeout(removeTransitioningClass, 500);
  }
  function removeTransitioningClass() {
    $('body').removeClass('mobile-nav--is--transitioning');
  }
  removeTransitioningClassDelay();
}

// Remove all theme-- classes from body
function appThemeRemoveAll() {
  $('body').removeClass(function (index, themeClassName) {
    return (themeClassName.match (/(^|\s)theme--\S+/g) || []).join(' ');
  });
}

// Toggle between black and white themes
function appTheme() {
  if ( $('body').hasClass('theme--00') ){
    appThemeRemoveAll();
    $('body').addClass('theme--16');
    $('.app-aside .slider').val(16);
  }
  else {
       appThemeRemoveAll();
       $('body').addClass('theme--00');
       $('.app-aside .slider').val(0);
  }
}

// Cycle through all themes
function appThemeSpectrum() {
  if ( $('body').hasClass('theme--16') ){
       appThemeRemoveAll();
       $('body').addClass('theme--15');
       $('.app-aside .slider').val(15);
  }
  else if ( $('body').hasClass('theme--15') ){
            appThemeRemoveAll();
            $('body').addClass('theme--14');
            $('.app-aside .slider').val(14);
  }
  else if ( $('body').hasClass('theme--14') ){
            appThemeRemoveAll();
            $('body').addClass('theme--13');
            $('.app-aside .slider').val(13);
  }
  else if ( $('body').hasClass('theme--13') ){
            appThemeRemoveAll();
            $('body').addClass('theme--12');
            $('.app-aside .slider').val(12);
  }
  else if ( $('body').hasClass('theme--12') ){
            appThemeRemoveAll();
            $('body').addClass('theme--11');
            $('.app-aside .slider').val(11);
  }
  else if ( $('body').hasClass('theme--11') ){
            appThemeRemoveAll();
            $('body').addClass('theme--10');
            $('.app-aside .slider').val(10);
  }
  else if ( $('body').hasClass('theme--10') ){
            appThemeRemoveAll();
            $('body').addClass('theme--09');
            $('.app-aside .slider').val(9);
  }
  else if ( $('body').hasClass('theme--09') ){
            appThemeRemoveAll();
            $('body').addClass('theme--08');
            $('.app-aside .slider').val(8);
  }
  else if ( $('body').hasClass('theme--08') ){
            appThemeRemoveAll();
            $('body').addClass('theme--07');
            $('.app-aside .slider').val(7);
  }
  else if ( $('body').hasClass('theme--07') ){
            appThemeRemoveAll();
            $('body').addClass('theme--06');
            $('.app-aside .slider').val(6);
  }
  else if ( $('body').hasClass('theme--06') ){
            appThemeRemoveAll();
            $('body').addClass('theme--05');
            $('.app-aside .slider').val(5);
  }
  else if ( $('body').hasClass('theme--05') ){
            appThemeRemoveAll();
            $('body').addClass('theme--04');
            $('.app-aside .slider').val(4);
  }
  else if ( $('body').hasClass('theme--04') ){
            appThemeRemoveAll();
            $('body').addClass('theme--03');
            $('.app-aside .slider').val(3);
  }
  else if ( $('body').hasClass('theme--03') ){
            appThemeRemoveAll();
            $('body').addClass('theme--02');
            $('.app-aside .slider').val(2);
  }
  else if ( $('body').hasClass('theme--02') ){
            appThemeRemoveAll();
            $('body').addClass('theme--01');
            $('.app-aside .slider').val(1);
  }
  else if ( $('body').hasClass('theme--01') ){
            appThemeRemoveAll();
            $('body').addClass('theme--00');
            $('.app-aside .slider').val(0);
  }
  else if ( $('body').hasClass('theme--00') ){
            appThemeRemoveAll();
            $('body').addClass('theme--16');
            $('.app-aside .slider').val(16);
  }
}

// Toggle grid overlay
function appGridOverlay() {
  $('.app-grid-overlay').toggleClass('is--visible');
}


// Nav scroll-spy
// Marks contact nav item active when the contact/footer section is in view.
// Wire additional sections here as blog content is added in Astro.
$(window).on('load resize scroll', function() {

  var viewportHeight = $(window).height();
  var appMainScrollTop = $(window).scrollTop();
  var appMainScrollBottom = appMainScrollTop + viewportHeight;

  var appNavItem = $('.app-nav .item');
  var appNavItemContact = $('.app-nav .item.contact');

  var sectionContact = $('.app-main .section.contact');
  if ( sectionContact.length ) {
    var sectionContactHeight = sectionContact.height();
    var sectionContactHeightHalf = sectionContactHeight / 2;
    var sectionContactTop = sectionContact.offset().top;
    var sectionContactMiddle = sectionContactTop + sectionContactHeightHalf;

    appNavItem.removeClass('is--active');

    if ( sectionContactMiddle < appMainScrollBottom ) {
      appNavItemContact.addClass('is--active');
    }
    else {
      // Default: first nav item is active when at top
      $('.app-nav .item:first-child').addClass('is--active');
    }
  }

}); // End nav scroll-spy

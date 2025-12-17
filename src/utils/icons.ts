// Custom Font Awesome icon bundle - only load icons we actually use
// This replaces the full Font Awesome CSS import

export const loadFontAwesome = () => {
  // Create a style element for our custom Font Awesome subset
  const style = document.createElement('style');
  style.textContent = `
    /* Font Awesome subset - only icons we use */
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css');
    
    /* Load only the icon fonts we need */
    @font-face {
      font-family: "Font Awesome 6 Free";
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2') format('woff2');
    }
    
    @font-face {
      font-family: "Font Awesome 6 Brands";
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2') format('woff2');
    }
    
    /* Base classes */
    .fa-solid, .fa-brands {
      font-family: "Font Awesome 6 Free";
      font-weight: 900;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .fa-brands {
      font-family: "Font Awesome 6 Brands";
      font-weight: 400;
    }
    
    /* Animation classes */
    .fa-spin {
      animation: fa-spin 2s infinite linear;
    }
    
    @keyframes fa-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Size classes */
    .fa-2x { font-size: 2em; }
    
    /* Icon definitions - only the ones we use */
    .fa-shield-halved:before { content: "\\f3ed"; }
    .fa-exclamation-triangle:before { content: "\\f071"; }
    .fa-chevron-up:before { content: "\\f077"; }
    .fa-chevron-down:before { content: "\\f078"; }
    .fa-search:before { content: "\\f002"; }
    .fa-pen:before { content: "\\f304"; }
    .fa-download:before { content: "\\f019"; }
    .fa-circle-exclamation:before { content: "\\f06a"; }
    .fa-xmark:before { content: "\\f00d"; }
    .fa-lock:before { content: "\\f023"; }
    .fa-shield-check:before { content: "\\f2f3"; }
    .fa-circle-check:before { content: "\\f058"; }
    .fa-triangle-exclamation:before { content: "\\f071"; }
    .fa-circle-info:before { content: "\\f05a"; }
    .fa-circle-xmark:before { content: "\\f057"; }
    .fa-check-circle:before { content: "\\f058"; }
    .fa-undo:before { content: "\\f0e2"; }
    .fa-receipt:before { content: "\\f543"; }
    .fa-arrow-left:before { content: "\\f060"; }
    .fa-check:before { content: "\\f00c"; }
    .fa-sun:before { content: "\\f185"; }
    .fa-moon:before { content: "\\f186"; }
    .fa-spinner:before { content: "\\f110"; }
    .fa-vial-circle-check:before { content: "\\e596"; }
    .fa-microscope:before { content: "\\f610"; }
    .fa-calendar-plus:before { content: "\\f271"; }
    .fa-user-md:before { content: "\\f0f0"; }
    .fa-clock:before { content: "\\f017"; }
    .fa-calendar-check:before { content: "\\f274"; }
    .fa-indian-rupee-sign:before { content: "\\e1bc"; }
    .fa-arrow-right:before { content: "\\f061"; }
    .fa-phone:before { content: "\\f095"; }
    .fa-envelope:before { content: "\\f0e0"; }
    .fa-location-dot:before { content: "\\f3c5"; }
    .fa-ban:before { content: "\\f05e"; }
    .fa-circle-xmark:before { content: "\\f057"; }
    .fa-credit-card:before { content: "\\f09d"; }
    .fa-users:before { content: "\\f0c0"; }
    
    /* Brand icons */
    .fa-whatsapp:before { content: "\\f232"; }
    .fa-facebook:before { content: "\\f09a"; }
    .fa-github:before { content: "\\f09b"; }
    .fa-linkedin:before { content: "\\f08c"; }
  `;

  document.head.appendChild(style);
};

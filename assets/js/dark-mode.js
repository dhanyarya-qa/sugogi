(function() {
    // ===== DARK MODE — FOUC Prevention (runs in <head>) =====

    var htmlEl = document.documentElement;
    var savedTheme = localStorage.getItem('sogogi-theme');

    // Apply dark mode immediately to prevent FOUC
    // (only sets the html attribute, no DOM element dependency)
    if (savedTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    } else if (savedTheme !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('sogogi-theme', 'dark');
    }

    // Defer the rest (button text, click handlers, system preference listener)
    // to DOMContentLoaded because #themeToggle doesn't exist yet
    document.addEventListener('DOMContentLoaded', function() {
        var toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        var isDark = htmlEl.getAttribute('data-theme') === 'dark';

        function applyTheme(theme) {
            if (theme === 'dark') {
                htmlEl.setAttribute('data-theme', 'dark');
                toggle.textContent = '\u2600\uFE0F';
                toggle.title = 'Ganti tema terang';
            } else {
                htmlEl.removeAttribute('data-theme');
                toggle.textContent = '\uD83C\uDF19';
                toggle.title = 'Ganti tema gelap';
            }
            localStorage.setItem('sogogi-theme', theme);
        }

        // Set correct button state
        applyTheme(isDark ? 'dark' : 'light');

        // Toggle on click
        toggle.addEventListener('click', function() {
            var current = htmlEl.getAttribute('data-theme') === 'dark';
            applyTheme(current ? 'light' : 'dark');
        });

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                if (!localStorage.getItem('sogogi-theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });
})();

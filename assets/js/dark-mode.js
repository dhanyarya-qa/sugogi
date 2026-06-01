(function() {
    // ===== DARK MODE — FOUC Prevention (runs in <head>) =====

    var htmlEl = document.documentElement;
    var savedTheme = localStorage.getItem('sogogi-theme');

    // Apply dark mode immediately to prevent FOUC
    // Only use saved theme if user explicitly toggled it (not system preference)
    if (savedTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    } else if (savedTheme !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
        // DO NOT save system preference to localStorage — only save user-explicit toggles
    }

    // Defer the rest (button text, click handlers, system preference listener)
    // to DOMContentLoaded because #themeToggle doesn't exist yet
    document.addEventListener('DOMContentLoaded', function() {
        var toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        var isDark = htmlEl.getAttribute('data-theme') === 'dark';

        function applyTheme(theme, isUserToggle) {
            if (theme === 'dark') {
                htmlEl.setAttribute('data-theme', 'dark');
                toggle.textContent = '\u2600\uFE0F';
                toggle.title = 'Ganti tema terang';
            } else {
                htmlEl.removeAttribute('data-theme');
                toggle.textContent = '\uD83C\uDF19';
                toggle.title = 'Ganti tema gelap';
            }
            // Only persist to localStorage when user explicitly toggles
            if (isUserToggle) {
                localStorage.setItem('sogogi-theme', theme);
            }
        }

        // Set correct button state (initial, from saved or system)
        applyTheme(isDark ? 'dark' : 'light', false);

        // Toggle on click — this is an explicit user action
        toggle.addEventListener('click', function() {
            var current = htmlEl.getAttribute('data-theme') === 'dark';
            applyTheme(current ? 'light' : 'dark', true);
        });

        // Listen for system preference changes
        // Only follow system when user hasn't made an explicit choice
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                var explicitPref = localStorage.getItem('sogogi-theme');
                if (!explicitPref) {
                    applyTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
    });
})();

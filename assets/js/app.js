(function() {
'use strict';

// ===== DOM REFS (cached once) =====
const $ = (id) => document.getElementById(id);
const scrollProgress = $('scrollProgress');
const backToTop = $('backToTop');
const navbar = $('navbar');
const mobileToggle = $('mobileToggle');
const navLinks = $('navLinks');
const heroSection = document.querySelector('.hero');
const heroParallaxLayers = document.querySelectorAll('.hero-parallax-layer');
const heroParallaxImg = document.querySelector('.hero-parallax-img');

// ===== SMOOTH PARALLAX ENGINE (rAF + lerp interpolation) =====
let parallaxRAF = null;
let parallaxProgress = 0;  // lerped visual value
let parallaxTarget = 0;    // raw target from scroll

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
}

function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
}

function calcHeroTarget() {
    if (!heroSection) return 0;
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < 0) return 1.2;
    return Math.max(0, Math.min(1.2, -rect.top / rect.height));
}

function applyHeroParallax(progress) {
    const gp = progress * 25;
    heroParallaxLayers.forEach(el => {
        if (el) el.style.transform = `translateY(${gp}px) translateZ(0)`;
    });
    if (heroParallaxImg) {
        heroParallaxImg.style.transform = `translateY(${progress * 50}px) translateZ(0)`;
    }
}

function applySectionParallax() {
    const sections = document.querySelectorAll('.parallax-section');
    if (!sections.length) return;
    sections.forEach(section => {
        const bg = section.querySelector('.parallax-bg');
        if (!bg) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top > vh || rect.bottom < 0) return;
        const progress = (vh - rect.top) / (vh + rect.height);
        bg.style.transform = `translateY(${progress * 25 - 12.5}px) translateZ(0) scale(1.03)`;
    });
}

function parallaxTick() {
    parallaxTarget = calcHeroTarget();
    const diff = parallaxTarget - parallaxProgress;
    if (Math.abs(diff) < 0.0008) {
        parallaxProgress = parallaxTarget;
        applyHeroParallax(parallaxProgress);
        applySectionParallax();
        parallaxRAF = null;
        return;
    }
    // Adaptive lerp: faster when far, slower when close — smooth feel
    const speed = Math.max(0.06, Math.min(0.18, Math.abs(diff) * 2.5));
    parallaxProgress += diff * speed;
    applyHeroParallax(parallaxProgress);
    applySectionParallax();
    parallaxRAF = requestAnimationFrame(parallaxTick);
}

window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateBackToTop();
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    // Start rAF parallax loop
    if (!parallaxRAF) {
        parallaxRAF = requestAnimationFrame(parallaxTick);
    }
}, { passive: true });

// Initial state
updateScrollProgress();
if (navbar && window.scrollY > 20) navbar.classList.add('scrolled');
parallaxProgress = calcHeroTarget();
applyHeroParallax(parallaxProgress);

// Back to top click
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== MOBILE MENU =====
if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== SCROLL REVEAL ANIMATIONS (intersection-based) =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

// Observe all .reveal elements and also section containers for entrance
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Also observe each main section with a fresh entrance animation
document.querySelectorAll('section:not(.hero), footer').forEach(section => {
    if (!section.classList.contains('reveal')) {
        section.classList.add('reveal', 'reveal-up');
        revealObserver.observe(section);
    }
});

// ===== GALLERY LIGHTBOX =====
(function() {
    const lightbox = $('galleryLightbox');
    if (!lightbox) return;
    const lbImage = $('lbImage');
    const lbPlaceholder = $('lbPlaceholder');
    const lbCounter = $('lbCounter');
    const lbCaption = $('lbCaption');
    const lbClose = $('lbClose');
    const lbPrev = $('lbPrev');
    const lbNext = $('lbNext');
    const lbWrapper = $('lbImageWrapper');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function openLightbox(index) {
        const items = Array.from(galleryItems);
        if (index < 0 || index >= items.length) return;
        currentIndex = index;
        const item = items[currentIndex];
        const img = item.querySelector('img');
        const label = item.querySelector('.gallery-label');

        if (img && (img.dataset.full || img.src)) {
        lbImage.src = img.dataset.full || img.src;
        lbImage.alt = img.alt || '';
        lbImage.style.display = 'block';
        lbPlaceholder.style.display = 'none';
        // Handle image load failure — show placeholder instead of broken icon
        lbImage.onerror = function() {
            this.style.display = 'none';
            if (lbPlaceholder) lbPlaceholder.style.display = 'flex';
        };
        lbImage.onload = function() {
            this.onerror = null; // clear error handler after successful load
        };
        } else {
            lbImage.style.display = 'none';
            lbPlaceholder.style.display = 'flex';
        }

        lbCaption.textContent = label ? label.textContent.trim() : '';
        lbCounter.textContent = `${currentIndex + 1} / ${items.length}`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        lbImage.style.animation = 'none';
        lbWrapper.style.animation = 'none';
        void lbWrapper.offsetHeight;
        lbImage.style.animation = '';
        lbWrapper.style.animation = '';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!lightbox.classList.contains('open')) lbImage.src = '';
        }, 300);
    }

    function prevImage() {
        const items = Array.from(galleryItems);
        openLightbox(currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1);
    }

    function nextImage() {
        const items = Array.from(galleryItems);
        openLightbox(currentIndex + 1 >= items.length ? 0 : currentIndex + 1);
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', (e) => { e.preventDefault(); openLightbox(idx); });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (!e.target.closest('.lb-image-wrapper, .lb-bottom, .lb-prev, .lb-next, .lb-close')) {
            closeLightbox();
        }
    });

    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') prevImage();
        else if (e.key === 'ArrowRight') nextImage();
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
    }, { passive: true });
})();

// ===== RESERVATION FORM — REAL-TIME VALIDATION =====
(function() {
    const form = $('reservationForm');
    if (!form) return;
    const WA_PHONE = '622129195053';

    const validators = {
        name: { validate: (val) => {
            if (!val) return '⚠️ Nama lengkap harus diisi';
            if (val.length < 3) return '⚠️ Nama minimal 3 karakter';
            if (val.length > 60) return '⚠️ Nama maksimal 60 karakter';
            if (/^[0-9]+$/.test(val)) return '⚠️ Nama tidak boleh hanya angka';
            return '';
        }},
        phone: { validate: (val) => {
            if (!val) return '⚠️ Nomor WhatsApp harus diisi';
            const cleaned = val.replace(/[\s\-()]/g, '');
            if (!/^(\+?62|08)\d{7,11}$/.test(cleaned)) return '⚠️ Format nomor tidak valid. Gunakan 08xx atau +62xx';
            if (cleaned.length < 10 || cleaned.length > 14) return '⚠️ Nomor harus 10–14 digit (contoh: 081234567890)';
            return '';
        }},
        guests: { validate: (val) => {
            if (!val || parseInt(val) < 1) return '⚠️ Minimal 1 orang';
            if (parseInt(val) > 30) return '⚠️ Maksimal 30 orang. Untuk rombongan >30, hubungi kami langsung';
            return '';
        }},
        date: { validate: (val) => {
            if (!val) return '⚠️ Tanggal reservasi harus diisi';
            const selected = new Date(val + 'T23:59:59');
            const today = new Date(); today.setHours(0, 0, 0, 0);
            if (selected < today) return '⚠️ Tanggal tidak boleh di masa lalu';
            const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth() + 3);
            if (selected > maxDate) return '⚠️ Reservasi maksimal H-90 hari';
            return '';
        }},
        time: { validate: (val) => {
            if (!val) return '⚠️ Waktu reservasi harus diisi';
            const [h] = val.split(':').map(Number);
            if (h < 12) return '⚠️ Kami buka pukul 12.00 WIB. Pilih jam 12:00 atau setelahnya';
            if (h > 21) return '⚠️ Reservasi terakhir pukul 21.00 WIB';
            return '';
        }},
        package: { validate: () => {
            if (!document.querySelector('input[name="package"]:checked')) return '⚠️ Pilih salah satu paket AYCE';
            return '';
        }}
    };

    function validateField(fieldName) {
        const group = document.querySelector(`.form-group[data-field="${fieldName}"]`);
        if (!group) return '';
        const input = group.querySelector('input, select, textarea');
        let value = input ? input.value.trim() : '';
        if (fieldName === 'package') {
            const checked = group.querySelector('input[type="radio"]:checked');
            value = checked ? checked.value : '';
        }
        const validator = validators[fieldName];
        if (!validator) return '';
        const error = validator.validate(value);
        const errorEl = group.querySelector('.error-message');
        group.classList.remove('error', 'success', 'shake');
        if (error) {
            group.classList.add('error');
            if (errorEl) errorEl.textContent = error;
            return error;
        }
        if (group.dataset.touched === 'true') group.classList.add('success');
        if (errorEl) errorEl.textContent = '✅';
        return '';
    }

    function validateAll() {
        let isValid = true;
        Object.keys(validators).forEach(field => {
            const group = document.querySelector(`.form-group[data-field="${field}"]`);
            if (group) group.dataset.touched = 'true';
            if (validateField(field)) isValid = false;
        });
        return isValid;
    }

    Object.keys(validators).forEach(field => {
        const group = document.querySelector(`.form-group[data-field="${field}"]`);
        if (!group) return;
        const input = group.querySelector('input, select, textarea');
        if (!input) return;
        input.addEventListener('blur', () => { group.dataset.touched = 'true'; validateField(field); });
        input.addEventListener('input', () => { if (group.dataset.touched === 'true') validateField(field); });
        if (input.type === 'radio') {
            group.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', () => { group.dataset.touched = 'true'; validateField(field); });
            });
        }
    });

    // ===== AVAILABILITY CHECKER =====
    const TOTAL_SLOTS = 8;
    const TIME_SLOTS = ['12:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

    function generateBookingData() {
        const data = {};
        const today = new Date();
        const seed = today.getDate() + today.getMonth() * 31;
        for (let d = 0; d < 31; d++) {
            const date = new Date(today);
            date.setDate(date.getDate() + d);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            data[dateStr] = {};
            TIME_SLOTS.forEach((slot, idx) => {
                const hour = parseInt(slot.split(':')[0]);
                const weekendBoost = isWeekend ? 1.4 : 1.0;
                let timeBoost = 1.0;
                if (hour >= 18 && hour <= 20) timeBoost = 1.8;
                else if (hour >= 17) timeBoost = 1.3;
                else if (hour >= 14) timeBoost = 1.0;
                else timeBoost = 0.6;
                const hash = (seed + d * 7 + idx * 13) % 100;
                const baseLoad = (hash / 100) * 0.6 + 0.2;
                const load = Math.min(baseLoad * weekendBoost * timeBoost, 0.95);
                data[dateStr][slot] = Math.min(Math.round(load * TOTAL_SLOTS), TOTAL_SLOTS);
            });
        }
        return data;
    }

    const bookingData = generateBookingData();
    const dateInput = $('resDate');
    const timeInput = $('resTime');
    const availSection = $('availSection');
    const availSlots = $('availSlots');
    const availBadge = $('availBadge');
    const availNote = $('availNote');

    function getAvailability(dateStr, timeStr) {
        if (!dateStr || !timeStr) return null;
        const dayData = bookingData[dateStr];
        if (!dayData) return TOTAL_SLOTS;
        const booked = dayData[timeStr];
        return booked === undefined ? TOTAL_SLOTS : TOTAL_SLOTS - booked;
    }

    function getDateStatus(dateStr) {
        if (!dateStr) return { label: '', class: '', available: 0, total: 0 };
        const dayData = bookingData[dateStr];
        if (!dayData) return { label: 'Tersedia', class: 'avail-high', available: TIME_SLOTS.length * TOTAL_SLOTS, total: TIME_SLOTS.length * TOTAL_SLOTS };
        let totalAvail = 0, totalSlots = 0;
        TIME_SLOTS.forEach(slot => { totalAvail += TOTAL_SLOTS - (dayData[slot] || 0); totalSlots += TOTAL_SLOTS; });
        const pct = totalAvail / totalSlots;
        if (pct <= 0.05) return { label: '⛔ Hampir Penuh', class: 'avail-full', available: totalAvail, total: totalSlots };
        if (pct <= 0.3) return { label: '🟠 Terbatas', class: 'avail-low', available: totalAvail, total: totalSlots };
        if (pct <= 0.6) return { label: '🟡 Cukup', class: 'avail-mid', available: totalAvail, total: totalSlots };
        return { label: '✅ Tersedia', class: 'avail-high', available: totalAvail, total: totalSlots };
    }

    function renderAvailability(dateStr) {
        if (!dateStr || !availSection) { if (availSection) availSection.style.display = 'none'; return; }
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = dateStr === todayStr;
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        availSection.style.display = 'block';
        const status = getDateStatus(dateStr);
        availBadge.textContent = status.label;
        availBadge.className = 'avail-badge ' + status.class;

        let html = '';
        TIME_SLOTS.forEach(slot => {
            if (isToday) {
                const [h, m] = slot.split(':').map(Number);
                if (h < currentHour || (h === currentHour && m <= currentMin)) {
                    html += `<div class="avail-slot slot-booked"><span class="slot-time">${slot}</span><span class="slot-status">Lewat</span></div>`;
                    return;
                }
            }
            const avail = getAvailability(dateStr, slot);
            if (avail === null) { html += `<div class="avail-slot slot-booked"><span class="slot-time">${slot}</span><span class="slot-status">—</span></div>`; return; }
            let slotClass, statusText;
            if (avail <= 0) { slotClass = 'slot-booked'; statusText = 'Penuh'; }
            else if (avail <= 2) { slotClass = 'slot-limited clickable'; statusText = `Sisa ${avail}`; }
            else { slotClass = 'slot-available clickable'; statusText = `${avail} meja`; }
            const selected = slot === timeInput.value ? ' slot-selected' : '';
            html += `<div class="avail-slot ${slotClass}${selected}" data-slot="${slot}"><span class="slot-time">${slot}</span><span class="slot-status">${statusText}</span></div>`;
        });

        availSlots.innerHTML = html;
        availSlots.querySelectorAll('.clickable').forEach(el => {
            el.addEventListener('click', () => {
                const slot = el.dataset.slot;
                if (slot) {
                    timeInput.value = slot;
                    const timeGroup = document.querySelector('.form-group[data-field="time"]');
                    if (timeGroup) { timeGroup.dataset.touched = 'true'; validateField('time'); }
                    renderAvailability(dateStr);
                }
            });
        });

        const dayData = bookingData[dateStr];
        if (dayData) {
            const fullyBookedSlots = TIME_SLOTS.filter(s => (dayData[s] || 0) >= TOTAL_SLOTS);
            if (fullyBookedSlots.length >= 4) {
                availNote.innerHTML = '⛔ <strong>Sebagian besar slot sudah penuh!</strong> Coba pilih tanggal lain atau hubungi kami langsung.';
            } else if (fullyBookedSlots.length > 0) {
                availNote.innerHTML = `⚠️ Slot <strong>${fullyBookedSlots.join(', ')}</strong> sudah penuh. Pilih slot lain yang tersedia!`;
            } else {
                availNote.innerHTML = '💡 <strong>Tip:</strong> Pilih slot yang tersedia. Akhir pekan lebih cepat penuh — reservasi lebih awal!';
            }
        } else {
            availNote.innerHTML = '💡 <strong>Tip:</strong> Pilih slot yang tersedia. Akhir pekan lebih cepat penuh — reservasi lebih awal!';
        }
    }

    // Date input setup
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);

        if (!dateInput.value) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        }
        renderAvailability(dateInput.value);

        dateInput.addEventListener('change', () => renderAvailability(dateInput.value));
        timeInput.addEventListener('change', () => { if (dateInput.value) renderAvailability(dateInput.value); });
    }

    // ===== FORM SUBMIT =====
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        Object.keys(validators).forEach(field => {
            const group = document.querySelector(`.form-group[data-field="${field}"]`);
            if (group) group.dataset.touched = 'true';
        });

        if (!validateAll()) {
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.classList.add('shake');
                setTimeout(() => firstError.classList.remove('shake'), 500);
            }
            const firstErrorInput = document.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstErrorInput) firstErrorInput.focus();
            return;
        }

        const name = $('resName').value.trim();
        const phone = $('resPhone').value.trim();
        const guests = $('resGuests').value;
        const date = $('resDate').value;
        const time = $('resTime').value;
        const pkg = document.querySelector('input[name="package"]:checked').value;
        const notes = $('resNotes').value.trim();

        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        const dateParts = date.split('-');
        const formattedDate = `${parseInt(dateParts[2])} ${months[parseInt(dateParts[1])-1]} ${dateParts[0]}`;

        let message = `Halo Sogogi Buaran! 🙋‍♂️\n\nSaya mau reservasi meja dengan detail berikut:\n\n`;
        message += `📋 *Data Reservasi*\n👤 Nama: ${name}\n📱 WhatsApp: ${phone}\n`;
        message += `👥 Jumlah Orang: ${guests} pax\n📅 Tanggal: ${formattedDate}\n⏰ Waktu: ${time} WIB\n🥩 Paket: ${pkg}\n`;
        if (notes) message += `📝 Catatan: ${notes}\n`;
        message += `\nTerima kasih! 🙏`;

        const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;

        $('modalName').textContent = name;
        $('modalPhone').textContent = phone;
        $('modalGuests').textContent = guests + ' pax';
        $('modalDate').textContent = formattedDate;
        $('modalTime').textContent = time + ' WIB';
        $('modalPackage').textContent = pkg;

        const notesEl = $('modalNotesRow');
        if (notes) { notesEl.style.display = 'flex'; $('modalNotes').textContent = notes; }
        else { notesEl.style.display = 'none'; }
        $('modalWaBtn').href = waUrl;
        $('successModal').classList.add('open');

        form.reset();
        document.querySelectorAll('.form-group').forEach(g => {
            g.classList.remove('error', 'success');
            g.dataset.touched = 'false';
        });

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateInput) {
            dateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
            renderAvailability(dateInput.value);
        }
        if (timeInput) timeInput.value = '18:00';
        $('reservation').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ===== SUCCESS MODAL =====
    const modal = $('successModal');
    if (modal) {
        const modalClose = $('modalClose');
        const modalDone = $('modalDone');
        function closeModal() { modal.classList.remove('open'); }
        modalClose.addEventListener('click', closeModal);
        modalDone.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    }
})();

// ===== TYPEWRITER CURSOR =====
(function() {
    const h1 = document.querySelector('.hero h1');
    if (h1) {
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        h1.appendChild(cursor);
    }
})();

// ===== TESTIMONIAL CAROUSEL =====
(function() {
    const track = $('testiTrack');
    const prevBtn = $('testiPrev');
    const nextBtn = $('testiNext');
    const dots = document.querySelectorAll('.testi-dot');
    if (!track || !prevBtn || !nextBtn) return;
    const total = track.querySelectorAll('.testi-card').length;
    let current = 0;
    function goTo(i) {
        if (total === 0) return; // no cards to show
        if (i < 0) i = total - 1;
        if (i >= total) i = 0;
        current = i;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === current));
        // Update aria-current for accessibility
        dots.forEach((dot, idx) => dot.setAttribute('aria-current', idx === current ? 'true' : 'false'));
    }
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => { const idx = parseInt(dot.dataset.index); if (!isNaN(idx)) goTo(idx); });
    });
    let autoplay = setInterval(() => goTo(current + 1), 5000);
    const wrapper = track.closest('.testi-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
        wrapper.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 5000); });
    }
})();

// ===== 3D TILT CARDS =====
(function() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
            const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
            const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
            card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
        });
    });
})();

// ===== MAGNETIC BUTTONS =====
(function() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 8;
            const y = (e.clientY - rect.top - rect.height / 2) / 8;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();

// ===== STATS COUNTER =====
(function() {
    const cards = document.querySelectorAll('.stat-card');
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            const numEl = card.querySelector('.stat-number');
            const count = parseInt(card.dataset.count) || 0;
            if (!numEl) return;
            observer.unobserve(card);
            const steps = 30, dur = 2000;
            const inc = count / steps;
            let val = 0, s = 0;
            function tick() {
                s++;
                val = Math.min(Math.round(inc * s), count);
                numEl.textContent = val.toLocaleString('id-ID');
                card.classList.add('counting');
                setTimeout(() => card.classList.remove('counting'), 300);
                if (val < count) setTimeout(tick, dur / steps);
            }
            tick();
        });
    }, { threshold: 0.3 });
    cards.forEach(c => observer.observe(c));
})();

// ===== MENU TABS =====
(function() {
    const tabs = document.querySelectorAll('.menu-tab');
    const contents = document.querySelectorAll('.menu-tab-content');
    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            if (!target) return;

            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Show target content
            contents.forEach(c => {
                c.classList.remove('active');
                if (c.id === 'menu-' + target) {
                    c.classList.add('active');
                    // Re-trigger reveal animations for new visible content
                    const revealEls = c.querySelectorAll('.reveal');
                    revealEls.forEach(el => {
                        el.classList.remove('visible');
                        // Use IntersectionObserver if available (from outer closure)
                        if (typeof revealObserver !== 'undefined') {
                            revealObserver.observe(el);
                        }
                    });
                }
            });

            // Smooth scroll if tab is off-screen
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                const rect = menuSection.getBoundingClientRect();
                if (rect.top < 0) {
                    menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
})();

// ===== FLOATING FOOD PARTICLES =====
(function() {
    const emojis = ['🥩', '🥬', '🥟', '🔥', '🍲', '🥤', '🥢', '🧄', '🌶️', '🧅'];
    const c = document.createElement('div');
    c.className = 'float-particles';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('span');
        p.className = 'float-particle';
        p.textContent = emojis[i % emojis.length];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (1.2 + Math.random() * 1.6) + 'rem';
        p.style.animationDuration = (10 + Math.random() * 12) + 's';
        p.style.animationDelay = (Math.random() * 15) + 's';
        c.appendChild(p);
    }
})();

// ===== MENU IMAGE FALLBACK =====
(function() {
    document.querySelectorAll('.menu-item-img img').forEach(img => {
        function hideOnFail() {
            img.style.display = 'none';
            // Keep overlay visible for nice gradient backdrop
        }
        img.addEventListener('error', hideOnFail);
        if (img.complete && img.naturalWidth === 0) hideOnFail();
    });
})();

})();

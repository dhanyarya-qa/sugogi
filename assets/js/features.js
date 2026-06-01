(function() {
'use strict';

// ======================================================================
// ===== #16: DAILY UPDATE BAR =====
// ======================================================================
(function() {
    const bar = document.getElementById('dailyBar');
    const toggle = document.getElementById('dailyBarToggle');
    if (!bar) return;

    const updates = [
        '🔥 Hari ini: Free Tteokbokki untuk 10 pelanggan pertama!',
        '📸 Upload foto Sogogi di IG, tag @sogogishabu — dapet diskon!',
        '🎂 Ulang tahun? GRATIS dessert + mini cake (min. 4 orang)!',
        '🧑‍🎓 Pelajar/Mahasiswa potongan Rp15rb — tunjukin kartumu!',
        '👨‍👩‍👧‍👦 Group deal: 5 bayar, 1 GRATIS! Reservasi H-1 ya!',
        '🥩 Wagyu beef stock segar hari ini — jangan kehabisan!',
        '⏰ Happy Hour 14.00-16.00: Minuman free-flow ALL!'
    ];

    const textEl = bar.querySelector('.daily-text');
    let currentIdx = 0;

    function rotateUpdate() {
        currentIdx = (currentIdx + 1) % updates.length;
        if (textEl) {
            textEl.style.opacity = '0';
            setTimeout(function() {
                textEl.textContent = '📢 ' + updates[currentIdx];
                textEl.style.opacity = '1';
            }, 300);
        }
    }

    // Rotate every 8 seconds
    setInterval(rotateUpdate, 8000);

    if (toggle) {
        toggle.addEventListener('click', function() {
            bar.classList.toggle('daily-hidden');
            toggle.textContent = bar.classList.contains('daily-hidden') ? '📢' : '✕';
        });
    }
})();

// ======================================================================
// ===== #18: LIVE OCCUPANCY STATUS =====
// ======================================================================
(function() {
    const badge = document.getElementById('occupancyBadge');
    if (!badge) return;

    const statuses = [
        { emoji: '🟢', label: 'Santai', desc: 'Banyak meja kosong, langsung datang aja!' },
        { emoji: '🟡', label: 'Lumayan Rame', desc: 'Beberapa meja terisi, reservasi dianjurkan' },
        { emoji: '🔴', label: 'Full Banget!', desc: 'Hampir penuh! Reservasi dulu ya!' }
    ];

    // Simulate based on time of day
    function updateOccupancy() {
        const hour = new Date().getHours();
        let idx = 0;
        if (hour >= 12 && hour < 14) idx = 1;      // Lunch rush
        else if (hour >= 18 && hour <= 20) idx = 2; // Dinner rush
        else if (hour >= 14 && hour < 17) idx = 0;  // Afternoon slow
        else if (hour > 20 && hour < 22) idx = 1;   // Late dinner
        else idx = 0; // Closed hours show green

        const status = statuses[idx];
        badge.innerHTML = '<span class="occ-emoji">' + status.emoji + '</span> ' + status.label;
        badge.title = status.desc;

        // Toggle class for styling
        badge.className = 'occ-badge occ-' + ['low', 'mid', 'high'][idx];
    }

    updateOccupancy();
    setInterval(updateOccupancy, 60000); // Update every minute
})();

// ======================================================================
// ===== #22: SOGOGI-MERGENCY BUTTON =====
// ======================================================================
(function() {
    const btn = document.getElementById('sogogiMercy');
    if (!btn) return;

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const msg = encodeURIComponent(
            '⚠️ DARURAT! Saya lapar banget! Pesan SEMUA! 🥩🔥🍲\n\n' +
            'Mau reservasi SEKARANG juga! Yang penting daging + kuah melimpah! 🙏\n\n' +
            'Sogogi tolong saya! 🤤'
        );
        window.open('https://wa.me/622129195053?text=' + msg, '_blank');
    });

    // Floating animation on scroll
    let mercyVisible = false;
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        if (scrollY > 300 && !mercyVisible) {
            btn.classList.add('mercy-visible');
            mercyVisible = true;
        } else if (scrollY <= 300 && mercyVisible) {
            btn.classList.remove('mercy-visible');
            mercyVisible = false;
        }
    });
})();

// ======================================================================
// ===== #19: FLOATING MUSIC PLAYER =====
// ======================================================================
(function() {
    const player = document.getElementById('musicPlayer');
    const toggle = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    if (!player || !toggle || !audio) return;

    let isPlaying = false;

    // Set volume low
    audio.volume = 0.15;

    toggle.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            toggle.textContent = '🎵';
            toggle.classList.remove('music-on');
            player.classList.remove('music-active');
        } else {
            audio.play().catch(function() {
                // Autoplay blocked, show message
            });
            toggle.textContent = '🔊';
            toggle.classList.add('music-on');
            player.classList.add('music-active');
        }
        isPlaying = !isPlaying;
    });

    // Also show music note animation in player
    const note = player.querySelector('.music-note');
    if (note) {
        setInterval(function() {
            if (isPlaying) {
                note.style.animation = 'none';
                void note.offsetHeight;
                note.style.animation = 'music-note-bounce 1.5s ease-in-out infinite';
            }
        }, 2000);
    }
})();

// ======================================================================
// ===== #3: COUNTDOWN TIMER PROMO =====
// ======================================================================
(function() {
    const timerEl = document.getElementById('promoTimer');
    if (!timerEl) return;

    function getNextTarget() {
        const now = new Date();
        // Target: end of current week (Sunday 23:59)
        const target = new Date(now);
        target.setDate(target.getDate() + (7 - target.getDay()));
        target.setHours(23, 59, 59, 0);
        return target;
    }

    function updateTimer() {
        const now = new Date();
        const target = getNextTarget();
        const diff = target - now;

        if (diff <= 0) {
            timerEl.textContent = '🔥 Promo Berakhir!';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.innerHTML =
            '<div class="timer-unit"><span class="timer-num">' + days + '</span><span class="timer-label">Hari</span></div>' +
            '<div class="timer-sep">:</div>' +
            '<div class="timer-unit"><span class="timer-num">' + String(hours).padStart(2, '0') + '</span><span class="timer-label">Jam</span></div>' +
            '<div class="timer-sep">:</div>' +
            '<div class="timer-unit"><span class="timer-num">' + String(mins).padStart(2, '0') + '</span><span class="timer-label">Menit</span></div>' +
            '<div class="timer-sep">:</div>' +
            '<div class="timer-unit"><span class="timer-num">' + String(secs).padStart(2, '0') + '</span><span class="timer-label">Detik</span></div>';
    }

    updateTimer();
    setInterval(updateTimer, 1000);
})();

// ======================================================================
// ===== #2: HARGA KALKULATOR & #23: GROUP BILL ESTIMATOR =====
// ======================================================================
(function() {
    const calc = document.getElementById('hargaKalkulator');
    if (!calc) return;

    const paketSelect = document.getElementById('kalkulator-paket');
    const orangInput = document.getElementById('kalkulator-orang');
    const durasiSelect = document.getElementById('kalkulator-durasi');
    const hitungBtn = document.getElementById('kalkulator-hitung');
    const resultEl = document.getElementById('kalkulator-result');

    const PAKET = {
        'regular': { name: 'Regular Beef', harga: 100000 },
        'grilled': { name: 'Grilled & Shabu', harga: 125000 },
        'wagyu': { name: 'Premium Wagyu', harga: 160000 }
    };

    if (hitungBtn && paketSelect && orangInput) {
        hitungBtn.addEventListener('click', function() {
            const paket = PAKET[paketSelect.value];
            const orang = parseInt(orangInput.value) || 1;
            const durasi = parseInt(durasiSelect ? durasiSelect.value : 90);

            if (!paket) {
                resultEl.innerHTML = '<div class="calc-error">⚠️ Pilih paket dulu!</div>';
                return;
            }

            const subtotal = paket.harga * orang;
            const pajak = Math.round(subtotal * 0.1); // 10% tax
            const service = Math.round(subtotal * 0.05); // 5% service
            const total = subtotal + pajak + service;
            const perOrang = Math.round(total / orang);

            let extraFee = 0;
            if (durasi > 90) {
                extraFee = Math.round((durasi - 90) / 30) * 25000 * orang;
            }

            resultEl.innerHTML =
                '<div class="calc-result-grid">' +
                '<div class="calc-row"><span>' + paket.name + '</span><span>Rp ' + paket.harga.toLocaleString('id-ID') + ' × ' + orang + '</span></div>' +
                '<div class="calc-row"><span>Subtotal</span><span>Rp ' + subtotal.toLocaleString('id-ID') + '</span></div>' +
                '<div class="calc-row"><span>Pajak (10%)</span><span>Rp ' + pajak.toLocaleString('id-ID') + '</span></div>' +
                '<div class="calc-row"><span>Service (5%)</span><span>Rp ' + service.toLocaleString('id-ID') + '</span></div>' +
                (extraFee > 0 ? '<div class="calc-row"><span>Biaya Overtime</span><span>Rp ' + extraFee.toLocaleString('id-ID') + '</span></div>' : '') +
                '<div class="calc-row calc-total"><span>💰 Total</span><span>Rp ' + total.toLocaleString('id-ID') + '</span></div>' +
                '<div class="calc-row calc-per"><span>Per Orang</span><span>Rp ' + perOrang.toLocaleString('id-ID') + '</span></div>' +
                '</div>' +
                '<div class="calc-actions" style="margin-top:12px">' +
                '<a href="https://wa.me/622129195053?text=Halo%20Sogogi%20Buaran%2C%20saya%20mau%20reservasi%20' + paket.name.replace(/ /g, '%20') + '%20untuk%20' + orang + '%20orang...' + '" target="_blank" class="btn btn-wa" style="display:inline-flex;padding:10px 20px;font-size:0.82rem;">💬 Reservasi Sekarang</a>' +
                '</div>';

            resultEl.style.display = 'block';
        });
    }
})();

// ======================================================================
// ===== #12: SHABU TIMER INTERAKTIF =====
// ======================================================================
(function() {
    const timerSection = document.getElementById('shabuTimer');
    if (!timerSection) return;

    const startBtn = document.getElementById('timerStart');
    const resetBtn = document.getElementById('timerReset');
    const display = document.getElementById('timerDisplay');
    const progressBar = document.getElementById('timerProgress');
    const statusMsg = document.getElementById('timerStatus');
    const quickBtns = document.querySelectorAll('.timer-quick-btn');

    let timerInterval = null;
    let remaining = 90 * 60; // 90 minutes in seconds
    let totalTime = 90 * 60;
    let isRunning = false;

    function formatTime(secs) {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function updateDisplay() {
        if (!display) return;
        display.textContent = formatTime(remaining);

        const pct = ((totalTime - remaining) / totalTime) * 100;
        if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';

        if (statusMsg) {
            if (remaining <= 0) {
                statusMsg.textContent = '⏰ WAKTU HABIS! Saatnya pesen dessert! 🍦';
                statusMsg.style.color = '#e74c3c';
                if (startBtn) startBtn.textContent = '🔄 Mulai Lagi';
                stopTimer();
            } else if (remaining <= 300) {
                statusMsg.textContent = '⚠️ Sisa 5 menit! Buruan ambil terakhir! 🔥';
                statusMsg.style.color = '#e67e22';
            } else if (remaining <= 600) {
                statusMsg.textContent = '⏳ Sisa 10 menit — jangan lupa dessert!';
                statusMsg.style.color = '#f39c12';
            } else if (isRunning) {
                statusMsg.textContent = '🔥 Lagi makan! Gas terus! 🥩';
                statusMsg.style.color = '#27ae60';
            } else {
                statusMsg.textContent = '⏸️ Timer dijeda';
                statusMsg.style.color = 'var(--text-muted)';
            }
        }
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        isRunning = true;
        if (startBtn) startBtn.textContent = '⏸️ Jeda';
        timerInterval = setInterval(function() {
            if (remaining > 0) {
                remaining--;
                updateDisplay();
            } else {
                stopTimer();
                updateDisplay();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isRunning = false;
        if (startBtn && remaining > 0) startBtn.textContent = '▶️ Lanjut';
    }

    function resetTimer(minutes) {
        stopTimer();
        totalTime = minutes * 60;
        remaining = totalTime;
        if (startBtn) startBtn.textContent = '▶️ Mulai Makan!';
        updateDisplay();
    }

    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (remaining <= 0) {
                resetTimer(90);
                setTimeout(startTimer, 100);
            } else if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetTimer(90);
        });
    }

    if (quickBtns) {
        quickBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const mins = parseInt(this.dataset.minutes) || 90;
                resetTimer(mins);
            });
        });
    }

    // Check on page load: if in section, show initial state
    if (display) display.textContent = formatTime(remaining);
    updateDisplay();

    // Warn user before leaving if timer is running
    window.addEventListener('beforeunload', function(e) {
        if (isRunning) {
            e.preventDefault();
            e.returnValue = 'Timer masih berjalan! Yakin mau pergi?';
        }
    });
})();

// ======================================================================
// ===== #13: MOOD-BASED MENU PICKER =====
// ======================================================================
(function() {
    const picker = document.getElementById('moodPicker');
    if (!picker) return;

    const moods = document.querySelectorAll('.mood-btn');
    const resultArea = document.getElementById('moodResult');

    const moodData = {
        'pedas': {
            emoji: '🌶️',
            title: 'Pedas! Pedas!',
            menus: ['🔥 Tteokbokki', '🌶️ Spicy Pork', '🥵 Spicy Beef Soup', '🌶️ Szechuan Shabu Kuah']
        },
        'berkuah': {
            emoji: '🍲',
            title: 'Pengen yang Berkuah',
            menus: ['🍜 Shabu-Shabu Original', '🥟 Gyoza Shabu', '🧆 Bakso Sapi', '🥟 Fish Tofu']
        },
        'bbq': {
            emoji: '🔥',
            title: 'BBQ Banget!',
            menus: ['🥩 Beef Brisket', '🔥 Pork Belly', '🥓 Beef Bulgogi', '🥇 Wagyu Beef']
        },
        'manis': {
            emoji: '🍦',
            title: 'Yang Manis-Manis',
            menus: ['🍦 Ice Cream Free-Flow', '🍧 Bingsu', '🍡 Mochi Ice Cream', '🍮 Pudding Karamel']
        },
        'segar': {
            emoji: '🥗',
            title: 'Yang Segar-Segar',
            menus: ['🥬 Sayuran Segar', '🥟 Egg Roll', '🧈 Tahu Goreng', '🥤 Lychee Tea']
        },
        'hemat': {
            emoji: '👛',
            title: 'Budget Kantong',
            menus: ['🍲 Regular Beef Paket', '🥟 French Fries', '🧊 Es Teh Manis', '🍦 Ice Cream']
        }
    };

    if (moods.length && resultArea) {
        moods.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const mood = this.dataset.mood;
                const data = moodData[mood];
                if (!data) return;

                moods.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                resultArea.innerHTML =
                    '<div class="mood-result-card">' +
                    '<div class="mood-result-emoji">' + data.emoji + '</div>' +
                    '<h4>' + data.title + '</h4>' +
                    '<p>Kami rekomendasikan:</p>' +
                    '<ul>' + data.menus.map(function(m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' +
                    '<a href="https://wa.me/622129195053?text=Halo%20Sogogi%20Buaran%2C%20saya%20mau%20pesan%3A%20' + encodeURIComponent(data.menus.join(', ')) + '" target="_blank" class="btn btn-primary" style="display:inline-flex;padding:10px 20px;font-size:0.82rem;margin-top:12px;">💬 Pesan via WhatsApp</a>' +
                    '</div>';

                resultArea.style.display = 'block';
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }
})();

// ======================================================================
// ===== #14: SOGOGI SUIT MINI GAME =====
// ======================================================================
(function() {
    const game = document.getElementById('sogogiSuit');
    if (!game) return;

    const choices = document.querySelectorAll('.suit-choice');
    const resultDiv = document.getElementById('suitResult');
    const scoreDiv = document.getElementById('suitScore');
    const playerEmoji = document.getElementById('suitPlayer');
    const botEmoji = document.getElementById('suitBot');

    let playerScore = 0;
    let botScore = 0;
    let gamesPlayed = 0;

    const suitMap = {
        'batu': { emoji: '✊', beats: 'gunting' },
        'gunting': { emoji: '✌️', beats: 'kertas' },
        'kertas': { emoji: '✋', beats: 'batu' }
    };

    const botChoices = ['batu', 'gunting', 'kertas'];

    function getResult(player, bot) {
        if (player === bot) return 'seri';
        return suitMap[player].beats === bot ? 'menang' : 'kalah';
    }

    const winMessages = [
        '🎉 KAMU MENANG! Dapet diskon Rp5rb buat next visit!',
        '🔥 Mantap! Skill suit level dewa! Diskon Rp5rb!',
        '⭐ Gila! Menang terus! Free es krim + diskon!'
    ];
    const loseMessages = [
        '😅 Kalah, yuk cobain lagi! Masih ada kesempatan!',
        '💪 Ayo lagi! Jangan nyerah!',
        '🤪 Hoki bot, next pasti menang!'
    ];
    const drawMessages = [
        '🤝 Seri! Adu suit lagi yuk!',
        '😲 Sama-sama kuat! Lagi!',
        '⚔️ Seri! Belum ada yang unggul!'
    ];

    if (choices.length) {
        choices.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const playerChoice = this.dataset.choice;
                const botChoice = botChoices[Math.floor(Math.random() * botChoices.length)];
                const result = getResult(playerChoice, botChoice);

                // Animate
                if (playerEmoji) playerEmoji.textContent = suitMap[playerChoice].emoji;
                if (botEmoji) botEmoji.textContent = '❓';

                // Bot delay for suspense
                setTimeout(function() {
                    if (botEmoji) botEmoji.textContent = suitMap[botChoice].emoji;

                    let msg = '';
                    let voucherLink = '';

                    if (result === 'menang') {
                        playerScore++;
                        msg = winMessages[Math.floor(Math.random() * winMessages.length)];
                        voucherLink = 'https://wa.me/622129195053?text=Halo%20Sogogi%20Buaran%2C%20saya%20menang%20game%20Suit%20di%20website%21%20Mau%20klaim%20diskon%20Rp5rb%20dong%21';
                    } else if (result === 'kalah') {
                        botScore++;
                        msg = loseMessages[Math.floor(Math.random() * loseMessages.length)];
                    } else {
                        msg = drawMessages[Math.floor(Math.random() * drawMessages.length)];
                    }
                    gamesPlayed++;

                    if (resultDiv) {
                        resultDiv.innerHTML =
                            '<p style="font-size:1.1rem;margin-bottom:8px;">' + msg + '</p>' +
                            (voucherLink ? '<a href="' + voucherLink + '" target="_blank" class="btn btn-wa" style="display:inline-flex;padding:8px 16px;font-size:0.78rem;">💬 Klaim Diskon via WA</a>' : '');
                    }

                    if (scoreDiv) {
                        scoreDiv.innerHTML = '🧑 Kamu: ' + playerScore + ' | 🤖 Bot: ' + botScore;
                    }
                }, 600);
            });
        });
    }
})();

// ======================================================================
// ===== #15: MEJA VIRTUAL PICKER =====
// ======================================================================
(function() {
    const mejaPicker = document.getElementById('mejaPicker');
    if (!mejaPicker) return;

    const mejaGrid = document.getElementById('mejaGrid');
    const selectedInfo = document.getElementById('mejaSelected');

    const tables = [
        { id: 'A1', capacity: 2, label: 'Meja Kecil A1' },
        { id: 'A2', capacity: 2, label: 'Meja Kecil A2' },
        { id: 'A3', capacity: 4, label: 'Meja Sedang A3' },
        { id: 'A4', capacity: 4, label: 'Meja Sedang A4' },
        { id: 'B1', capacity: 6, label: 'Meja Besar B1' },
        { id: 'B2', capacity: 6, label: 'Meja Besar B2' },
        { id: 'B3', capacity: 8, label: 'Meja VIP B3' },
        { id: 'C1', capacity: 4, label: 'Meja Jendela C1' },
        { id: 'C2', capacity: 4, label: 'Meja Jendela C2' },
        { id: 'D1', capacity: 10, label: 'Meja Rombongan D1' }
    ];

    // Simulate some booked tables
    const bookedTables = ['A1', 'B1', 'C2'];

    if (mejaGrid) {
        tables.forEach(function(table) {
            const el = document.createElement('button');
            el.className = 'meja-item';
            el.dataset.tableId = table.id;
            el.dataset.capacity = table.capacity;

            const isBooked = bookedTables.includes(table.id);
            if (isBooked) el.classList.add('meja-booked');

            el.innerHTML =
                '<div class="meja-shape"></div>' +
                '<div class="meja-label">' + table.id + '</div>' +
                '<div class="meja-capacity">' + table.capacity + ' org</div>';

            if (!isBooked) {
                el.addEventListener('click', function() {
                    mejaGrid.querySelectorAll('.meja-item').forEach(function(m) { m.classList.remove('meja-selected'); });
                    this.classList.add('meja-selected');

                    if (selectedInfo) {
                        selectedInfo.innerHTML =
                            '✅ Kamu pilih: <strong>' + table.label + '</strong> (' + table.capacity + ' orang)' +
                            '<br><small style="color:var(--text-muted)">Sebutkan di form reservasi atau chat WA</small>';
                        selectedInfo.style.display = 'block';
                    }

                    // Set guest count based on capacity
                    const guestsInput = document.getElementById('resGuests');
                    if (guestsInput && !guestsInput.value) {
                        guestsInput.value = table.capacity;
                    }
                });
            }

            mejaGrid.appendChild(el);
        });
    }
})();

// ======================================================================
// ===== #11: QR CODE GENERATOR =====
// ======================================================================
(function() {
    const qrContainer = document.getElementById('qrContainer');
    if (!qrContainer) return;

    const qrImg = document.getElementById('qrCodeImg');
    const qrText = document.getElementById('qrMenuText');

    // Since we can't generate actual QR codes in pure JS without a library,
    // we'll provide a link to a QR generation service and show instructions
    if (qrImg) {
        qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
            encodeURIComponent(window.location.href + '#menu');
        qrImg.alt = 'QR Code Menu Sogogi';
    }

    if (qrText) {
        qrText.innerHTML =
            'Scan QR code ini untuk lihat menu langsung dari HP kamu!' +
            '<br><small style="color:var(--text-muted)">Atau bagikan link ini: <a href="' + window.location.href + '#menu" target="_blank" style="color:var(--primary);">sogogi-buaran.com/menu</a></small>';
    }

    // WhatsApp share button
    const shareBtn = document.getElementById('qrShareWa');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const msg = encodeURIComponent(
                '🥩 Yuk lihat menu Sogogi Buaran! Enak-enak semua 🍲🔥\n' +
                window.location.href + '#menu'
            );
            window.open('https://wa.me/?text=' + msg, '_blank');
        });
    }
})();

// ======================================================================
// ===== #7: SHAREABLE MENU + WHATSAPP SHARE =====
// ======================================================================
(function() {
    document.querySelectorAll('.share-menu-wa').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const itemName = this.dataset.item || 'Menu Sogogi Buaran';
            const msg = encodeURIComponent(
                '🥩 ' + itemName + ' di Sogogi Buaran!\n' +
                'Enak banget! Yuk cobain! 🍲🔥\n' +
                window.location.href + '#menu'
            );
            window.open('https://wa.me/?text=' + msg, '_blank');
        });
    });
})();

// ======================================================================
// ===== #17: LOYALTY CARD DIGITAL =====
// ======================================================================
(function() {
    const loyalty = document.getElementById('loyaltyCard');
    if (!loyalty) return;

    const stampsContainer = document.getElementById('loyaltyStamps');
    const progressEl = document.getElementById('loyaltyProgress');
    const countEl = document.getElementById('loyaltyCount');
    const claimBtn = document.getElementById('loyaltyClaim');

    const STORAGE_KEY = 'sogogi-loyalty';
    const MAX_STAMPS = 5;

    function getStamps() {
        try {
            return parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
        } catch(e) { return 0; }
    }

    function saveStamps(n) {
        try { localStorage.setItem(STORAGE_KEY, n); } catch(e) {}
    }

    function renderStamps() {
        const count = getStamps();
        if (stampsContainer) {
            stampsContainer.innerHTML = '';
            for (let i = 0; i < MAX_STAMPS; i++) {
                const stamp = document.createElement('div');
                stamp.className = 'loyalty-stamp' + (i < count ? ' filled' : '');
                stamp.textContent = i < count ? '🥩' : '○';
                stampsContainer.appendChild(stamp);
            }
        }
        if (countEl) countEl.textContent = count + '/' + MAX_STAMPS;
        if (progressEl) {
            progressEl.style.width = (count / MAX_STAMPS * 100) + '%';
        }
        if (claimBtn) {
            if (count >= MAX_STAMPS) {
                claimBtn.disabled = false;
                claimBtn.textContent = '🎉 Klaim Free 1 Pax!';
            } else {
                claimBtn.disabled = true;
                claimBtn.textContent = 'Butuh ' + (MAX_STAMPS - count) + ' lagi 🥩';
            }
        }
    }

    // Add stamp button
    const addStampBtn = document.getElementById('loyaltyAddStamp');
    if (addStampBtn) {
        addStampBtn.addEventListener('click', function() {
            let count = getStamps();
            if (count < MAX_STAMPS) {
                saveStamps(count + 1);
                renderStamps();
                // Simple animation
                this.style.transform = 'scale(0.95)';
                setTimeout(function() { addStampBtn.style.transform = ''; }, 200);
            }
        });
    }

    // Reset (admin use)
    const resetBtn = document.getElementById('loyaltyReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            saveStamps(0);
            renderStamps();
        });
    }

    // Claim
    if (claimBtn) {
        claimBtn.addEventListener('click', function() {
            if (getStamps() >= MAX_STAMPS) {
                const msg = encodeURIComponent(
                    'Halo Sogogi Buaran! Saya mau klaim FREE 1 PAX dari loyalty card digital! 🥳\n\n' +
                    'Stempel saya sudah penuh! 🥩🥩🥩🥩🥩'
                );
                window.open('https://wa.me/622129195053?text=' + msg, '_blank');
                saveStamps(0);
                renderStamps();
            }
        });
    }

    renderStamps();
})();

// ======================================================================
// ===== #20: DAPUR LANGSUNG CAM CORNER =====
// ======================================================================
(function() {
    const camCorner = document.getElementById('dapurCam');
    if (!camCorner) return;

    // Auto-rotate through "kitchen moments"
    const moments = [
        { emoji: '🥩', text: 'Chef lagi motong daging brisket tipis-tipis...' },
        { emoji: '🔥', text: 'Grill sedang dipanaskan, siap-siap! 🔥' },
        { emoji: '🍲', text: 'Kuah shabu mendidih — wangi kaldu menggoda!' },
        { emoji: '🥟', text: 'Gyoza lagi digoreng, crispy di luar juicy di dalam!' },
        { emoji: '🍦', text: 'Ice cream lagi disiapkan — creamy banget!' }
    ];

    const emojiEl = camCorner.querySelector('.cam-emoji');
    const textEl = camCorner.querySelector('.cam-text');
    let idx = 0;

    function rotateMoment() {
        idx = (idx + 1) % moments.length;
        const m = moments[idx];
        if (emojiEl) {
            emojiEl.style.opacity = '0';
            setTimeout(function() {
                emojiEl.textContent = m.emoji;
                emojiEl.style.opacity = '1';
            }, 300);
        }
        if (textEl) {
            textEl.style.opacity = '0';
            setTimeout(function() {
                textEl.textContent = '⚡ ' + m.text;
                textEl.style.opacity = '1';
            }, 300);
        }
    }

    setInterval(rotateMoment, 4000);
})();

// ======================================================================
// ===== #21: PANCI REKOMENDASI / KALORI HUMOR =====
// ======================================================================
(function() {
    const panciSection = document.getElementById('panciRekomendasi');
    if (!panciSection) return;

    const hitungBtn = document.getElementById('panciHitung');
    const resultEl = document.getElementById('panciResult');

    const rekomendasiFakta = [
        { icon: '🧠', title: 'Saran Ilmuwan Sogogi', text: '3 porsi Beef Brisket + 1 mangkuk kuah + Es Teh = kombinasi sempurna bagi tubuh dan jiwa 🤓' },
        { icon: '🔥', title: 'Kalori Tracker (Versi Sogogi)', text: 'Rata-rata pelanggan bakar 800-1200 kalori pas makan di sini. Tapi who cares, it\'s AYCE! 🥩' },
        { icon: '💪', title: 'Protein Boost', text: 'Daging sapi = protein tinggi. Kamu makan, otot kamu senang. Sains! 🧪' },
        { icon: '🧘', title: 'Keseimbangan Rasa', text: 'Asin (daging) + Pedas (sambal) + Manis (es krim) = lidah bahagia. Bukan sains, tapi fakta 😎' },
        { icon: '📊', title: 'Statistik AYCE', text: '90% pelanggan pesen daging porsi kedua. 10% sisanya... lagi ngunyah. 🤤' },
        { icon: '🎓', title: 'Tips dari Pro', text: 'Grill daging dulu baru shabu-shabu. Soalnya kalau kebalik, kuah jadi kotor. Trust me bro 👨‍🍳' }
    ];

    let currentFakta = 0;

    if (resultEl) {
        function showFakta(idx) {
            const f = rekomendasiFakta[idx];
            resultEl.innerHTML =
                '<div class="panci-card">' +
                '<div class="panci-icon">' + f.icon + '</div>' +
                '<h4>' + f.title + '</h4>' +
                '<p>' + f.text + '</p>' +
                '</div>';
            resultEl.style.display = 'block';
        }

        if (hitungBtn) {
            hitungBtn.addEventListener('click', function() {
                currentFakta = (currentFakta + 1) % rekomendasiFakta.length;
                showFakta(currentFakta);
            });
        }

        // Show first one initially
        showFakta(0);
    }
})();

// ======================================================================
// ===== #8: NEARBY LANDMARKS =====
// ======================================================================
(function() {
    const landmarksEl = document.getElementById('nearbyLandmarks');
    if (!landmarksEl) return;

    const landmarks = [
        { name: 'Stasiun Buaran', dist: '1,2 km', emoji: '🚉', desc: '5 menit naik motor/ojol' },
        { name: 'Kampus Universitas Kristen Indonesia (UKI)', dist: '2 km', emoji: '🎓', desc: '7 menit — favorit mahasiswa!' },
        { name: 'Pusat Grosir Cililitan (PGC)', dist: '1,5 km', emoji: '🛍️', desc: 'Belanja dulu, makan Sogogi, pulang kenyang' },
        { name: 'Mall Cipinang Indah', dist: '2,5 km', emoji: '🏬', desc: '10 menit, banyak tempat parkir' },
        { name: 'RS Harum', dist: '800 m', emoji: '🏥', desc: '2 menit — dekat banget!' }
    ];

    landmarksEl.innerHTML = landmarks.map(function(l) {
        return '<div class="landmark-item">' +
            '<span class="landmark-emoji">' + l.emoji + '</span>' +
            '<div class="landmark-info">' +
            '<strong>' + l.name + '</strong>' +
            '<span>' + l.dist + ' • ' + l.desc + '</span>' +
            '</div>' +
            '</div>';
    }).join('');
})();

// ======================================================================
// ===== #24: TABLE TURN PREDICTION =====
// ======================================================================
(function() {
    const predEl = document.getElementById('tablePrediction');
    if (!predEl) return;

    function updatePrediction() {
        const now = new Date();
        const hour = now.getHours();
        const min = now.getMinutes();
        const day = now.getDay();
        const isWeekend = day === 0 || day === 6;

        let waitTime, status, emoji;

        if (hour < 12) {
            // Before opening
            waitTime = 0;
            status = 'Kami buka jam 12.00 WIB! Reservasi aja dulu 😊';
            emoji = '🕐';
        } else if (hour >= 12 && hour < 14) {
            waitTime = isWeekend ? 15 : 5;
            status = 'Siang hari ' + (isWeekend ? 'ramai' : 'masih santai');
            emoji = isWeekend ? '🟡' : '🟢';
        } else if (hour >= 14 && hour < 17) {
            waitTime = 0;
            status = 'Sepi nih, langsung dapet meja!';
            emoji = '🟢';
        } else if (hour >= 17 && hour <= 20) {
            waitTime = isWeekend ? 30 : 15;
            status = 'Jam makan malam ' + (isWeekend ? '— lagi rame banget!' : '— lumayan ramai');
            emoji = isWeekend ? '🔴' : '🟡';
        } else if (hour > 20 && hour < 22) {
            waitTime = 5;
            status = 'Menjelang tutup, meja mulai longgar';
            emoji = '🟢';
        } else {
            waitTime = 0;
            status = 'Kami tutup jam 22.00. Besok balik lagi ya! 🌙';
            emoji = '🌙';
        }

        predEl.innerHTML =
            '<div class="pred-badge ' + (waitTime <= 5 ? 'pred-low' : waitTime <= 15 ? 'pred-mid' : 'pred-high') + '">' +
            emoji + ' Estimasi tunggu: <strong>' + (waitTime === 0 ? 'Langsung dapet!' : waitTime + ' menit') + '</strong>' +
            '</div>' +
            '<p style="font-size:0.8rem;color:var(--text-muted);margin-top:6px;">' + status + '</p>';
    }

    updatePrediction();
    setInterval(updatePrediction, 30000); // Update every 30 seconds
})();

// ======================================================================
// ===== #1: INSTAGRAM FEED WIDGET (Static Placeholder) =====
// ======================================================================
(function() {
    const igContainer = document.getElementById('igFeed');
    if (!igContainer) return;

    // Since Instagram API requires auth, we show a manual feed simulation
    igContainer.innerHTML =
        '<div class="ig-feed-grid">' +
        Array.from({ length: 6 }, function(_, i) {
            const foods = ['🥩', '🍲', '🥟', '🍦', '🔥', '🥬'];
            return '<div class="ig-feed-item">' +
                '<div class="ig-feed-img">' + foods[i] + '</div>' +
                '<div class="ig-feed-overlay">' +
                '<span>❤️ ' + Math.floor(Math.random() * 200 + 50) + '</span>' +
                '</div>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<p style="text-align:center;margin-top:16px;font-size:0.85rem;color:var(--text-muted);">' +
        '📸 Follow <a href="https://instagram.com/sogogishabu" target="_blank" style="color:var(--primary);font-weight:600;">@sogogishabu</a> di Instagram untuk foto real! ' +
        '<br><small>Tag us untuk ditampilkan di sini! 📱</small></p>';
})();

// ======================================================================
// ===== #5: GOOGLE REVIEWS WIDGET =====
// ======================================================================
(function() {
    const reviewContainer = document.getElementById('googleReviews');
    if (!reviewContainer) return;

    // Static representative reviews (since Google API requires key)
    const reviews = [
        { name: 'Rian', rating: 5, text: 'Tempat makan murah meriah, budget anak kampus pun cocok banget!', avatar: 'R' },
        { name: 'Lelly F.', rating: 5, text: 'Suasananya oke, jarak antar meja luas, tempatnya adem!', avatar: 'L' },
        { name: 'Dimas A.', rating: 5, text: 'Sogogi best AYCE di Jakarta Timur! Dagingnya fresh terus.', avatar: 'D' },
        { name: 'Sari N.', rating: 4, text: 'Enak, pelayanan ramah. Recommended buat kumpul keluarga!', avatar: 'S' }
    ];

    const stars = '★★★★★';

    reviewContainer.innerHTML =
        '<div class="review-header">' +
        '<span class="review-big-star">⭐ 5.0</span>' +
        '<span style="font-size:0.85rem;color:var(--text-muted);">Dari 15.000+ pelanggan Google</span>' +
        '</div>' +
        '<div class="review-grid">' +
        reviews.map(function(r) {
            return '<div class="review-card">' +
                '<div class="review-stars">' + stars.slice(0, r.rating) + '</div>' +
                '<p>"' + r.text + '"</p>' +
                '<div class="review-author">' +
                '<div class="review-avatar" style="background:linear-gradient(135deg,var(--primary),var(--primary-hover));">' + r.avatar + '</div>' +
                '<span>' + r.name + '</span>' +
                '</div>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<div style="text-align:center;margin-top:16px;">' +
        '<a href="https://g.co/kgs/your-review-link" target="_blank" class="btn btn-outline" style="display:inline-flex;padding:10px 20px;font-size:0.82rem;">📝 Tulis Review di Google</a>' +
        '</div>';
})();

})();

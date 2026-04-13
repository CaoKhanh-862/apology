/* ══════════════ SLIDES ══════════════ */
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const counter = document.getElementById('counter');
const overlay = document.getElementById('overlay');
let current = 0;
let transitioning = false;

/* paw burst on slide change */
function spawnPawBurst() {
    const COUNT = 8;
    for (let i = 0; i < COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'paw-burst';
        el.textContent = ['🐾', '🐱', '💗', '✨'][i % 4];
        const angle = (i / COUNT) * 360;
        el.style.setProperty('--r', angle + 'deg');
        el.style.left = (30 + Math.random() * 40) + 'vw';
        el.style.top = (30 + Math.random() * 40) + 'vh';
        el.style.fontSize = (.9 + Math.random() * .8) + 'rem';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
    }
}

/* confetti cats for slide 5 */
let confettiActive = false;
function spawnConfettiCats() {
    if (confettiActive) return;
    confettiActive = true;
    const CATS = ['🐱', '🐈', '🐾', '💗', '🌸', '✨'];
    for (let i = 0; i < 22; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-cat';
        el.textContent = CATS[i % CATS.length];
        el.style.left = (Math.random() * 100) + 'vw';
        el.style.fontSize = (.8 + Math.random() * 1.4) + 'rem';
        const dur = 2.2 + Math.random() * 2.4;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = (Math.random() * 1.2) + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), (dur + 1.5) * 1000);
    }
    setTimeout(() => { confettiActive = false; }, 5000);
}

function goTo(idx) {
    if (transitioning || idx === current) return;
    transitioning = true;

    spawnPawBurst();

    // flash overlay
    overlay.classList.add('flash');
    setTimeout(() => {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        counter.textContent = (current + 1) + ' / ' + slides.length;
        overlay.classList.remove('flash');
        overlay.classList.add('fade');

        // trigger letter typewriter on slide 3
        if (current === 2) triggerLetter();
        // confetti cats on slide 5
        if (current === 4) spawnConfettiCats();

        setTimeout(() => { overlay.classList.remove('fade'); transitioning = false; }, 420);
    }, 120);
}

document.getElementById('btnNext').addEventListener('click', () => goTo(current + 1));
document.getElementById('btnPrev').addEventListener('click', () => goTo(current - 1));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

// click anywhere on slide (except buttons/dots/music)
document.getElementById('slider').addEventListener('click', e => {
    if (e.target.closest('.nav-btn, #dots, .dot, #musicBtn, .slide-cat')) return;
    addSpark(e.clientX, e.clientY);
    goTo(current + 1);
});

/* ══════════════ MUSIC ══════════════ */
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let musicStarted = false;

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.volume = 0.45;
        bgMusic.play().catch(() => { });
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('playing');
    }
}

musicBtn.addEventListener('click', e => { e.stopPropagation(); toggleMusic(); });

// Auto-play on first user interaction with slide
const startAudio = () => {
    if (!musicStarted) {
        musicStarted = true;
        bgMusic.volume = 0.45;
        bgMusic.play().then(() => {
            musicBtn.textContent = '🔊';
            musicBtn.classList.add('playing');
        }).catch(() => { musicStarted = false; });
    }
};
document.getElementById('slider').addEventListener('click', startAudio, { once: true });
document.addEventListener('touchstart', startAudio, { once: true, passive: true });

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});

/* touch swipe */
let tx0 = 0;
document.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 50) { if (dx < 0) goTo(current + 1); else goTo(current - 1); }
});

/* ══════════════ TYPEWRITER LETTER ══════════════ */
const LETTER_TEXT = [
    "Anh xin lỗi vì lời nói lúc trước của anh thực sự quá vụng về,",
    " khiến em cảm thấy bị tổn thương và hiểu lầm về cách anh nhìn nhận em.",
    " Anh biết mình sai rồi.",
    "\n\nSự thật là anh luôn hiểu em không phải kiểu chỉ vì quà cáp mà đối xử tốt với anh.",
    " Anh trân trọng tính cách của em hơn ai hết —",
    " em giống như chú mèo nhỏ luôn sống tình cảm và chân thành.",
    "\n\nNên anh thực sự hối hận vì đã lỡ lời làm em buồn. 🐾💕"
].join("");

const letterBody = document.getElementById('letterBody');
const letterCursor = document.getElementById('letterCursor');
const letterSig = document.getElementById('letterSig');
let letterDone = false;

function triggerLetter() {
    if (letterDone) return;
    letterBody.textContent = '';
    letterSig.classList.remove('show');
    let i = 0;
    function type() {
        if (i < LETTER_TEXT.length) {
            letterBody.textContent += LETTER_TEXT[i++];
            setTimeout(type, 22);
        } else {
            letterCursor.style.display = 'none';
            letterSig.classList.add('show');
            letterDone = true;
        }
    }
    type();
}

/* ══════════════ FLOATING EMOJIS ══════════════ */
const EMOJIS = ['🌸', '💕', '✨', '🐾', '💗', '🌷', '⭐', '🎀', '🐱', '💖', '🩷'];
const floatLayer = document.getElementById('floatLayer');
for (let k = 0; k < 30; k++) {
    const el = document.createElement('div');
    el.className = 'floater';
    el.textContent = EMOJIS[k % EMOJIS.length];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay = (Math.random() * 12) + 's';
    el.style.fontSize = (.8 + Math.random() * 1.1) + 'rem';
    floatLayer.appendChild(el);
}

/* ══════════════ SPARKLE CANVAS ══════════════ */
const canvas = document.getElementById('sparkCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);

const sparks = [];
function addSpark(x, y) {
    const colors = ['#ff85a1', '#ffb3c6', '#c28ef5', '#fff', '#ffd6e0', '#ff4d6d'];
    for (let j = 0; j < 14; j++) {
        const a = Math.random() * Math.PI * 2;
        const s = 2 + Math.random() * 5;
        sparks.push({
            x, y,
            vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1,
            life: 1, decay: .018 + Math.random() * .012,
            color: colors[Math.floor(Math.random() * colors.length)],
            r: 3 + Math.random() * 4,
            shape: Math.random() > .5 ? 'circle' : 'star'
        });
    }
}

function drawStar(cx, cy, r) {
    ctx.beginPath();
    for (let n = 0; n < 5; n++) {
        const a1 = (-Math.PI / 2) + (n * 4 * Math.PI / 5);
        const a2 = a1 + 2 * Math.PI / 10;
        if (n === 0) ctx.moveTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1));
        else ctx.lineTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1));
        ctx.lineTo(cx + (r * .45) * Math.cos(a2), cy + (r * .45) * Math.sin(a2));
    }
    ctx.closePath();
    ctx.fill();
}

function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += .14;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        if (s.shape === 'circle') {
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2); ctx.fill();
        } else {
            drawStar(s.x, s.y, s.r * s.life * 1.5);
        }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(anim);
}
anim();

document.addEventListener('touchstart', e => {
    [...e.touches].forEach(t => addSpark(t.clientX, t.clientY));
}, { passive: true });

/* ══════════════ P-CARD CLICK EFFECTS ══════════════ */
const CARD_EMOJIS = ['🐾', '🐱', '💗', '💕', '🌸', '✨', '🐈'];
document.querySelectorAll('.p-card').forEach(card => {
    card.addEventListener('click', e => {
        e.stopPropagation();

        // ripple inside card
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'card-ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        // emoji burst around click point
        const cx = e.clientX, cy = e.clientY;
        for (let i = 0; i < 6; i++) {
            const pop = document.createElement('div');
            pop.className = 'card-pop';
            pop.textContent = CARD_EMOJIS[Math.floor(Math.random() * CARD_EMOJIS.length)];
            const angle = (i / 6) * Math.PI * 2;
            const dist = 50 + Math.random() * 40;
            pop.style.left = cx + 'px';
            pop.style.top = cy + 'px';
            pop.style.setProperty('--tx', Math.round(Math.cos(angle) * dist) + 'px');
            pop.style.setProperty('--ty', Math.round(Math.sin(angle) * dist - 20) + 'px');
            pop.style.animationDelay = (i * 0.04) + 's';
            document.body.appendChild(pop);
            setTimeout(() => pop.remove(), 850);
        }

        // also add canvas sparks
        addSpark(cx, cy);
    });
});

/* ══════════════ SECRET CAT CAM FEATURE ══════════════
   Activation: click/tap the hidden trigger area 5 times quickly
   The trigger overlays the cat walk area at bottom-left
══════════════════════════════════════════════════════ */
(function () {
    // ── Config ──────────────────────────────────────────
    const GEMINI_MODEL = 'gemini-2.5-flash-image';
    const SECRET_CLICKS = 5;    // number of clicks to unlock
    const CLICK_WINDOW = 3000; // ms window for clicks

    // ── State ───────────────────────────────────────────
    let clickCount = 0;
    let clickTimer = null;
    let stream = null;
    let apiKey = localStorage.getItem('__catcam_key') || 'AIzaSyBtxMCEWHByFa2-Y3tohWG5JDFeqfUem_4';
    let activeFilter = 'smooth'; // default filter

    // Beauty filter definitions (CSS filter string + pixel processing flag)
    const BEAUTY_FILTERS = {
        none: { css: 'none', pixel: null },
        smooth: { css: 'brightness(1.04) contrast(0.92) saturate(1.05)', pixel: 'smooth' },
        darkcircle: { css: 'brightness(1.12) contrast(0.88) saturate(1.08)', pixel: 'brighten' },
        acne: { css: 'brightness(1.05) contrast(0.9)  saturate(0.9)', pixel: 'acne' },
        glow: { css: 'brightness(1.1)  contrast(0.95) saturate(1.2)  sepia(0.05)', pixel: 'smooth' },
        all: { css: 'brightness(1.1)  contrast(0.88) saturate(1.1)  sepia(0.04)', pixel: 'all' }
    };

    // ── DOM refs ────────────────────────────────────────
    const modal = document.getElementById('catCamModal');
    const video = document.getElementById('camPreview');
    const canvas = document.getElementById('camCanvas');
    const snapBtn = document.getElementById('snapBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultDiv = document.getElementById('catCamResult');
    const loadingDiv = document.getElementById('catCamLoading');
    const resultImg = document.getElementById('resultImg');
    const apiSection = document.getElementById('apiKeySection');
    const apiInput = document.getElementById('apiKeyInput');
    const saveKeyBtn = document.getElementById('saveApiKeyBtn');
    const toast = document.getElementById('secretToast');
    const trigger = document.getElementById('secretTrigger');

    // ── Secret trigger logic ────────────────────────────
    function handleSecretClick() {
        clickCount++;

        if (clickCount === 1) {
            // Start countdown window
            clickTimer = setTimeout(() => { clickCount = 0; }, CLICK_WINDOW);
        }

        if (clickCount >= SECRET_CLICKS) {
            clearTimeout(clickTimer);
            clickCount = 0;
            showToast();
            setTimeout(openCatCam, 400);
        }
    }

    trigger.addEventListener('click', handleSecretClick);
    trigger.addEventListener('touchstart', handleSecretClick, { passive: true });

    // ── Double-click / double-tap on each slide cat to activate ──
    document.querySelectorAll('.slide-cat').forEach(cat => {
        // desktop: dblclick
        cat.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            showToast();
            setTimeout(openCatCam, 400);
        });
        // mobile: detect double-tap within 350ms
        let _lastTap = 0;
        cat.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - _lastTap < 350) {
                e.preventDefault();
                e.stopPropagation();
                showToast();
                setTimeout(openCatCam, 400);
            }
            _lastTap = now;
        });
    });

    // Also: triple-tap the music button as an alternative unlock
    let musicTapCount = 0, musicTapTimer = null;
    document.getElementById('musicBtn').addEventListener('dblclick', (e) => {
        e.stopPropagation();
        musicTapCount++;
        if (!musicTapTimer) musicTapTimer = setTimeout(() => { musicTapCount = 0; musicTapTimer = null; }, 2000);
        if (musicTapCount >= 3) {
            clearTimeout(musicTapTimer);
            musicTapCount = 0; musicTapTimer = null;
            showToast();
            setTimeout(openCatCam, 400);
        }
    });

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
    }

    // ── Open modal ──────────────────────────────────────
    function openCatCam() {
        resetState();
        modal.classList.add('open');
        if (!apiKey) {
            apiSection.style.display = 'block';
            snapBtn.style.display = 'none';
        } else {
            apiSection.style.display = 'none';
            snapBtn.style.display = '';
            startCamera();
        }
    }

    // ── Close modal ─────────────────────────────────────
    function closeCatCam() {
        modal.classList.remove('open');
        stopCamera();
        resetState();
    }

    document.getElementById('camCloseBtn').addEventListener('click', closeCatCam);
    document.getElementById('camCloseBtn2').addEventListener('click', closeCatCam);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCatCam(); });

    // ── API key save ────────────────────────────────────
    saveKeyBtn.addEventListener('click', () => {
        const val = apiInput.value.trim();
        if (!val) return;
        apiKey = val;
        localStorage.setItem('__catcam_key', val);
        apiSection.style.display = 'none';
        snapBtn.style.display = '';
        startCamera();
    });

    // ── Camera ──────────────────────────────────────────
    const uploadPreview = document.getElementById('uploadPreview');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const noCamNotice = document.getElementById('noCamNotice');
    let uploadedBase64 = null;

    async function startCamera() {
        // Check if mediaDevices API is available (requires HTTPS or localhost)
        const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        if (!hasMediaDevices) {
            switchToUploadMode();
            return;
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false
            });
            video.srcObject = stream;
            video.style.display = 'block';
            // Auto-apply default beauty filter to live video
            const defaultFilter = BEAUTY_FILTERS[activeFilter] || BEAUTY_FILTERS.none;
            video.style.filter = defaultFilter.css;
        } catch (err) {
            // Camera denied or unavailable — fall back to upload mode
            console.warn('Camera error, switching to upload mode:', err.message);
            switchToUploadMode();
        }
    }

    function switchToUploadMode() {
        video.style.display = 'none';
        uploadPreview.style.display = 'none';
        noCamNotice.style.display = 'block';
        snapBtn.style.display = 'none';
        uploadBtn.style.display = '';
    }

    // File input → preview
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            // Show preview
            uploadPreview.src = e.target.result;
            uploadPreview.style.display = 'block';
            noCamNotice.style.display = 'none';
            // Convert to base64 JPEG for API
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = img.width; c.height = img.height;
                c.getContext('2d').drawImage(img, 0, 0);
                uploadedBase64 = c.toDataURL('image/jpeg', 0.85).split(',')[1];
                // Show snap button (now acts as "convert" button)
                snapBtn.textContent = '✨ Biến thành mèo chibi!';
                snapBtn.style.display = '';
                uploadBtn.textContent = '🔄 Đổi ảnh';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        video.srcObject = null;
    }

    function resetState() {
        resultDiv.classList.remove('show');
        loadingDiv.classList.remove('show');
        snapBtn.textContent = '📸 Chụp ngay!';
        snapBtn.style.display = '';
        video.style.display = 'block';
        uploadPreview.style.display = 'none';
        noCamNotice.style.display = 'none';
        uploadBtn.style.display = 'none';
        resultImg.src = '';
        uploadedBase64 = null;
    }

    // ── Beauty Filter chip listeners ────────────────────
    document.querySelectorAll('.beauty-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.beauty-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            // Apply CSS filter to live video preview in real-time
            const filterDef = BEAUTY_FILTERS[activeFilter] || BEAUTY_FILTERS.none;
            video.style.filter = filterDef.css;
            const uploadPrev = document.getElementById('uploadPreview');
            if (uploadPrev) uploadPrev.style.filter = filterDef.css;
        });
    });

    // ── Pixel-level beauty processing on canvas ─────────
    function applyPixelBeauty(ctx, w, h, mode) {
        if (!mode) return;
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];

            if (mode === 'smooth' || mode === 'all') {
                // Skin softening: slightly blend toward mean (reduces texture)
                const avg = (r + g + b) / 3;
                d[i] = r * 0.85 + avg * 0.15;
                d[i + 1] = g * 0.85 + avg * 0.15;
                d[i + 2] = b * 0.85 + avg * 0.15;
            }

            if (mode === 'acne' || mode === 'all') {
                // Reduce red blotches: if pixel is very red vs green/blue, pull it down
                const redness = r - (g + b) / 2;
                if (redness > 30) {
                    d[i] = Math.max(0, r - redness * 0.4);
                    d[i + 1] = Math.min(255, g + redness * 0.1);
                    d[i + 2] = Math.min(255, b + redness * 0.1);
                }
            }

            if (mode === 'brighten' || mode === 'all') {
                // Brighten darker areas (under-eye): lift shadows gently
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum < 100) {
                    const lift = (100 - lum) * 0.25;
                    d[i] = Math.min(255, d[i] + lift);
                    d[i + 1] = Math.min(255, d[i + 1] + lift);
                    d[i + 2] = Math.min(255, d[i + 2] + lift);
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // ── Capture & send to AI ────────────────────────
    snapBtn.addEventListener('click', async () => {
        let base64Image = null;

        if (stream) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.filter = BEAUTY_FILTERS[activeFilter]?.css || 'none';
            ctx.drawImage(video, 0, 0);
            ctx.filter = 'none';
            // Apply pixel-level beauty on top
            applyPixelBeauty(ctx, canvas.width, canvas.height, BEAUTY_FILTERS[activeFilter]?.pixel);
            base64Image = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        } else if (uploadedBase64) {
            base64Image = uploadedBase64;
        } else {
            return;
        }

        video.style.display = 'none';
        snapBtn.style.display = 'none';
        loadingDiv.classList.add('show');
        stopCamera();

        try {
            // callAIImageGen trả về base64 data URL sau khi AI xử lý xong
            const dataUrl = await callAIImageGen(base64Image);

            loadingDiv.classList.remove('show');
            resultImg.src = dataUrl;
            resultDiv.classList.add('show');
            for (let i = 0; i < 5; i++) {
                setTimeout(() => addSpark(
                    100 + Math.random() * (window.innerWidth - 200),
                    100 + Math.random() * (window.innerHeight - 200)
                ), i * 150);
            }
        } catch (err) {
            loadingDiv.classList.remove('show');
            alert('Lỗi API: ' + err.message);
            resetState();
            startCamera();
        }
    });

    retakeBtn.addEventListener('click', () => {
        resetState();
        startCamera();
    });

    downloadBtn.addEventListener('click', async () => {
        const src = resultImg.src;
        if (!src) return;

        try {
            // Lấy ảnh về dưới dạng Blob để tải xuống thật sự (kể cả trên iPhone)
            const res = await fetch(src);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'cat-chibi-' + Date.now() + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        } catch {
            // Fallback: mở ảnh trong tab mới (iOS Safari không hỗ trợ download attr)
            window.open(src, '_blank');
        }
    });

    // ── Nén ảnh xuống tối đa 640px trước khi gửi ─────────────────
    function compressImage(base64Jpeg, maxSize = 640) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const c = document.createElement('canvas');
                c.width = Math.round(img.width * scale);
                c.height = Math.round(img.height * scale);
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                resolve(c.toDataURL('image/jpeg', 0.85).split(',')[1]);
            };
            img.src = 'data:image/jpeg;base64,' + base64Jpeg;
        });
    }

    // ── HF Token: set via backend proxy (main.py reads HF_TOKEN env var) ──
    // Do NOT hardcode tokens in client-side JS. Use the /api/generate proxy instead.
    const HF_TOKEN = '';

    const CHIBI_PROMPT = [
        'kawaii chibi anime character, fluffy cat ears on head,',
        'oversized round head, big glossy sparkly eyes, rosy blushing cheeks,',
        'tiny nose, stubby little hands, cozy pastel hoodie,',
        'soft pastel color palette, clean black outlines, anime cell-shading,',
        'simple white background, high quality sticker style, no text, no watermark'
    ].join(' ');

    const NEGATIVE_PROMPT = 'realistic, photo, 3d, ugly, deformed, watermark, text, nsfw, blurry';

    // ── AI Image Gen: HF instruct-pix2pix (img2img giữ khuôn mặt gốc) + FLUX fallback ──
    async function callAIImageGen(base64Jpeg) {
        // ── Thử img2img: instruct-pix2pix (biến ảnh thật thành chibi mèo) ──
        try {
            const res = await fetch(
                'https://router.huggingface.co/hf-inference/models/timbrooks/instruct-pix2pix',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HF_TOKEN}`,
                        'Content-Type': 'application/json',
                        'X-Use-Cache': '0',
                    },
                    body: JSON.stringify({
                        inputs: base64Jpeg,
                        parameters: {
                            prompt: `${CHIBI_PROMPT}, transform this person`,
                            negative_prompt: NEGATIVE_PROMPT,
                            guidance_scale: 8.0,
                            image_guidance_scale: 1.3,
                            num_inference_steps: 25,
                        }
                    })
                }
            );

            if (res.ok) {
                const blob = await res.blob();
                return await blobToDataUrl(blob);
            }

            const errText = await res.text();
            // Nếu model đang load (503) hoặc không có (404), fallback sang FLUX
            if (res.status !== 503 && res.status !== 404) {
                throw new Error(`img2img ${res.status}: ${errText.slice(0, 100)}`);
            }
            console.log('[CatCam] instruct-pix2pix unavailable, falling back to FLUX...');
        } catch (e) {
            if (!e.message?.includes('img2img')) throw e; // nếu lỗi không phải 503/404, ném lại
            console.log('[CatCam] img2img error, fallback:', e.message);
        }

        // ── Fallback: FLUX.1-schnell text2img (luôn hoạt động) ──
        const fluxRes = await fetch(
            'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                    'X-Use-Cache': '0',
                },
                body: JSON.stringify({
                    inputs: CHIBI_PROMPT,
                    parameters: { guidance_scale: 3.5, num_inference_steps: 4, width: 512, height: 512 }
                })
            }
        );

        if (!fluxRes.ok) {
            const errText = await fluxRes.text();
            throw new Error(`FLUX ${fluxRes.status}: ${errText.slice(0, 100)}`);
        }

        const blob = await fluxRes.blob();
        return await blobToDataUrl(blob);
    }

    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Lỗi đọc ảnh'));
            reader.readAsDataURL(blob);
        });
    }

})(); // end of IIFE

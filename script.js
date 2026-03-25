const PASSWORD = "love. wave to earth"; // 👈 CHANGE THIS TO YOUR PASSWORD
const SECRET_MODAL = document.getElementById('passwordModal');
const SECRET_MESSAGE = document.getElementById('secretMessage');
const PASSWORD_INPUT = document.getElementById('passwordInput');
const TOGGLE_PASSWORD = document.getElementById('togglePassword');
const MUSIC_HINT = document.getElementById('audioHint');
const MUSIC = document.getElementById('birthdayMusic');

// Music Player Elements
const MUSIC_PLAYER = document.getElementById('musicPlayer');
const PLAY_BTN = document.getElementById('playBtn');
const PREV_BTN = document.getElementById('prevBtn');
const NEXT_BTN = document.getElementById('nextBtn');
const PROGRESS_BAR = document.getElementById('progressBar');
const PROGRESS_FILL = document.getElementById('progressFill');
const CURRENT_TIME = document.getElementById('currentTime');
const DURATION = document.getElementById('duration');
const VOLUME_SLIDER = document.getElementById('volumeSlider');
const VOLUME_ICON = document.getElementById('volumeIcon');
const SONG_NAME = document.getElementById('songName');
const SONG_ARTIST = document.getElementById('songArtist');

let musicPlaying = false;
let playerMinimized = false;

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');

    if (progressFill && currentTime && duration && MUSIC && MUSIC.duration) {
        const percentage = (MUSIC.currentTime / MUSIC.duration) * 100;
        progressFill.style.width = percentage + '%';
        currentTime.textContent = formatTime(MUSIC.currentTime);
        duration.textContent = formatTime(MUSIC.duration);
    }
}

// Reattach all player event listeners
function reattachPlayerListeners() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    const duration = document.getElementById('duration');

    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (!MUSIC || !MUSIC.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            MUSIC.currentTime = percent * MUSIC.duration;
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            MUSIC.volume = volume;

            if (volume === 0) {
                volumeIcon.textContent = '🔇';
            } else if (volume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (musicPlaying) {
                MUSIC.pause();
                musicPlaying = false;
                playBtn.textContent = '▶️';
            } else {
                MUSIC.play().then(() => {
                    musicPlaying = true;
                    playBtn.textContent = '⏸️';
                }).catch(() => {
                    alert('Please allow audio in your browser settings 🎵');
                });
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            MUSIC.currentTime = 0;
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (MUSIC.duration) {
                MUSIC.currentTime = MUSIC.duration - 1;
            }
        });
    }

    if (duration) {
        const updateDuration = () => {
            duration.textContent = formatTime(MUSIC.duration);
        };
        MUSIC.removeEventListener('loadedmetadata', updateDuration);
        MUSIC.addEventListener('loadedmetadata', updateDuration);
    }
}

// Toggle player minimized state
window.toggleMusicPlayer = function() {
    playerMinimized = !playerMinimized;
    if (playerMinimized) {
        MUSIC_PLAYER.classList.add('minimized');
        MUSIC_PLAYER.innerHTML = '<button onclick="window.toggleMusicPlayer()" style="background: linear-gradient(135deg, #1DB954, #1ed760); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.transform=\'scale(1.1)\'; this.style.boxShadow=\'0 6px 20px rgba(29, 185, 84, 0.35)\'" onmouseout="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'none\'">🎵</button>';
    } else {
        // Restore full player without reloading
        playerMinimized = false;
        MUSIC_PLAYER.classList.remove('minimized');
        MUSIC_PLAYER.innerHTML = '';
        MUSIC_PLAYER.innerHTML = `
            <div class="player-header">
                <span class="player-title">Now Playing</span>
                <button class="player-close" onclick="toggleMusicPlayer()" title="Minimize player">✕</button>
            </div>
            <div class="player-info">
                <div class="song-name" id="songName">🎵 Birthday Song</div>
                <div class="song-artist" id="songArtist">wave to earth - love.</div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" id="progressBar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="time-info">
                    <span id="currentTime">0:00</span>
                    <span id="duration">0:00</span>
                </div>
            </div>
            <div class="player-controls">
                <button class="control-btn" id="prevBtn" title="Previous">⏮️</button>
                <button class="control-btn play-btn" id="playBtn" title="Play/Pause">▶️</button>
                <button class="control-btn" id="nextBtn" title="Next">⏭️</button>
            </div>
            <div class="volume-container">
                <span class="volume-icon" id="volumeIcon">🔊</span>
                <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="30" title="Volume" />
            </div>
        `;
        // Re-attach event listeners
        reattachPlayerListeners();
    }
};

// 🎵 Music Autoplay with User Interaction Fallback
function initMusic() {
    if (!MUSIC) return;

    MUSIC.volume = 0.3; // Lower volume for background
    MUSIC.preload = 'auto';
    MUSIC.muted = true;

    // Ensure source is loaded
    MUSIC.load();

    // Try autoplay immediately (muted) in modern browsers
    const playPromise = MUSIC.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay worked in muted mode
            musicPlaying = true;
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.textContent = '⏸️';
            MUSIC_HINT.style.display = 'none';
        }).catch(() => {
            // Autoplay blocked, show user hint
            musicPlaying = false;
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.textContent = '▶️';
            MUSIC_HINT.style.display = 'block';
        });
    }

    // If the user interacts, unmute and play (needed in strict autoplay policies)
    const unlockAudio = () => {
        enableAudio();
        MUSIC_HINT.style.display = 'none';
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
}

MUSIC.addEventListener('error', () => {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.textContent = '❌';
        playBtn.title = 'Audio file not found';
    }
    alert('Music did not load. Please check if the mp3 file is available in the same folder.');
});

// Enable unmuted audio after start and user interaction (browser policies)
function enableAudio() {
    if (MUSIC) {
        MUSIC.muted = false;
        MUSIC.volume = 0.3;
        const playPromise = MUSIC.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                const playBtn = document.getElementById('playBtn');
                if (playBtn) playBtn.textContent = '⏸️';
                MUSIC_HINT.style.display = 'none';
            }).catch(() => {
                // handle play refusal silently; users can use control button
            });
        }
    }
}

// Secret message modal handling
function openPasswordModal() {
    SECRET_MODAL.style.display = 'flex';
    SECRET_MODAL.setAttribute('aria-hidden', 'false');
    PASSWORD_INPUT.value = '';
    PASSWORD_INPUT.focus();
}

function closeModal() {
    SECRET_MODAL.style.display = 'none';
    SECRET_MODAL.setAttribute('aria-hidden', 'true');
    PASSWORD_INPUT.value = '';
    PASSWORD_INPUT.style.borderColor = '#d8b4fe';
    PASSWORD_INPUT.style.boxShadow = 'none';
}

function checkPassword() {
    const input = PASSWORD_INPUT.value.trim().toLowerCase();
    if (input === PASSWORD.toLowerCase()) {
        SECRET_MODAL.style.display = 'none';
        SECRET_MODAL.setAttribute('aria-hidden', 'true');
        SECRET_MESSAGE.style.display = 'block';
        PASSWORD_INPUT.value = '';
    } else {
        PASSWORD_INPUT.style.borderColor = '#ef4444';
        PASSWORD_INPUT.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)';
        PASSWORD_INPUT.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            PASSWORD_INPUT.style.borderColor = '#d8b4fe';
            PASSWORD_INPUT.style.boxShadow = 'none';
            PASSWORD_INPUT.style.animation = '';
        }, 500);
    }
}

PASSWORD_INPUT.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

window.addEventListener('click', function (event) {
    if (event.target === SECRET_MODAL) {
        closeModal();
    }
});

function closeSecret() {
    SECRET_MESSAGE.style.display = 'none';
}

// Toggle password visibility
TOGGLE_PASSWORD.addEventListener('click', function () {
    if (PASSWORD_INPUT.type === 'password') {
        PASSWORD_INPUT.type = 'text';
        TOGGLE_PASSWORD.textContent = 'Hide';
    } else {
        PASSWORD_INPUT.type = 'password';
        TOGGLE_PASSWORD.textContent = 'Show';
    }
    PASSWORD_INPUT.focus();
});

// Initialize music interaction
initMusic();
reattachPlayerListeners();
MUSIC.addEventListener('timeupdate', updateProgress);

window.addEventListener('click', enableAudio, { once: true });
window.addEventListener('touchstart', enableAudio, { once: true });
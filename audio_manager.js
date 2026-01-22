export class AudioManager {
    constructor(audioUrl) {
        this.audio = new Audio(audioUrl);
        this.audio.loop = true;
        this.isPlaying = false;
        this.btn = document.getElementById('audio-toggle');
        this.icon = this.btn.querySelector('i');
        
        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        if (this.isPlaying) {
            this.audio.pause();
            this.icon.setAttribute('data-lucide', 'volume-x');
        } else {
            this.audio.play().catch(e => console.log("User interaction required"));
            this.icon.setAttribute('data-lucide', 'volume-2');
        }
        this.isPlaying = !this.isPlaying;
        lucide.createIcons();
    }
}

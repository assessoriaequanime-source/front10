export class AudioManager {
    constructor(assets) {
        this.ambient = new Audio(assets.ambient);
        this.ambient.loop = true;
        this.isPlaying = false;
        
        this.sfx = {
            click: assets.hud_click,
            hover: assets.hud_hover
        };
        
        this.btn = document.getElementById('audio-toggle');
        this.icon = this.btn?.querySelector('i');
        
        this.init();
    }

    init() {
        if (this.btn) {
            this.btn.addEventListener('click', () => this.toggle());
        }
    }

    playSfx(type) {
        if (!this.isPlaying) return;
        const sound = new Audio(this.sfx[type]);
        sound.volume = 0.2;
        sound.play().catch(() => {});
    }

    toggle() {
        if (this.isPlaying) {
            this.ambient.pause();
            if (this.icon) this.icon.setAttribute('data-lucide', 'volume-x');
        } else {
            this.ambient.play().catch(e => console.log("User interaction required"));
            if (this.icon) this.icon.setAttribute('data-lucide', 'volume-2');
        }
        this.isPlaying = !this.isPlaying;
        if (window.lucide) lucide.createIcons();
    }
}

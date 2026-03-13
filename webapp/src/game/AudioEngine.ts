export class AudioEngine {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static musicGain: GainNode | null = null;
  private static isMuted = false;
  private static volume = 0.5;
  private static musicPlaying = false;
  private static musicOscillators: OscillatorNode[] = [];
  private static musicEnabled = true;

  // Load persisted preferences
  static {
    try {
      const saved = localStorage.getItem("fbwg_audio");
      if (saved) {
        const prefs = JSON.parse(saved);
        AudioEngine.isMuted = prefs.muted ?? false;
        AudioEngine.volume = prefs.volume ?? 0.5;
        AudioEngine.musicEnabled = prefs.musicEnabled ?? true;
      }
    } catch {
      // Ignore parse errors
    }
  }

  private static savePrefs() {
    try {
      localStorage.setItem(
        "fbwg_audio",
        JSON.stringify({
          muted: this.isMuted,
          volume: this.volume,
          musicEnabled: this.musicEnabled,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  public static toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    if (this.musicGain) {
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume * 0.15;
    }
    this.savePrefs();
  }

  public static getMuted() {
    return this.isMuted;
  }

  public static setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    if (this.musicGain) {
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume * 0.15;
    }
    this.savePrefs();
  }

  public static getVolume() {
    return this.volume;
  }

  public static getMusicEnabled() {
    return this.musicEnabled;
  }

  public static setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    this.savePrefs();
  }

  // Must be called on first user interaction (e.g. clicking a button)
  public static init() {
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume * 0.15;
      this.musicGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    // Auto-start music if enabled
    if (this.musicEnabled && !this.musicPlaying) {
      this.startMusic();
    }
  }

  // === Background Music (Ambient Drone) ===
  public static startMusic() {
    if (!this.ctx || !this.musicGain || this.musicPlaying) return;

    this.musicPlaying = true;

    // Create two detuned sine oscillators for a warm, ambient pad
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.value = 110; // A2
    osc2.type = "sine";
    osc2.frequency.value = 165; // E3 (a fifth above)

    // LFO modulates pitch slightly for a dreamy wobble
    lfo.type = "sine";
    lfo.frequency.value = 0.3; // Very slow wobble
    lfoGain.gain.value = 3; // Subtle pitch variation

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    osc1.connect(this.musicGain);
    osc2.connect(this.musicGain);

    osc1.start();
    osc2.start();
    lfo.start();

    this.musicOscillators = [osc1, osc2, lfo];
  }

  public static stopMusic() {
    this.musicPlaying = false;
    for (const osc of this.musicOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    }
    this.musicOscillators = [];
  }

  // === SFX ===

  public static playJump() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public static playLand() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public static playWin() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.setValueAtTime(600, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.setTargetAtTime(0, this.ctx.currentTime + 0.3, 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  public static playLose() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}


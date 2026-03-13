export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string = "rgba(255, 255, 255, 0.5)", size: number = 4) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2; // Random X spread
    this.vy = (Math.random() - 1) * 2; // Bias upwards
    this.life = 1.0;
    this.maxLife = Math.random() * 0.5 + 0.5; // Random lifetime between 0.5 and 1.0 seconds
    this.color = color;
    this.size = size;
  }

  update(dt: number) {
    this.x += this.vx * (dt * 60); // scale by frame rate roughly
    this.y += this.vy * (dt * 60);
    this.life -= dt;
  }
}

export class ParticleEngine {
  private particles: Particle[] = [];

  public spawnDust(x: number, y: number, width: number, amount: number = 8) {
    for (let i = 0; i < amount; i++) {
      // Spawn evenly along the bottom width of the character
      const px = x + Math.random() * width;
      this.particles.push(new Particle(px, y + 10)); // +10 offset to be near feet
    }
  }

  public update(dt: number) {
    this.particles.forEach((p) => p.update(dt));
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0; // Reset
  }
}

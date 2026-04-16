'use client';

import { useEffect, useRef } from 'react';
import './BackgroundAnimation.css';

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let mouse = { x: -500, y: -500, radius: 200 };
    let nodes = [];
    let pulses = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const handleMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -500;
      mouse.y = -500;
    };

    // Click creates a pulse wave
    const handleClick = (e) => {
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 300,
        opacity: 0.6,
      });
    };

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 0.8;
        this.color = Math.random() > 0.6
          ? [124, 58, 237]   // purple
          : Math.random() > 0.5
            ? [59, 130, 246]  // blue
            : [34, 197, 94];  // green (healthcare)
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.01;
        this.isHealthNode = Math.random() > 0.85; // Special healthcare nodes
      }

      update() {
        this.pulse += this.pulseSpeed;

        // Mouse repulsion/attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Nodes orbit around cursor instead of just repelling
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
          this.x += Math.cos(angle + Math.PI / 2) * force * 1.5;
          this.y += Math.sin(angle + Math.PI / 2) * force * 1.5;
        } else {
          // Drift back toward base + natural movement
          this.x += this.vx + (this.baseX - this.x) * 0.003;
          this.y += this.vy + (this.baseY - this.y) * 0.003;
        }

        // Wrap
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
      }

      draw() {
        const brightness = Math.sin(this.pulse) * 0.3 + 0.5;
        const [r, g, b] = this.color;

        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * 0.08})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
        ctx.fill();

        // Healthcare cross on special nodes
        if (this.isHealthNode && this.size > 1.5) {
          const s = this.size * 2;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${brightness * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(this.x - s, this.y);
          ctx.lineTo(this.x + s, this.y);
          ctx.moveTo(this.x, this.y - s);
          ctx.lineTo(this.x, this.y + s);
          ctx.stroke();
        }
      }
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    }

    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.15;
            const [r, g, b] = nodes[i].color;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Mouse glow cursor
    function drawMouseGlow() {
      if (mouse.x < 0) return;
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 180
      );
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
      gradient.addColorStop(0.4, 'rgba(59, 130, 246, 0.06)');
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Click pulse waves
    function drawPulses() {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 4;
        p.opacity *= 0.97;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 58, 237, ${p.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (p.radius > p.maxRadius || p.opacity < 0.01) {
          pulses.splice(i, 1);
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMouseGlow();
      drawPulses();
      nodes.forEach((n) => { n.update(); n.draw(); });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="bg-animation">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="bg-gradient-orb bg-orb-1"></div>
      <div className="bg-gradient-orb bg-orb-2"></div>
    </div>
  );
}

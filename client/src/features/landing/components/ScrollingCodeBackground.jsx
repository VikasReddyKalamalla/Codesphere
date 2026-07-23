import React, { useEffect, useRef } from 'react';

export const ScrollingCodeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    
    // Poll resize slightly to adjust to dynamic page content loading
    const interval = setInterval(resizeCanvas, 1000);
    window.addEventListener('resize', resizeCanvas);

    const codeLines = [
      'import { useState, useEffect } from "react";',
      'const mongoose = require("mongoose");',
      'const bcrypt = require("bcryptjs");',
      'const User = require("../models/User");',
      'const protect = async (req, res, next) => { ... }',
      'const schema = new mongoose.Schema({ email, password });',
      'schema.pre("save", function() { this.slug = slugify(this.title); });',
      'const compileSystem = async (lang) => { return runSandbox(lang); };',
      'router.post("/sandbox/:id/start", protect, startProject);',
      'socket.on("code-change", (delta) => { broadcast(delta); });',
      'const quicksort = (arr) => { if (arr.length <= 1) return arr; ... }',
      'npm install @codesphere/sandbox-compiler',
      'git commit -m "feat: complete student playpen progress sync"',
      'docker run -d -p 3000:3000 --name codesphere-sandbox sandbox-env',
      'const room = new MultiplayerRoom("room_ws_68");',
      'await room.syncFiles("instructor_main");',
      'const result = await sandbox.run({ lang: "python" });',
      'class DeveloperJourney extends Student { constructor() { super(); } }',
      'const vikas = await User.findOne({ email: "instructor@gmail.com" });',
      'git push origin main --force',
      'app.use(cors({ origin: true, credentials: true }));',
      'const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);',
      'const client = new WebSocket("ws://localhost:5000");'
    ];

    const lines = [];
    const maxLines = 60;
    
    for (let i = 0; i < maxLines; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: codeLines[Math.floor(Math.random() * codeLines.length)],
        speed: 0.35 + Math.random() * 0.45,
        fontSize: 14 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.15
      });
    }

    let animationFrameId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      lines.forEach((line) => {
        ctx.font = `${line.fontSize}px monospace`;
        ctx.fillStyle = `rgba(4, 170, 109, ${line.opacity})`;
        ctx.fillText(line.text, line.x, line.y);
        
        line.y -= line.speed;
        
        if (line.y < -20) {
          line.y = canvas.height + 20;
          line.x = Math.random() * canvas.width;
          line.text = codeLines[Math.floor(Math.random() * codeLines.length)];
          line.speed = 0.35 + Math.random() * 0.45;
          line.opacity = 0.15 + Math.random() * 0.15;
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};
export default ScrollingCodeBackground;

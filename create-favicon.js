const { createCanvas } = require('canvas');
const fs = require('fs');

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Set background to transparent
ctx.clearRect(0, 0, 32, 32);

// Create gradient for car body
const gradient = ctx.createLinearGradient(0, 0, 32, 32);
gradient.addColorStop(0, '#3B82F6');
gradient.addColorStop(1, '#1E40AF');

// Draw car body
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.moveTo(6, 20);
ctx.lineTo(8, 16);
ctx.lineTo(24, 16);
ctx.lineTo(26, 20);
ctx.lineTo(28, 20);
ctx.lineTo(28, 22);
ctx.lineTo(26, 22);
ctx.lineTo(26, 24);
ctx.lineTo(24, 24);
ctx.lineTo(24, 22);
ctx.lineTo(8, 22);
ctx.lineTo(8, 24);
ctx.lineTo(6, 24);
ctx.closePath();
ctx.fill();

// Draw car windows
ctx.fillStyle = '#E5E7EB';
ctx.strokeStyle = '#374151';
ctx.lineWidth = 0.5;
ctx.fillRect(10, 14, 12, 4);
ctx.strokeRect(10, 14, 12, 4);

// Draw wheels
ctx.fillStyle = '#1F2937';
ctx.strokeStyle = '#111827';
ctx.lineWidth = 0.5;

// Left wheel
ctx.beginPath();
ctx.arc(10, 26, 3, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

// Right wheel
ctx.beginPath();
ctx.arc(22, 26, 3, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

// Wheel details
ctx.fillStyle = '#6B7280';
ctx.beginPath();
ctx.arc(10, 26, 1.5, 0, 2 * Math.PI);
ctx.fill();

ctx.beginPath();
ctx.arc(22, 26, 1.5, 0, 2 * Math.PI);
ctx.fill();

// Headlights
ctx.fillStyle = '#FBBF24';
ctx.beginPath();
ctx.arc(8, 18, 1, 0, 2 * Math.PI);
ctx.fill();

ctx.beginPath();
ctx.arc(24, 18, 1, 0, 2 * Math.PI);
ctx.fill();

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon.png', buffer);

console.log('Car favicon created successfully!'); 
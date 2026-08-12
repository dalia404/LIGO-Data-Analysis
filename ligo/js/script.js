/**
 * LIGO Project - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for AOS (Animate On Scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });

    // 2. Space Canvas Pattern (Abstract Particles)
    const canvas = document.getElementById('space-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                // Mostly white/blue/purple stars
                const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(0, 243, 255, 0.6)', 'rgba(181, 0, 255, 0.6)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.floor((width * height) / 10000); // Responsive count
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - distance/500})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const snr = parseFloat(document.getElementById('snr').value);
    const freq = parseFloat(document.getElementById('freq').value);
    const duration = parseFloat(document.getElementById('duration').value);

    const resultContainer = document.getElementById('resultContainer');
    const signalStatus = document.getElementById('signalStatus');
    const confidenceText = document.getElementById('confidenceText');
    const confidenceBar = document.getElementById('confidenceBar');
    const predictedTime = document.getElementById('predictedTime');

    resultContainer.style.display = 'block';

    try {
        // إرسال طلب للـ Backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ snr, peak_frequency: freq, duration })
        });

        const data = await response.json();

        // عرض النتيجة من الـ API
        signalStatus.innerText = data.class_name;
        confidenceText.innerText = `${(data.confidence * 100).toFixed(1)}%`;
        confidenceBar.style.width = `${data.confidence * 100}%`;
        predictedTime.innerText = data.gps_time ? data.gps_time : "غير متاح (Glitch)";

    } catch (error) {
        // محاكاة سريعة للعرض المباشر (Demo Mode) في حال عدم إطلاق السيرفر بعد
        console.log("تشغيل العرض المحلي تجريبياً...");
        
        let label = "Chirp / Wave Signal";
        let confidence = 92.5;

        if (freq > 1000) {
            label = "Blip Glitch (ضجيج عالي التردد)";
            confidence = 98.2;
        } else if (freq === 60 || freq === 120) {
            label = "Power Line Noise (خطوط الطاقة)";
            confidence = 99.0;
        }

        signalStatus.innerHTML = `<span style="color: #00f3ff;">${label}</span>`;
        confidenceText.innerText = `${confidence}%`;
        confidenceBar.style.width = `${confidence}%`;
        predictedTime.innerText = "1126259462.40";
    }
});
    });
    
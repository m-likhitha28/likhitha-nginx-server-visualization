/* Nginx Server visual · #Buildwithvinit · MIT */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var NS = 'http://www.w3.org/2000/svg';
  var IP = '203.0.113.25';
  var REQ = 'M130,185 H740', RES = 'M740,200 H130', LOOP = 'M770,150 V118 H830 V150', DOWN = 'M800,220 V270', UP = 'M800,270 V220';
  var G = '#46d369', R = '#e50914', P = '#b06bff', B = '#4aa8ff', Y = '#ffb020';

  var NODES = [
    { id: 'browser', x: 10, y: 150, w: 120, h: 70, i: '💻', l: 'Browser', s: 'Visitor' },
    { id: 'net', x: 200, y: 150, w: 120, h: 70, i: '🌐', l: 'Internet', s: 'DNS and routing' },
    { id: 'igw', x: 380, y: 150, w: 120, h: 70, i: '🚪', l: 'Internet Gateway', s: 'Door of the VPC' },
    { id: 'sg', x: 550, y: 150, w: 120, h: 70, i: '🛡️', l: 'Security Group', s: 'Firewall rules' },
    { id: 'ec2', x: 740, y: 150, w: 120, h: 70, i: '🖥️', l: 'EC2 + NGINX', s: 'Amazon Linux 2023' },
    { id: 'files', x: 725, y: 270, w: 150, h: 62, i: '📁', l: 'Website files', s: '/usr/share/nginx/html' }
  ];

  var STEPS = [
    { t: 'AWS EC2', sub: 'Launch the server', nodes: ['ec2'], pk: [],
      simple: 'EC2 is a computer you rent from Amazon. Think of it as an empty room where we will build our website’s home.',
      tech: 'Launch a t3.micro with the Amazon Linux 2023 AMI inside a VPC public subnet, with a public IPv4 address and a key pair for SSH.',
      cmd: ['# Console: EC2 > Launch instance', '# AMI: Amazon Linux 2023', '# Type: t3.micro (free-tier eligible)', '# Public IP: ' + IP] },
    { t: 'Security Group', sub: 'Open ports 80 and 22', nodes: ['sg', 'browser'],
      pk: [{ p: 'M130,185 H550', c: G, l: ':80 allowed', b: 0 }, { p: 'M130,160 H550', c: R, l: ':23 blocked', b: 1.3 }, { p: 'M130,210 H740', c: P, l: ':22 my IP only', b: 2.6 }],
      simple: 'A security group is a bouncer. Port 80 is the website door, open to everyone. Port 22 is the staff door, open only to your own IP address.',
      tech: 'Inbound rules: HTTP TCP 80 from 0.0.0.0/0, SSH TCP 22 from your IP/32. Security groups are stateful, so replies are allowed automatically. Everything else is denied by default.',
      cmd: ['# Inbound rules', '# TCP 80  0.0.0.0/0   (HTTP)', '# TCP 22  YOUR_IP/32  (SSH)', '# All other ports: denied'] },
    { t: 'Connect to EC2', sub: 'SSH from a terminal', nodes: ['browser', 'sg', 'ec2'],
      pk: [{ p: REQ, c: P, l: 'ssh :22', b: 0 }, { p: RES, c: P, l: 'shell ready', b: 2 }],
      simple: 'SSH is a secure remote control. You type commands on your laptop and they run on the server far away.',
      tech: 'The client proves identity with the private key (.pem). Use chmod 400 so SSH accepts the key file. The default user on Amazon Linux is ec2-user.',
      cmd: ['chmod 400 my-key.pem', 'ssh -i my-key.pem ec2-user@' + IP, '# Amazon Linux 2023', '[ec2-user@ip-10-0-1-25 ~]$'] },
    { t: 'Install NGINX', sub: 'sudo dnf install nginx -y', nodes: ['net', 'ec2'],
      pk: [{ p: 'M320,185 H740', c: G, l: 'nginx package ⬇', b: 0 }, { p: 'M320,205 H740', c: G, l: 'dependencies ⬇', b: 1.4 }],
      simple: 'NGINX is the waiter program. It listens for visitors and hands them the right web page. dnf is the app store of Amazon Linux.',
      tech: 'dnf downloads the nginx RPM from the Amazon Linux repositories, resolves dependencies and installs the binary, config in /etc/nginx and the default site in /usr/share/nginx/html.',
      cmd: ['sudo dnf install nginx -y', '# Downloading packages...', '# Installed: nginx-1.x', '# Complete!'] },
    { t: 'Start NGINX', sub: 'systemctl enable --now', nodes: ['ec2'],
      pk: [{ p: LOOP, c: G, l: 'active (running)', b: 0 }],
      simple: 'Installing is not the same as running. This command switches NGINX on now, and makes it switch itself on after every reboot.',
      tech: 'systemctl enable creates the boot-time symlink. --now also starts the service immediately. NGINX binds to port 80 with a master process and worker processes.',
      cmd: ['sudo systemctl enable --now nginx', 'systemctl status nginx', '# Active: active (running)', '# Main PID: 1234 (nginx)'] },
    { t: 'Website Files', sub: 'Copy to /usr/share/nginx/html/', nodes: ['ec2', 'files'],
      pk: [{ p: DOWN, c: Y, l: 'index.html', b: 0 }, { p: DOWN, c: B, l: 'style.css', b: 1 }, { p: DOWN, c: R, l: 'app.js', b: 2 }],
      simple: 'These are the pages visitors will see: HTML is the structure, CSS the looks, JavaScript the behaviour, and images the posters.',
      tech: 'The default NGINX root on Amazon Linux is /usr/share/nginx/html. NGINX serves index.html when a visitor requests /. Files must be readable by the nginx user.',
      cmd: ['sudo cp -r site/* /usr/share/nginx/html/', 'ls /usr/share/nginx/html', '# index.html css js assets', 'sudo nginx -t'] },
    { t: 'Browser Request', sub: 'Visitor opens the public IP', nodes: ['browser', 'net', 'igw', 'sg', 'ec2'], url: 'loading',
      pk: [{ p: REQ, c: R, l: 'GET / HTTP/1.1', b: 0 }, { p: REQ, c: B, l: 'Host: ' + IP, b: 1.5 }],
      simple: 'You type the server’s address. Your browser sends a letter asking, “Please give me the home page.” It travels through the internet to the AWS front door.',
      tech: 'Browser opens a TCP connection to the public IP on port 80, then sends GET / HTTP/1.1. The packet passes the Internet Gateway, route table, security group inbound rule 80, then reaches NGINX.',
      cmd: ['GET / HTTP/1.1', 'Host: ' + IP, 'Accept: text/html', '# Path: Browser > Internet > IGW > SG > NGINX'] },
    { t: 'NGINX Response', sub: 'Files travel back', nodes: ['files', 'ec2', 'sg', 'igw', 'net', 'browser'], url: 'live',
      pk: [{ p: UP, c: Y, l: 'read files', b: 0 }, { p: RES, c: G, l: '200 OK + HTML/CSS/JS', b: 1 }, { p: RES, c: B, l: 'posters', b: 2.5 }],
      simple: 'NGINX finds index.html, wraps it with a “200 OK” note and sends it back. Your browser then asks for the CSS, JavaScript and pictures too, and paints the page.',
      tech: 'Status 200 with Content-Type text/html. The browser parses the HTML, then makes extra GET requests for style.css, app.js and images. Replies pass the security group automatically because it is stateful.',
      cmd: ['HTTP/1.1 200 OK', 'Server: nginx', 'Content-Type: text/html', '# + style.css, app.js, posters'] },
    { t: 'Troubleshooting', sub: 'Port, SG, service, IP, curl', nodes: ['sg', 'ec2', 'browser'], url: 'live',
      pk: [{ p: LOOP, c: G, l: 'curl localhost', b: 0 }, { p: 'M130,185 H550', c: Y, l: 'check port 80', b: 1.5 }],
      simple: 'If the page does not load, check from the inside out: Is NGINX running? Does it answer on the server itself? Is the door (port 80) open? Is the IP right?',
      tech: 'Work outward: service status, local curl, listening port, security group (and NACL), then public IP and route table. Use the current public IP: it changes on stop and start unless you attach an Elastic IP.',
      cmd: ['systemctl status nginx', 'curl http://localhost', 'sudo ss -tlnp | grep :80', '# Console: SG inbound TCP 80 present?', '# Console: public IP still ' + IP + '?'] }
  ];

  var cur = 0, playing = true, timer = null;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ---------- diagram ---------- */
  var svg = $('#svg'), pkLayer;
  function buildSvg() {
    el('rect', { x: 365, y: 96, width: 520, height: 250, rx: 14, class: 'reg' }, svg);
    var t = el('text', { x: 378, y: 116, class: 'regt' }, svg); t.textContent = 'AWS Cloud · VPC · public subnet';
    [[130, 200], [320, 380], [500, 550], [670, 740]].forEach(function (a) { el('line', { x1: a[0], y1: 185, x2: a[1], y2: 185, class: 'ln' }, svg); });
    el('line', { x1: 800, y1: 220, x2: 800, y2: 270, class: 'ln' }, svg);
    NODES.forEach(function (n) {
      var g = el('g', { class: 'nd', id: 'n-' + n.id }, svg);
      el('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 10 }, g);
      var cx = n.x + n.w / 2;
      el('text', { x: cx, y: n.y + 24, 'font-size': 20 }, g).textContent = n.i;
      el('text', { x: cx, y: n.y + 42, 'font-size': n.id === 'files' ? 12 : 12, 'font-weight': 700 }, g).textContent = n.l;
      el('text', { x: cx, y: n.y + 56, class: 's' }, g).textContent = n.s;
    });
    pkLayer = el('g', {}, svg);
  }

  function packet(o) {
    var dur = '3.2s';
    var g = el('g', { class: 'pk', opacity: 0 }, pkLayer);
    el('circle', { r: 7, fill: o.c }, g);
    var tx = el('text', { y: -13 }, g); tx.textContent = o.l;
    var b = o.b + 's';
    var am = el('animateMotion', { path: o.p, dur: dur, begin: b, repeatCount: 'indefinite', calcMode: 'linear' }, g);
    el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;0.08;0.9;1', dur: dur, begin: b, repeatCount: 'indefinite' }, g);
    return am;
  }

  function drawStep(s) {
    while (pkLayer.firstChild) pkLayer.removeChild(pkLayer.firstChild);
    NODES.forEach(function (n) { $('#n-' + n.id).setAttribute('class', 'nd' + (s.nodes.indexOf(n.id) > -1 ? ' on' : '')); });
    s.pk.forEach(packet);
  }

  /* ---------- sidebar, caption, preview ---------- */
  function buildSidebar() {
    var ol = $('#steps');
    STEPS.forEach(function (s, i) {
      var li = document.createElement('li');
      li.tabIndex = 0;
      li.innerHTML = '<span class="n">' + (i + 1) + '</span><div><b>' + s.t + '</b><small>' + s.sub + '</small></div>';
      li.addEventListener('click', function () { go(i, true); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i, true); } });
      ol.appendChild(li);
    });
  }

  function caption(s, i) {
    var lines = s.cmd.map(function (c, k) {
      var out = c.charAt(0) === '#';
      return '<div class="' + (out ? 'o' : 'c') + '" style="animation-delay:' + (k * 0.45) + 's">' + (out ? c.slice(2) : c).replace(/</g, '&lt;') + '</div>';
    }).join('');
    $('#caption').innerHTML =
      '<span class="badge">Step ' + (i + 1) + ' of ' + STEPS.length + '</span><h2>' + s.t + '</h2>' +
      '<div class="blk"><b>🧒 In simple words</b>' + s.simple + '</div>' +
      '<div class="blk t"><b>⚙️ Technical view</b>' + s.tech + '</div>' +
      '<div class="term" aria-label="Terminal output">' + lines + '</div>';
  }

  var POSTERS = ['Midnight Circuit', 'Red Horizon', 'The Last Server', 'Cloud Runners', 'Packet Storm', 'Port 80', 'Silent Subnet', 'Edge Case', 'Zero Downtime', 'Cold Start'];
  function buildPosters() {
    ['#row1', '#row2'].forEach(function (id, r) {
      for (var k = 0; k < 6; k++) {
        var n = (r * 4 + k) % POSTERS.length, h = (n * 47 + 350) % 360;
        var d = document.createElement('div');
        d.className = 'poster';
        d.style.background = 'linear-gradient(160deg,hsl(' + h + ',70%,38%),hsl(' + ((h + 40) % 360) + ',60%,10%))';
        d.textContent = POSTERS[n];
        $(id).appendChild(d);
      }
    });
  }

  function preview(s, i) {
    var url = $('#url'), scr = $('#screen'), msg = $('#msg');
    url.className = 'url'; url.textContent = 'http://' + IP;
    var state = s.url === 'live' ? 'live' : (s.url === 'loading' ? 'loading' : 'down');
    scr.setAttribute('data-state', state === 'live' ? 'live' : 'down');
    if (state === 'live') return;
    if (state === 'loading') {
      url.className = 'url typing';
      msg.innerHTML = '<div><div class="spin"></div><b>Waiting for NGINX…</b><span>The request is travelling to port 80.</span></div>';
    } else if (i < 5) {
      msg.innerHTML = '<div><div class="big">🔌</div><b>This site can’t be reached</b><span>NGINX is not serving anything yet. Keep following the steps.</span></div>';
    } else {
      msg.innerHTML = '<div><div class="big">📁</div><b>Files are ready</b><span>Nobody has asked for them yet. Next: a visitor sends a request.</span></div>';
    }
  }

  /* ---------- control ---------- */
  function restartBar() {
    var b = $('#bar');
    b.className = ''; void b.offsetWidth;
    b.className = 'run' + (playing ? '' : ' paused');
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && cur < STEPS.length - 1) timer = setTimeout(function () { go(cur + 1); }, 5000);
  }
  function go(i, manual) {
    cur = Math.max(0, Math.min(STEPS.length - 1, i));
    var s = STEPS[cur];
    Array.prototype.forEach.call($('#steps').children, function (li, k) {
      li.className = k === cur ? 'active' : (k < cur ? 'done' : '');
      if (k === cur) li.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    drawStep(s); caption(s, cur); preview(s, cur);
    if (cur === STEPS.length - 1 && playing) { $('#bar').className = ''; $('#bar').style.width = '100%'; setPlay(false, true); return; }
    $('#bar').style.width = '';
    restartBar(); schedule();
  }
  function setPlay(on, ended) {
    playing = on;
    $('#play').textContent = on ? 'Pause' : (ended ? 'Replay' : 'Play');
    var b = $('#bar');
    if (b.classList.contains('run')) b.classList.toggle('paused', !on);
    clearTimeout(timer);
  }

  $('#play').addEventListener('click', function () {
    if ($('#play').textContent === 'Replay') { setPlay(true); go(0); return; }
    setPlay(!playing);
    if (playing) { restartBar(); schedule(); }
  });
  $('#reset').addEventListener('click', function () { setPlay(false); go(0); $('#bar').className = ''; });
  $('#prev').addEventListener('click', function () { go(cur - 1, true); });
  $('#next').addEventListener('click', function () { go(cur + 1, true); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(cur + 1, true);
    if (e.key === 'ArrowLeft') go(cur - 1, true);
  });

  /* manual navigation keeps the current play state but restarts the timer */
  var _go = go;
  go = function (i, manual) { _go(i, manual); };

  function theme() {
    var t = 'dark';
    try { t = localStorage.getItem('nsv-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (e) {}
    apply(t);
  }
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    $('#theme').textContent = t === 'dark' ? '☾' : '☀';
    try { localStorage.setItem('nsv-theme', t); } catch (e) {}
  }
  $('#theme').addEventListener('click', function () {
    apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  theme(); buildSvg(); buildSidebar(); buildPosters(); go(0);
})();

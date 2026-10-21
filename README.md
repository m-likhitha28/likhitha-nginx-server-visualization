# Nginx Server visual

**#Buildwithvinit**

An animated, beginner-friendly guide that shows how an **NGINX web server on an AWS EC2 instance** serves a Netflix-inspired landing page. It follows one visitor request from the browser, through the internet, the Internet Gateway and the security group, to NGINX and the website files.

Built for AWS Cloud Support Engineer interview preparation. Pure HTML, CSS and JavaScript. **No build step.**

> The landing page is an original, unofficial demo inspired by streaming sites. It uses no Netflix code or artwork and is not affiliated with Netflix or AWS.

## Features

- 9 numbered steps in a left sidebar (click any step)
- Auto-play every 5 seconds, with Pause, Play, Reset, Previous and Next (arrow keys work too)
- Animated SVG diagram: HTTP requests, responses, files and security checks
- Live browser preview that turns into the Netflix-style homepage when NGINX responds
- Caption card with a simple explanation, a technical explanation and terminal commands
- Dark and light mode, responsive layout, reduced-motion support

## Project structure

```
Nginx Server visual/
├── index.html
├── css/style.css
├── js/app.js
├── assets/
│   ├── logo.svg
│   └── site/index.html   <- the sample website you copy to EC2
├── .nojekyll
├── LICENSE
└── README.md
```

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit `http://localhost:8000`.

## The 9 steps

| # | Step | What you learn |
|---|------|----------------|
| 1 | AWS EC2 | Launch an Amazon Linux 2023 instance |
| 2 | Security Group | Allow HTTP 80 from anywhere, SSH 22 from your IP only |
| 3 | Connect to EC2 | SSH with a key pair |
| 4 | Install NGINX | `sudo dnf install nginx -y` |
| 5 | Start NGINX | `sudo systemctl enable --now nginx` |
| 6 | Website Files | Copy files to `/usr/share/nginx/html/` |
| 7 | Browser Request | Visitor sends `GET /` to the public IP |
| 8 | NGINX Response | `200 OK` plus HTML, CSS, JS and images |
| 9 | Troubleshooting | Port 80, SG rules, service status, public IP, `curl` |

## Deploy the real website on AWS EC2

**1. Launch the instance** (EC2 console): Amazon Linux 2023 AMI, t3.micro, create a key pair (`my-key.pem`), enable auto-assign public IP.

**2. Security group inbound rules**

| Type | Port | Source |
|------|------|--------|
| HTTP | 80 | 0.0.0.0/0 |
| SSH | 22 | My IP (your IP/32) |

**3. Connect**

```bash
chmod 400 my-key.pem
ssh -i my-key.pem ec2-user@<EC2_PUBLIC_IP>
```

**4. Install and start NGINX** (on the server)

```bash
sudo dnf update -y
sudo dnf install nginx -y
sudo systemctl enable --now nginx
systemctl status nginx
```

**5. Upload the website** (run on your laptop, from this project folder)

```bash
scp -i my-key.pem -r assets/site ec2-user@<EC2_PUBLIC_IP>:/tmp/site
```

**6. Place the files** (on the server)

```bash
sudo cp -r /tmp/site/* /usr/share/nginx/html/
sudo chmod -R o+rX /usr/share/nginx/html
sudo nginx -t
sudo systemctl reload nginx
curl http://localhost
```

**7. Visit** `http://<EC2_PUBLIC_IP>` in your browser. Use `http`, not `https`, because this demo has no TLS certificate.

## Troubleshooting checklist (interview favourite)

Work from the inside out:

| Check | Command or place | Healthy result |
|-------|------------------|----------------|
| NGINX running? | `systemctl status nginx` | `active (running)` |
| Answers locally? | `curl http://localhost` | HTML text returned |
| Listening on 80? | `sudo ss -tlnp \| grep :80` | nginx on `0.0.0.0:80` |
| Config valid? | `sudo nginx -t` | `syntax is ok` |
| Security group | EC2 > Security > Inbound rules | TCP 80 from 0.0.0.0/0 |
| Network ACL and route | VPC console | Allows 80; route to Internet Gateway |
| Correct public IP? | EC2 console | Matches the URL (changes on stop/start; use an Elastic IP) |
| Logs | `sudo tail /var/log/nginx/error.log` | No errors |

Typical symptoms: **timeout** usually means security group, NACL, route or wrong IP. **Connection refused** means NGINX is not running or not on port 80. **403** means file permissions. **404** means files are in the wrong folder.

## Quick interview answers

- **Why does `curl localhost` work but the browser time out?** NGINX is fine, so the block is the security group, NACL, route table or public IP.
- **Is a security group stateful?** Yes, return traffic is allowed automatically. NACLs are stateless.
- **What does `enable --now` do?** `enable` starts it at boot, `--now` starts it immediately.
- **Where is the default web root?** `/usr/share/nginx/html/`.

## Publish on GitHub Pages

1. Create a GitHub account and sign in.
2. Click **New repository**, name it `nginx-server-visual`, set it to **Public**, and create it (leave "Add a README" unticked).
3. Upload the project:
   - **Web upload:** unzip the download, open the new repo, click **uploading an existing file**, drag in the *contents* of the folder (`index.html`, `css`, `js`, `assets`, `.nojekyll`, `LICENSE`, `README.md`), then **Commit changes**.
   - **Command line:**
     ```bash
     cd "Nginx Server visual"
     git init
     git add .
     git commit -m "Nginx Server visual"
     git branch -M main
     git remote add origin https://github.com/<your-username>/nginx-server-visual.git
     git push -u origin main
     ```
4. Open **Settings > Pages**.
5. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, and click **Save**.
6. Wait one to two minutes, then open `https://<your-username>.github.io/nginx-server-visual/`.

The `.nojekyll` file tells GitHub Pages to serve the files as they are.

## License

MIT. See `LICENSE`. #Buildwithvinit

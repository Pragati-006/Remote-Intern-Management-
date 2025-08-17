# Remote Intern Management (RIM)
A MERN app to manage interns, tasks, attendance, and evaluations.
Backend: Node.js, Express, Mongoose, JWT, PM2
Frontend: React (create-react-app), React Router, Axios
DB: MongoDB (Atlas or self-hosted)
Prod Example: Nginx serves React and proxies /api → Node (port 5001)
CI/CD

## Quick Start
1) Clone & install :
   
    git clone https://github.com/Pragati-006/Remote-Intern-Management-.git
   
    cd Remote-Intern-Management-/backend
   
    ### install backend deps
    cd backend
    npm install
    ### install frontend deps
    cd ../frontend
    npm install

3) Environment variables
   
    Create backend/.env:
   
    MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
   
    JWT_SECRET=replace_with_a_long_random_string
   
    PORT=5001
  
    Frontend uses:
   
    Local dev (optional): create frontend/.env.development
   
    REACT_APP_API_URL=http://localhost:5001/api
   
    Production build: REACT_APP_API_URL=/api (set via CI or .env.production)

3) Run locally (two terminals)

  Terminal A – backend
  
  cd backend
  
  npm start         # runs server.js on http://localhost:5001
  
  ### health check
  curl -i http://localhost:5001/api/health
  
  Terminal B – frontend
  
  cd frontend
  
  npm start         # http://localhost:3000
  
  In local dev, the frontend talks to http://localhost:5001/api.

## NPM Scripts

  ### Backend
  
  npm start – start dev/prod (reads .env)
  
  npm run prod – node server.js
  
  npm test – run Mocha tests
  
  ### Frontend
  
  npm start – CRA dev server (http://localhost:3000)
  
  npm run build – production build to frontend/build

## Tests

  cd backend
  
  npm test

## CI/CD with GitHub Actions

  ### Required GitHub Secrets
  
  EC2_HOST – your EC2 public IP
  
  EC2_USER – usually ubuntu
  
  EC2_SSH_KEY – private key contents for that EC2 user

## Important:
Your EC2 instance must already have the repo cloned at ~/Remote-Intern-Management- and backend .env configured with real secrets.

# Production Deployment (EC2 + Nginx + PM2)

1) On EC2, install prerequisites
  ### Node & Git (example for Ubuntu)
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  
  sudo apt-get install -y nodejs git
  
  ### Nginx
  sudo apt-get install -y nginx
  
  ### PM2
  sudo npm i -g pm2

2) Clone repo & configure backend
   
  ### Start with PM2:
  pm2 start server.js --name server
  
  pm2 save
  
  ### Verify:
  curl -i http://127.0.0.1:5001/api/health

3) Build & place frontend

  cd ~/Remote-Intern-Management-/frontend
  
  npm ci
  
  npm run build
  
  sudo mkdir -p /var/www/rim-frontend
  
  sudo cp -r build/* /var/www/rim-frontend/

4) Nginx config

Create /etc/nginx/sites-available/rim:

 sudo nano /etc/nginx/sites-available/rim

 #### Update code:
 
  server {
      listen 80;
      server_name _;
      root /var/www/rim-frontend;
      index index.html;
      # Proxy API to Node on port 5001
      location ^~ /api/ {
          proxy_pass http://127.0.0.1:5001/;  # trailing slash IMPORTANT
          proxy_http_version 1.1;
          proxy_set_header Host              $host;
          proxy_set_header X-Real-IP         $remote_addr;
          proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header Connection        "";
          proxy_redirect off;
      }
    # SPA fallback for React
    location / {
        try_files $uri /index.html;
    }
}

## Enable & reload:
  sudo ln -sf /etc/nginx/sites-available/rim /etc/nginx/sites-enabled/rim
  
  sudo nginx -t && sudo systemctl reload nginx

5)  Verify from your laptop
   
  ### React app
  http://<EC2_PUBLIC_IP>/
  
  ### API health (goes through Nginx → Node)
  curl -i http://<EC2_PUBLIC_IP>/api/health

# Health Checks & Logs

  ### Backend health
  curl -i http://127.0.0.1:5001/api/health        # on EC2
  
  curl -i http://<EC2_PUBLIC_IP>/api/health       # from your machine
  
  ### PM2
  pm2 status
  
  pm2 logs server --lines 100
  
  pm2 restart server
  
  ### Nginx
  sudo tail -n 100 /var/log/nginx/access.log
  
  sudo tail -n 100 /var/log/nginx/error.log

License

MIT (or your preferred license)

Author

Pragati — PRs and issues welcome.

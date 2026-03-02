# ToDo Next

1. **GitHub Push**:
   - `git push origin emirhan` komutunu çalıştırarak bu değişiklikleri uzak sunucuya gönderin.

2. **AWS EC2 Frontend Deployment**:
   - Frontend için ayırdığınız EC2'ye (veya aynı EC2'ye) bağlanın.
   - Projeyi sunucuya çekin (`git clone` veya `git pull`).
   - `.env.production.example` dosyasını `.env.production` olarak kopyalayın.
   - `.env.production` içindeki `VITE_API_BASE_URL`, `VITE_COGNITO_CLIENT_ID` gibi değerleri doldurun.
   - `./deploy.sh` komutunu çalıştırın.
   - Tarayıcıdan EC2'nin public IP'sine girerek sistemin çalıştığını doğrulayın.

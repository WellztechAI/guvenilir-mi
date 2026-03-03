## 2026-03-03 - Proje Genel İnceleme ve Bekleyen Değişikliklerin Commit Edilmesi

- Durum: tamamlandı
- Branch: emirhan
- Commit(ler):
  - 3118d08 - fix: update cognito config to production values and improve db ssl cert handling
- Amaç: Commit edilmemiş local değişiklikleri temizlemek.
- Yapılanlar:
  - `.env`: `VITE_API_BASE_URL` EC2 IP'ye (`18.192.128.211:3000`) güncellendi. Cognito Client ID ve Domain production değerleriyle güncellendi.
  - `.gitignore`: `backend/certs/` eklendi (RDS SSL sertifika dizini gitignore'a alındı).
  - `backend/db.js`: SSL sertifika dosyasını diskten yükleyecek şekilde refactor edildi. Dev ortamında sertifika yoksa `rejectUnauthorized: false` ile fallback yapılıyor.
- Test / Verify:
  - Commit ve push başarılı. EC2 üzerinde test edilmedi.
- Riskler / Regression:
  - `backend/db.js` değişikliği EC2'de `certs/global-bundle.pem` dosyasının mevcut olduğu varsayılarak çalışır. Dosya eksikse SSL fallback devreye girer (uyarı logu basar).
  - `.env` prod Cognito bilgilerini içeriyor; frontend kodu Vite build sırasında bunu okur.
- Sonraki adım:
  - EC2'ye `git pull origin emirhan` + `docker-compose -f docker-compose.prod.yml up -d --build` ile backend'i yeniden deploy etmek.
  - Frontend'i build edip EC2'ye veya hosting platformuna (Vercel/S3) deploy etmek.
- Unutmama özeti:
  - Son yapılan: .env, .gitignore, backend/db.js commit/push edildi.
  - Bekleyen: EC2 backend redeploy, frontend build & deploy.
  - Dikkat: EC2'de `backend/certs/global-bundle.pem` dosyasının var olduğu doğrulanmalı.

---

## 2026-03-03 - API ve Backend Bağlantılarının Analizi

- Durum: tamamlandı
- Branch: emirhan
- Amaç: Frontend uygulamasının (Guvenilir Mi) AWS EC2 üzerindeki 'guvenilir-mi-docker' backend'ine, veritabanlarına (PostgreSQL, Redis) ve Cognito'ya tam olarak bağlanıp bağlanmadığını kontrol etmek ve gerekiyorsa entegre etmek.
- Yapılanlar:
  - `src/services/*` içerisindeki tüm API erişim fonksiyonları (`companyService`, `commentService`, `userService`, `adminService`, `authApiService`) denetlendi.
  - `src/lib/cognito.ts` dosyasındaki AWS Cognito OAuth2 Hosted UI mantığı kontrol edildi.
  - Kod bloklarının zaten `api.ts` isimli genel bir HTTP client (fetch wrapper) ile `VITE_API_BASE_URL` adresinden `/api/...` endpointlerine gittiği ve mock dataların projede bulunmadığı tespit edildi.
- Kararlar / Varsayımlar:
  - Frontend uygulamasının kodsal olarak backend (Node.js/PostgreSQL/Redis) entegrasyonu tamamen hazırlanmıştır. 
  - Yalnızca EC2 sunucusu üzerindeki `.env.production` dosyasının, çalışan AWS servislerine göre yapılandırılması (`VITE_API_BASE_URL` = `http://18.192.128.211:3000` ve Cognito Client ID/Domain bilgileri vb.) bağlantının sağlanması için yeterlidir.
- Test / Verify:
  - Local bilgisayarda hiçbir ekstra geliştirme yapılmadan `build` alındığı için ortam değişkenleri haricinde kod deplasa hazır durumdadır.
- Sonraki adım:
  - Kullanıcının AWS Cognito tarafında User Pool oluşturması ve ayarlarını (Client ID, Domain) EC2'nin `.env.production` dosyasına aktararak siteyi yayına alması beklenmektedir.

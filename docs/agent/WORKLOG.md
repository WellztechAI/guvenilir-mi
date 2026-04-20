## 2026-04-16 - Yorum Formu Geri Butonu, İmza Sirküleri File Upload, Website Alanı

- Durum: tamamlandı
- Branch: emirhan
- Commit(ler):
  - 8648a7c - feat: add back button to comment modal, file upload for signature, website field in company signup
- Amaç: CompanyDetail yorum modaline geri butonu eklemek, CompanySignup imza sirküleri alanını gerçek dosya yükleyiciye çevirmek, firma oluşturma alanında telefon yerine website eklemek ve tüm alanları zorunlu yapmak.
- Yapılanlar:
  - `src/pages/CompanyDetail.tsx`: Yorum formu modal header'ına chevron-left ikonu + "Geri" label'lı buton eklendi. Alt kısımdaki "İptal" butonu "Geri" ikonu ile güncellendi.
  - `src/pages/CompanySignup.tsx`: 
    - `requesterPhoneNumber` alanı kaldırıldı, `website` alanı eklendi (zorunlu).
    - Step 1 "İleri" butonu tüm alanlar zorunlu koşulla güncellendi (companyName, requesterName, requesterTitle, requesterCompanyEmail, website).
    - Step 3 imza sirküleri alanı `<input type="text">` → görsel file upload widget'ı (drag-drop-like tıklanabilir alan, upload spinner, başarı/hata durumları).
    - Step 3 "Başvuruyu Tamamla" butonu mernisNo + address + city + district + postalCode + signatureUrls hepsi zorunlu oldu.
    - Step 4 onay özetinde "Telefon Numarası" → "Web Sitesi" olarak güncellendi.
    - `handleSignatureFileChange`: dosya seçildiğinde `uploadFile` service çağrılır, URL `formData.signatureUrls`'a set edilir.
    - `handleSubmit`: `createCompany` çağrısında `phone` → `website`.
  - `src/services/authApiService.ts`: `CreateCompanyRequest` ve `CreateCompanyResponse` interface'lerinde `phone` → `website`.
- Test / Verify:
  - `npx tsc --noEmit` → hata yok.
- Riskler / Regression:
  - Backend `POST /api/companies` endpoint'i `website` field'ını kabul etmeli; mevcut backend bu alanı zaten alıyorsa sorun yok, yoksa backend'de de güncelleme gerekebilir.
  - `uploadFile` servisi `FileUploadResponse.url` alanını kullanıyor; backend `POST /api/upload` zaten `url: req.file.location` dönüyor — uyumlu.
  - imza sirküleri artık zorunlu; eski formları kullanan kullanıcılar için breaking change değil (yeni form akışı).
- Sonraki adım:
  - Backend'de `createCompany` endpoint'inin `website` field'ını kaydettiğini doğrula.
  - Upload endpoint'inin `signatures` bucket'ını doğru desteklediğini doğrula (backend route param yok, sadece S3 key prefix).
- Unutmama özeti:
  - Son yapılan: 3 dosya güncellendi, commit atıldı.
  - Bekleyen: backend'de website alanı kontrolü.
  - Dikkat: FileUploadResponse'daki `url` field'ı backend'den dönüyor.

---

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

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

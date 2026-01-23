import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const CommunityRules = () => {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      
      <PageHero title="Topluluk Kuralları" />

      {/* Content Section */}
      <section className="relative z-10 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div 
            className="font-inter text-[#090000]"
            style={{ fontSize: '24px', lineHeight: '100%' }}
          >
            <p className="font-medium mb-8">
              Güvenilir mi? topluluğu; saygı, şeffaflık ve doğruluk üzerine kuruludur. Tüm kullanıcılarımızdan aşağıdaki
              kurallara uymalarını bekliyoruz.
            </p>

            <h2 className="font-bold text-[28px] mb-4">1. Gerçek Deneyim Paylaş</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Yorumların tek amacı topluluğa katkıdır.</li>
              <li>• Gerçekten yaşamadığın bir deneyimi yazamazsın.</li>
              <li>• Reklam amacıyla sahte olumlu/olumsuz yorum yazmak yasaktır.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">2. Saygılı Ol</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Hakaret, küfür, aşağılama yok.</li>
              <li>• Marka çalışanlarına veya diğer kullanıcılara yönelik kişisel saldırılar yasaktır.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">3. Kişisel Verileri Paylaşma</h2>
            <p className="font-medium mb-8">
              Açık adres, telefon, IBAN, plaka, TCKN, çocuk bilgisi gibi her tür kişisel veri yasaktır.
              Bunları yazarsan onaylanmaz.
            </p>

            <h2 className="font-bold text-[28px] mb-4">4. Kanıtlama Zorunluluğu Yoktur (Ama Yardımcı Olur)</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Deneyimin gerçekliği için fatura yüklemeni istemeyiz.</li>
              <li>• Ancak markayla yaşadığın sürecin detaylarını yazman topluluğa ve moderasyona yardımcı olur.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">5. Tek Hesap Politikası</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Bir kişiye ait birden fazla hesap açmak yasaktır.</li>
              <li>• Spam, manipülasyon veya organize karalama tespit edilirse tüm hesaplar kapatılır.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">6. Markalarla Etkileşim</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Plus paket kullanan markalar, sorununu çözmek için seninle iletişime geçebilir.</li>
              <li>• Bunun olabileceğini kayıt sırasında açıkça onaylarsın.</li>
              <li>• Bir markanın seninle iletişim kurması, yorumunu kaldırmanı zorunlu kılmaz; karar sana aittir.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">7. Şikayet ve Bildirim Mekanizması</h2>
            <p className="font-medium mb-8">
              Bir içeriğin kurallara aykırı olduğunu düşünüyorsan bir tıkla bildirebilirsin.
              Moderasyon ekibimiz her bildirimi manuel olarak inceler.
            </p>

            <h2 className="font-bold text-[28px] mb-4">8. Topluluğu Kötüye Kullanma Yasaktır</h2>
            <p className="font-medium mb-4">Aşağıdakiler tespit edilirse kullanıcı platformdan uzaklaştırılır:</p>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Organize karalama</li>
              <li>• Rakip marka adına manipülatif yorum</li>
              <li>• Para/ödül karşılığı yönlendirilmiş yorum</li>
              <li>• Provokatif içerik veya spam</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">9. Platformun Amacı</h2>
            <p className="font-medium">
              Bu platform şikayet sitesi değildir; olumlu ve olumsuz tüm deneyimlerin dengeli şekilde yer alabileceği bir
              marka güven endeksi alanıdır.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityRules;

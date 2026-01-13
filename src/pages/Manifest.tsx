import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const Manifest = () => {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      
      <PageHero title="Manifest-o" />

      {/* Content Section */}
      <section className="relative z-10 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            <p 
              className="font-inter font-medium text-center text-[#090000]"
              style={{ fontSize: '24px', lineHeight: '100%' }}
            >
              Türkiye'de markalara güven meselesi artık bir duygudan ziyade bir hayatta kalma stratejisi. Her gün
              binlerce insan Google'a "X güvenilir mi?" yazıyor, aslında bilgi değil kolektif teyit arıyor. Güven, markadan
              değil birbirimizden öğreniliyor; Güvenilir mi? bu içgüdüyü kurumsallaştırmak ve görünür kılmak için var
              oldu.
            </p>

            <p 
              className="font-inter font-medium text-center text-[#090000]"
              style={{ fontSize: '24px', lineHeight: '100%' }}
            >
              Güvenilir mi?, gerçek kullanıcı deneyimlerini toplayan, güveni puanlayan ve markalara ayna tutan bir marka
              güven endeksi platformudur. Burada her yorum veridir. İyi deneyim de, kötü deneyim de Türkiye'de ticaret
              ahlakını yeniden yazacak girişin parçası olacaktır. Manifest'imiz bu yönde ✊.
            </p>

            <p 
              className="font-inter font-medium text-center text-[#090000]"
              style={{ fontSize: '24px', lineHeight: '100%' }}
            >
              Hayalimiz net: Bu ülkede her markanın şeffaf bir "güven puanı" olsun. Tüketici kararını topluluğun ortak
              aklına göre versin.
            </p>

            <p 
              className="font-inter font-medium text-center text-[#090000]"
              style={{ fontSize: '24px', lineHeight: '100%' }}
            >
              Biz, güveni Türkiye'nin yeni para birimine dönüştürmek için buradayız.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Manifest;

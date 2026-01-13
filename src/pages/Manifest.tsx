import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Manifest = () => {
  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <Header />
      
      {/* Hero Section with Gradient */}
      <section 
        className="pt-24 pb-16"
        style={{
          background: 'linear-gradient(180deg, #13102C 0%, #F8F8FA 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 
            className="font-manrope font-semibold text-center text-white mb-12"
            style={{ 
              fontSize: '65px', 
              lineHeight: '60px', 
              letterSpacing: '-2%' 
            }}
          >
            Manifest-o
          </h1>
          
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

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Manifest;

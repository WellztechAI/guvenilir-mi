import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CommentPolicy = () => {
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
            className="font-manrope font-semibold text-center text-white"
            style={{ 
              fontSize: '65px', 
              lineHeight: '60px', 
              letterSpacing: '-2%' 
            }}
          >
            Yorum Politikası
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div 
            className="font-inter text-[#090000]"
            style={{ fontSize: '24px', lineHeight: '100%' }}
          >
            <p className="font-medium mb-8">
              Güvenilir mi?, tüketicilerin gerçek marka deneyimlerini özgürce paylaşabilmesi için kurulmuş bir topluluk
              platformudur. Bu nedenle yorumlar silinmez; ancak bazı durumlarda geçici olarak yayından kaldırılabilir
              veya tamamen kaldırılması gerekebilir. Aşağıdaki politika platformun ortak güvenliği için uygulanır.
            </p>

            <h2 className="font-bold text-[28px] mb-4">1. Yorumların Yayınlanma Kuralları</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Yorum yazmak için üye olmak ve telefon doğrulaması (SMS/OTP) yapmak zorunludur.</li>
              <li>• Yorumlar yalnızca kullanıcı deneyimine dayanmalıdır; söylenti, dedikodu veya 3. kişi adına paylaşım yapılmamalıdır.</li>
              <li>• Yorumlar metin veya fotoğraf içerebilir.</li>
              <li>• Aynı kullanıcı her marka için tek yorum yayınlayabilir; ancak yorumu 1 kez düzenleme hakkı vardır. Düzenlenen yorumlarda "Düzenlendi" rozeti görünür ve eski sürüm arşivde tutulur.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">2. Yorumların Kaldırılabileceği / Engellenebileceği Durumlar</h2>
            <p className="font-medium mb-4">Aşağıdaki içerikler yayına alınmaz veya yayından kaldırılır:</p>
            <ul className="font-medium mb-4 space-y-2">
              <li>• KVKK ihlali (adres, telefon, plaka, IBAN, çocuk verisi vb.)</li>
              <li>• Ağır hakaret, küfür, iftira</li>
              <li>• Tehdit, nefret söylemi, ayrımcılık</li>
              <li>• Telif hakkı ihlali</li>
              <li>• Hukuka aykırılık oluşturan her türlü bilgi paylaşımı</li>
              <li>• Mahkeme veya kurum kararıyla kaldırılması istenen içerikler</li>
              <li>• Açıkça sahte/öldürmez içerikler, spam, bot davranışları</li>
            </ul>
            <p className="font-semibold text-[26px] mb-2">Yorumun durumu "İncelemede" olarak işaretlenebilir. Bu süreç:</p>
            <ul className="font-medium mb-8 space-y-2">
              <li>• 24-72 saat ön inceleme,</li>
              <li>• 7 gün içinde kesin karar ile sonuçlanır.</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">3. Markaların İtiraz Süreci</h2>
            <p className="font-medium mb-4">
              Markalar bir yorumu "Sahte / KVKK ihlali / itibar zedeleme" gerekçeleriyle incelemeye aldırabilir.
              Bu durumda:
            </p>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Yorum geçici olarak gizlenebilir.</li>
              <li>• Kullanıcıdan kanıt veya ek açıklama istenebilir.</li>
              <li>• Eksik/hatalı bilgi varsa kullanıcı yorumu düzenleyebilir (1 hak sınırı dahilinde).</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">4. Şeffaflık ve Doğrulama</h2>
            <ul className="font-medium mb-8 space-y-2">
              <li>• Her yorum çifte doğrulama sürecinden geçer: kullanıcı doğrulaması + moderasyon.</li>
              <li>• Yayın öncesi tüm yorumlar ekip tarafından manuel incelenir.</li>
              <li>• Yorumun kim tarafından yazıldığı markayla paylaşılmaz (sadece Plus paket sahibi markalar kullanıcı iletişim bilgilerini görebilir — kullanıcı önceden bilgilendirilmiş ve onay vermiştir).</li>
            </ul>

            <h2 className="font-bold text-[28px] mb-4">5. Veri Güvenliği</h2>
            <ul className="font-medium space-y-2">
              <li>• Yorum verileri Türkiye içinde barındırılır.</li>
              <li>• Kişisel bilgiler korunur ve yalnızca kullanıcının onay verdiği kapsamda markayla paylaşılır.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CommentPolicy;

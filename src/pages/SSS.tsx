import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const faqData = [
  {
    question: "Güvenilir mi? nedir?",
    answer: "Güvenilir mi?, kullanıcıların markalarla yaşadığı olumlu ve olumsuz deneyimlerini paylaştığı, bu deneyimlerin şeffaf şekilde puanlandığı bir marka güven endeksi platformudur. Doğrulama ve şeffaflık temelli bir topluluk alanıdır."
  },
  {
    question: "Telefon numaram markayla paylaşılır mı?",
    answer: "Sadece Plus paket sahibi markalar, platforma yorum yazan kullanıcıların iletişim bilgilerini görebilir. Markalar, yaşanan olası bir sorunu çözmek ve da memnuniyeti hakkında detaylı bilgi almak için kayıt olan kullanıcılarla iletişime geçebilir."
  },
  {
    question: "Yorumum neden yayına alınmadı?",
    answer: "Yorumun aşağıdaki durumlardan birine takılmış olabilir:\n• Hakaret, küfür, iftira\n• KVKK ihlali (adres, telefon, IBAN, plaka vb.)\n• Reklam ve spam\n• Manipülatif içerik (aynı metnin birden çok markaya kopyalanması vb.)\n• Gerçek deneyimi yansıtmayan \"ordermez\" içerik\nYorumun \"İncelemede\" etiketine düşebilir, moderasyon ekibi 24-72 saat içinde geri dönüş sağlar."
  },
  {
    question: "Marka yorumumu sildirmemi istiyor, ne yapmalıyım?",
    answer: "Yorumlar silinmez. Yalnızca hakaret, KVKK ihlali, tehdit gibi istisnai durumlarda yayından kaldırılır. Marka senden düzenleme isteyebilir ama bu tamamen senin kararındır."
  },
  {
    question: "Yorum yaparken kanıt (fatura, ekran görüntüsü) yüklemem zorunlu mu",
    answer: "Hayır. Ama hizmet sürecini net ifade eden metin ve ekran görüntüleri moderasyon ve topluluk için faydalıdır."
  },
  {
    question: "Sitede gördüğüm yanlış bilgiyi nasıl bildirebilirim?",
    answer: "Her yorumun altında \"Bildir\" butonu bulunur. Bildirim moderasyon ekibine düşer ve manuel olarak incelenir."
  },
  {
    question: "Yorum yazmak için neden üye olmak ve telefon doğrulaması yapmak zorundayım?",
    answer: "Topluluğu botlardan, sahte yorumlardan ve manipülatif hesaplardan korumak için SMS doğrulaması zorunludur. Bu, deneyimlerin gerçek kişiler tarafından paylaşıldığını doğrulamamıza yardımcı olur."
  },
  {
    question: "Yorumumu daha sonra düzenleyebilir miyim",
    answer: "Evet, her kullanıcı yorumunu yalnızca bir kez düzenleyebilir. Düzenlendiğinde yorumun yanında \"Düzenlendi\" rozeti görünür ve eski sürüm arşive alınır."
  },
  {
    question: "Yorumum neden gizlendi?",
    answer: "Marka veya başka bir kullanıcı yorumunun kurallara aykırı olduğunu bildirmiş olabilir. Bu durumda yorum geçici olarak gizlenir ve moderasyon tarafından incelenir."
  },
  {
    question: "Bir markayla ilgili yaşadığım problemi çözmek için platform üzerinden iletişime geçebilir miyim?",
    answer: "Güvenilir mi? bir müşteri hizmetleri platformu değildir. Ancak Plus paket sahibi markalar, seninle iletişime geçerek çözüm sunabilir."
  },
  {
    question: "Bir markayla ilgili yeni bir sayfa açabilir miyim?",
    answer: "Evet. Platformda bulunmayan markalar için kullanıcılar sayfa açabilir. Marka daha sonra bu sayfayı sahiplenecektir."
  },
  {
    question: "Yorumumda marka çalışanı veya başka bir kişiyi kötü hizmet gerekçesiyle suçlayabilir miyim?",
    answer: "Hayır. Kişisel veriler yasaktır. Deneyim genel süreç üzerinden anlatılmalıdır. Hakaret ya da küçük düşürücü yaklaşımlar yasaktır."
  }
];

const SSS = () => {
  // Split FAQ into two columns
  const leftColumn = faqData.filter((_, i) => i % 2 === 0);
  const rightColumn = faqData.filter((_, i) => i % 2 !== 0);

  const FAQCard = ({ faq }: { faq: typeof faqData[0] }) => {
    return (
      <div className="bg-white rounded-lg p-6 border border-[#E2E8F0]">
        <h3 
          className="font-manrope font-medium text-[#636D79] mb-4"
          style={{ fontSize: '16px', lineHeight: '100%' }}
        >
          {faq.question}
        </h3>
        <p 
          className="font-manrope font-medium text-[#A2A9B0] whitespace-pre-line"
          style={{ fontSize: '16px', lineHeight: '140%' }}
        >
          {faq.answer}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <h1 
            className="font-manrope font-semibold text-center text-[#1E293B]"
            style={{ 
              fontSize: '65px', 
              lineHeight: '60px', 
              letterSpacing: '-2%' 
            }}
          >
            Sıkça Sorulan Sorular
          </h1>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {leftColumn.map((faq, index) => (
                <FAQCard key={index * 2} faq={faq} />
              ))}
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {rightColumn.map((faq, index) => (
                <FAQCard key={index * 2 + 1} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default SSS;

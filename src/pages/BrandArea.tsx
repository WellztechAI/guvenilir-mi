import { useState } from "react";
import { Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import handShakeIcon from "@/assets/hand-shake.svg";
import crownIcon from "@/assets/crown.svg";
import badgeTable from "@/assets/badge-table.png";
import badgeExamples from "@/assets/badge-examples.png";

const BrandArea = () => {
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "monthly">(
    "yearly",
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Header />

      <PageHero title="Marka Alanı" bgColor="#F9F9F9" />
      {/* Content Section */}
      <section className="relative z-10 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="font-inter mb-8"
            style={{
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "100%",
              color: "#1E293B",
            }}
          >
            Türkiye'de tüketiciler satın alma kararlarını artık tek bir soruyla
            başlatıyor:
            <br />
            "X markası güvenilir mi?"
          </p>

          <p
            className="font-inter mb-16"
            style={{
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "100%",
              color: "#1E293B",
            }}
          >
            Biz de tam bu soruya sistematik bir cevap üretiyoruz.
          </p>

          {/* Neden Buradasınız Section */}
          <div className="mb-16">
            <h3
              className="font-inter mb-4"
              style={{
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "100%",
                color: "#1E293B",
              }}
            >
              Neden Buradasınız?
            </h3>
            <p
              className="font-inter"
              style={{
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "140%",
                color: "#1E293B",
              }}
            >
              Tüketiciler markanıza dair gerçek kullanıcı deneyimlerini görmek
              istiyor.
              <br />
              Google'da adınız "güvenilir mi?" ile aranıyor.
            </p>
          </div>

          {/* Rekabet Section */}
          <div className="mb-16">
            <p
              className="font-inter mb-8"
              style={{
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "140%",
                color: "#1E293B",
              }}
            >
              Rekabette öne çıkmanın en güçlü yolu: Güven duygusu veren
              markalar.
              <br />
              Biz ise markanızın itibarını rastlantıya bırakmıyoruz.
            </p>
          </div>

          {/* Güvenilir Marka Rozeti Section */}
          <div className="mb-16">
            <h3
              className="font-inter mb-4"
              style={{
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "100%",
                color: "#1E293B",
              }}
            >
              Güvenilir Marka Rozeti (Badge)
            </h3>
            <p
              className="font-inter"
              style={{
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "140%",
                color: "#1E293B",
              }}
            >
              Objektif tüketici Güvenilir olduğunuzu kanıtlayın.
              <br />
              Bu rozeti web sitenizde badge olarak kullanabilirsiniz. Size
              ileteceğimiz dinamik bir kod aracılığıyla kolayca entegre
              edebilirsiniz. Güncel yorum sayınız ve genel puanınız otomatik
              olarak badge'inize sirayet eder.
            </p>
          </div>

          {/* Badge Images */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
            <img
              src={badgeTable}
              alt="Değerlendirme tablosu"
              className="max-w-md w-full rounded-lg"
            />
            <img
              src={badgeExamples}
              alt="Badge örnekleri"
              className="max-w-md w-full rounded-lg"
            />
          </div>

          {/* Güvenilirliği Ölçülebilir Kılın Section */}
          <div className="mb-16">
            <h3
              className="font-inter mb-4"
              style={{
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "100%",
                color: "#1E293B",
              }}
            >
              Güvenilirliği Ölçülebilir Kılın
            </h3>
            <p
              className="font-inter"
              style={{
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "140%",
                color: "#1E293B",
              }}
            >
              İtibar yönetimi artık sadece sorun çözmek değil, güven üretmektir.
              <br />
              Markanıza güvenen tüketici, geri gelir ve tavsiye eder.
              <br />
              Siz markanızı doğrulayın, gerisini biz ölçelim.
              <br />
              Markanızı ücretsiz doğrulamak için doğrulama sürecini başlatın:
            </p>
          </div>

          {/* CTA Button */}
          <button
            className="font-urbanist px-8 py-3 rounded-lg mb-12"
            style={{
              background:
                "linear-gradient(97.8deg, #1F134A -1.21%, #5947A9 120.56%)",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "110%",
              color: "#FFFFFF",
            }}
          >
            Hemen Başvurun!
          </button>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-[#1E293B] text-white"
                  : "bg-transparent text-[#64748B]"
              }`}
            >
              Yıllık{" "}
              <span className="text-xs ml-1 px-1 py-0.5 bg-white/20 rounded">
                X-20
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#1E293B] text-white"
                  : "bg-transparent text-[#64748B]"
              }`}
            >
              Aylık
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6 bg-[#F9F9F9]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Icon */}
            <div
              className="w-[69px] h-[69px] rounded-full flex items-center justify-center mb-6"
              style={{
                background: "rgba(159, 112, 252, 0.15)",
                border: "4px solid rgba(159, 112, 252, 0.1)",
              }}
            >
              <img src={handShakeIcon} alt="" className="w-10 h-10" />
            </div>

            <h3
              className="font-manrope mb-2"
              style={{
                fontWeight: 700,
                fontSize: "24px",
                color: "#1E293B",
              }}
            >
              Ücretsiz Plan
            </h3>

            <p
              className="font-manrope mb-6"
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "140%",
                color: "#64748B",
              }}
            >
              Marka profilinizi ücretsiz doğrula. Güven skoru badge'ini ücretsiz
              bir şekilde web sitenizde yayınla, güven kazanın!
            </p>

            <div className="border-t border-[#E2E8F0] my-6" />

            <p
              className="font-urbanist text-center mb-6"
              style={{
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: "120%",
                color: "#1E293B",
              }}
            >
              Ücretsiz
            </p>

            <button
              className="w-full py-3 rounded-[26px] border border-[#E2E8F0] font-manrope mb-8"
              style={{
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "110%",
                color: "#1E293B",
              }}
            >
              Marka Doğrulaması Başlat
            </button>

            <h4
              className="font-manrope text-center mb-6"
              style={{
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "120%",
                color: "#1E293B",
              }}
            >
              Plana Neler Dahil?
            </h4>

            <div className="space-y-4">
              <PlanFeature
                title="Markamı ücretsiz doğrulat"
                description="Marka başvurunuzu Onaylıyoruz Markayı silinen tüketiciler için platformda gözükür."
                color="#9F70FC"
              />
              <PlanFeature
                title="Marka puan badge'ini ücretsiz yayınla"
                description="Sitenize, sosyal medya içerikleri bir a, profilde, mağaza ve ödeme sayfanız hep yanında olsun, güven kazandıran alana elde edin."
                color="#9F70FC"
              />
              <PlanFeature
                title="Ücretsiz web site yönlendirmesi"
                description="guvenilirmi.co/[Siz kendi marka sayfanıza] giren web site yönlendirmesiyle öretin sonuç yayınla."
                color="#9F70FC"
              />
              <PlanFeature
                title="Marka logonu ücretsiz yayınla"
                description="Güvenilir marka konumu markanınızın tescilli logoss onayını yayınla."
                color="#9F70FC"
              />
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Icon */}
            <div
              className="w-[69px] h-[69px] rounded-full flex items-center justify-center mb-6"
              style={{
                background: "rgba(236, 72, 153, 0.12)",
                border: "4px solid rgba(236, 72, 153, 0.1)",
              }}
            >
              <img src={crownIcon} alt="" className="w-10 h-10" />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <h3
                className="font-manrope"
                style={{
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#1E293B",
                }}
              >
                Plus
              </h3>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  background: "rgba(236, 72, 153, 0.1)",
                  color: "#EC4899",
                }}
              >
                30 Gün Ücretsiz
              </span>
            </div>

            <p
              className="font-manrope mb-6"
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "140%",
                color: "#64748B",
              }}
            >
              Ücretsiz plana ek olarak platformda ekstra özelliklere sahip ol.
            </p>

            <div className="border-t border-[#E2E8F0] my-6" />

            <p
              className="font-urbanist text-center mb-2"
              style={{
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: "120%",
                color: "#1E293B",
              }}
            >
              999₺ + KDV/Ay
            </p>
            <p
              className="font-manrope text-center mb-6"
              style={{
                fontWeight: 400,
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              Aylık olarak faturalandırılır
            </p>

            <button
              className="w-full py-3 rounded-lg font-urbanist mb-8"
              style={{
                background:
                  "linear-gradient(97.8deg, #1F134A -1.21%, #5947A9 120.56%)",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "110%",
                color: "#FFFFFF",
              }}
            >
              Hemen Plus'a Yükselt
            </button>

            <h4
              className="font-manrope text-center mb-6"
              style={{
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "120%",
                color: "#1E293B",
              }}
            >
              Plana Neler Dahil?
            </h4>

            <div className="space-y-4">
              <PlanFeature
                title="Marka taleselı"
                description="Marka profilinize yorum gönderen kullanıcılara en yüksek sıraya güvenilirlik onayı ver ve soruna düştüğünde iletişimi başlat."
                color="#EF4D9D"
              />
              <PlanFeature
                title="Yapılan yorumları anında öğren!"
                description="Yeni bir müşteriniz yaptığı yorum platform üzerinden e-postamanıza ve uygulamanıza bildirim olarak iletilir."
                color="#EF4D9D"
              />
              <PlanFeature
                title="Yorum sabitleme"
                description="Marka hareketinizi yapan yorum listesinde en mütevazi size özellikler."
                color="#EF4D9D"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface PlanFeatureProps {
  title: string;
  description: string;
  color: string;
}

const PlanFeature = ({ title, description, color }: PlanFeatureProps) => (
  <div className="flex gap-3">
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ backgroundColor: color }}
    >
      <Check className="w-3 h-3 text-white" />
    </div>
    <div>
      <p
        className="font-manrope"
        style={{
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "100%",
          color: "#8E8E93",
        }}
      >
        {title}
      </p>
      <p
        className="font-manrope mt-1"
        style={{
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "100%",
          color: "#8E8E93",
        }}
      >
        {description}
      </p>
    </div>
  </div>
);

export default BrandArea;

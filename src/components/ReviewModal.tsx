import React from "react";
import { X, Check } from "lucide-react";
import { Company, User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { createComment } from "@/services/commentService";
import { AlertCircle } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  const { user } = useAuthStore();

  const [step, setStep] = React.useState(1);
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [productInput, setProductInput] = React.useState("");
  const [contactMethod, setContactMethod] = React.useState<"email" | "phone">(
    "email",
  );
  const [description, setDescription] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment(
        user.id,
        company.id,
        rating,
        description,
        productInput,
        contactMethod,
      );
      setStep(5);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRating(0);
      setHoverRating(0);
      setProductInput("");
      setContactMethod("email");
      setDescription("");
      setTermsAccepted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle Enter key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Enter") {
        if (step === 1) {
          setStep(2);
        } else if (step === 2 && rating > 0) {
          setStep(3);
        } else if (step === 3 && productInput.trim()) {
          setStep(4);
        } else if (
          step === 4 &&
          description.trim() &&
          termsAccepted &&
          !isSubmitting
        ) {
          handleSubmit();
        } else if (step === 5) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step, rating, productInput, contactMethod]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Mask email for privacy like in the image (fu****.al***@gmail.com)
  const maskEmail = (email: string) => {
    if (!email) return "***@***.com";
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}***@${domain}`;
  };

  // Mask name (Fu*** H** Al***)
  const maskName = (name: string) => {
    if (!name) return "***";
    return name
      .split(" ")
      .map((part) => part.substring(0, 2) + "***")
      .join(" ");
  };

  // Mask phone (+90547*****24)
  const maskPhone = (phone: string) => {
    if (!phone) return "*****";
    return phone.substring(0, 6) + "*****" + phone.substring(phone.length - 2);
  };

  const ratingLabels = [
    "1-Çok Kötü",
    "2-Kötü",
    "3-Ne İyi / Ne Kötü",
    "4-İyi",
    "5-Harika",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(45, 27, 105, 0.4)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[24px] w-full max-w-[750px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <div className="border-2 border-blue-600 rounded-full p-0.5">
            <X size={16} className="text-blue-600" />
          </div>
        </button>

        <div className="p-6 md:p-8">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#84CC16] text-white px-3 py-1 rounded-full text-xs font-medium mb-6">
            <div className="bg-white rounded-full p-0.5">
              <Check size={10} className="text-[#84CC16]" strokeWidth={4} />
            </div>
            Onaylanmış Marka
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8">
            {/* Left: Company Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shrink-0">
                {company.imageUrl ? (
                  <img
                    src={company.imageUrl}
                    alt={company.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {company.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {company.name}
                  </h2>
                  <Check size={20} className="text-[#84CC16] fill-[#84CC16]" />
                </div>

                                <div className="flex items-center gap-2">
                                    {/* Yellow checks for stars */}
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-5 h-5 bg-[#FFC107] rounded flex items-center justify-center">
                                                <Check size={12} className="text-white" strokeWidth={4} />
                                            </div>
                                        ))}
                                        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                            <Check size={12} className="text-white" strokeWidth={4} />
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                        {company.rating != null ? company.rating.toFixed(1) : '-'} ({company.commentCount} Yorum)
                                    </span>
                                </div>
                            </div>
                        </div>

            {/* Right: Guarantee Card */}
            <div className="bg-white border rounded-lg p-3 shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1 font-bold text-lg text-[#0D062D]">
                <div className="bg-[#0D062D] text-white p-0.5 rounded">
                  <Check size={14} strokeWidth={4} />
                </div>
                güvenilir mi?
              </div>

              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-[#00C48C] rounded flex items-center justify-center"
                  >
                    <Check size={14} className="text-white" strokeWidth={4} />
                  </div>
                ))}
                <div className="w-6 h-6 bg-gradient-to-r from-[#00C48C] to-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={14}
                      className="text-white z-10"
                      strokeWidth={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <>
              <h3 className="text-lg text-gray-800 mb-6 font-medium">
                Aşağıdaki bilgiler ile yorumunuz yapılacak:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Adınız Soyadınız
                  </label>
                  <div className="font-semibold text-gray-800 text-base">
                    {user?.userName
                      ? maskName(user.userName)
                      : "Misafir Kullanıcı"}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    E-posta
                  </label>
                  <div className="font-semibold text-gray-800 text-base">
                    {user?.email ? maskEmail(user.email) : "-"}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Telefon Numarası
                  </label>
                  <div className="font-semibold text-gray-800 text-base">
                    {user?.phoneNumber ? maskPhone(user.phoneNumber) : "-"}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl text-gray-800 mb-2 font-medium">
                Puanlama
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Yaşadığınız deneyimi puanlayın.
              </p>

              {/* Label Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {ratingLabels.map((label, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                      (hoverRating || rating) === index + 1
                        ? "border-gray-300 bg-white shadow-sm"
                        : "border-transparent bg-gray-50 text-gray-500"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Rating Boxes */}
              <div className="flex gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      star <= (hoverRating || rating)
                        ? "bg-[#FFC107]"
                        : "bg-[#E5E7EB]"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <div className="bg-white rounded-md p-1">
                      <Check
                        size={20}
                        className={`stroke-[4px] ${
                          star <= (hoverRating || rating)
                            ? "text-[#FFC107]"
                            : "text-[#E5E7EB]"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Markanın hangi ürünüyle ilgili deneyimlerini paylaşacaksın?
                </h3>
                <input
                  type="text"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  placeholder="Kredi Kartı veya Samsung S12 Plus yazabilirsin."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Yorumun sonrasında marka seninle nasıl iletişime geçsin?
                </h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${contactMethod === "email" ? "border-[#0D062D] bg-[#0D062D]" : "border-gray-300 bg-white"}`}
                    >
                      {contactMethod === "email" && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="contact"
                      value="email"
                      checked={contactMethod === "email"}
                      onChange={() => setContactMethod("email")}
                      className="hidden"
                    />
                    <span className="text-gray-600 group-hover:text-gray-900">
                      E-posta
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${contactMethod === "phone" ? "border-[#0D062D] bg-[#0D062D]" : "border-gray-300 bg-white"}`}
                    >
                      {contactMethod === "phone" && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="contact"
                      value="phone"
                      checked={contactMethod === "phone"}
                      onChange={() => setContactMethod("phone")}
                      className="hidden"
                    />
                    <span className="text-gray-600 group-hover:text-gray-900">
                      Telefon
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Marka deneyimin nasıldı?
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hangi ürünü/hizmeti aldın, süreçte neler yaşadın? Sürecin başından sonuna kadar tecrübelerini, memnun kaldığın ve sorun yaşadığın noktaları detaylıca paylaş lütfen."
                className="w-full border border-blue-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 resize-none mb-6"
                autoFocus
              />

              <div className="bg-orange-50 rounded-lg p-4 mb-4 flex gap-4">
                <div className="bg-orange-100 p-2 rounded-full h-fit shrink-0">
                  <AlertCircle className="text-orange-500" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    Yorum Politikası ve Topluluk Kuralları
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Buraya tıklandığında yorum politikası ve topluluk kuralları
                    sözleşmesi çıkacak
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${termsAccepted ? "border-blue-500 bg-blue-500" : "border-gray-400 bg-white"}`}
                    >
                      {termsAccepted && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="hidden"
                    />
                    <span
                      className={`text-xs font-medium ${termsAccepted ? "text-blue-600" : "text-gray-400"}`}
                    >
                      Okudum, kabul ediyorum.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-xl p-6 flex items-start gap-4 mb-20">
                <div className="bg-[#16A34A] rounded-full p-1 mt-1 shrink-0">
                  <Check size={20} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-bold text-[#14532D] text-lg mb-1">
                    Tebrikler! Yorumunuz gönderildi.
                  </h3>
                  <p className="text-[#166534]">
                    Yorumunuz, ekibimiz tarafından incelenecek ve size en kısa
                    sürede mail yoluyla bilgi verilecek.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={`flex mt-8 ${step >= 2 && step < 5 ? 'justify-between items-center' : 'justify-end'}`}>
            {/* Geri butonu - sadece step 2, 3, 4'te göster */}
            {step >= 2 && step < 5 && (
              <button
                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                onClick={() => {
                  if (step === 2) setStep(1);
                  else if (step === 3) setStep(2);
                  else if (step === 4) setStep(3);
                }}
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Geri</span>
              </button>
            )}

            {/* Devam / Gönder butonu */}
            <button
              className={`flex items-center gap-2 transition-colors group ${isSubmitting ? "opacity-50 cursor-not-allowed" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => {
                if (isSubmitting) return;
                if (step === 1) setStep(2);
                else if (step === 2 && rating > 0) setStep(3);
                else if (step === 3 && productInput.trim()) setStep(4);
                else if (step === 4 && description.trim() && termsAccepted)
                  handleSubmit();
                else if (step === 5) onClose();
              }}
            >
              <div className="border border-gray-300 rounded px-1.5 py-0.5 group-hover:border-gray-400">
                <span className="font-mono text-lg">↵</span>
              </div>
              <div className="text-xs text-left">
                {step === 4
                  ? isSubmitting
                    ? "Gönderiliyor..."
                    : "Gönder"
                  : step === 5
                    ? "Tamamla"
                    : "Devam etmek için"}
                <br />
                "enter"a basın
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

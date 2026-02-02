import React, { useState, useEffect } from "react";
import { Company } from "@/types";
import { useAuthStore } from "@/store/authStore";
import {
  addFavouriteCompany,
  removeFavouriteCompany,
  refreshUser,
} from "@/services/authApiService";
import { ReviewModal } from "./ReviewModal";
import { Heart } from "lucide-react";

interface BrandHeroProps {
  company: Company;
}

export const BrandHero: React.FC<BrandHeroProps> = ({ company }) => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if company is in favourites (can be either objects with id or plain strings for backward compatibility)
    const isFav =
      user?.favouriteCompanies?.some((fav) =>
        typeof fav === "string" ? fav === company.id : fav.id === company.id,
      ) ?? false;
    setIsFavorite(isFav);
  }, [user, company.id]);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (isFavorite) {
        await removeFavouriteCompany(user.id, company.id);
      } else {
        await addFavouriteCompany(user.id, company.id);
      }

      // Update local state immediately for UI responsiveness
      setIsFavorite(!isFavorite);

      // Refresh user data to get updated favourites
      try {
        const updatedUser = await refreshUser(user.id);
        useAuthStore.getState().setUser({
          id: updatedUser.id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          country: updatedUser.country,
          imageUrl: updatedUser.imageUrl,
          status: updatedUser.status,
          createdAt: updatedUser.createdAt,
          favouriteCompanies: updatedUser.favouriteCompanies || [],
        });
      } catch (refreshError) {
        console.error("Error refreshing user data:", refreshError);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Favoriler güncellenirken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={company}
      />

      <section className="w-full -mt-3">
        {/* Full-width hero image */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <img
            src={
              company.imageUrl ||
              "https://api.builder.io/api/v1/image/assets/TEMP/8f3e6326e92d8c9980fa21aeab55702ce9a4b8ae?placeholderIfAbsent=true"
            }
            alt="Brand cover"
            className="w-full h-[300px] object-cover"
          />
        </div>

        {/* Purple to white gradient */}
        <div
          className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-24"
          style={{
            background:
              "linear-gradient(180deg, #2D1B69 0%, #4C38A5 30%, #8B7BC7 60%, #FFFFFF 100%)",
            height: "200px",
          }}
        />

        {/* Semi-transparent container */}
        <div className="max-w-[1357px] mx-auto px-4 -mt-[280px] relative z-10">
          <div
            className="rounded-3xl border overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top bar with warning and button */}
            <div className="flex w-full gap-5 text-white font-normal text-center flex-wrap justify-between p-4">
              <div className="bg-[rgba(218,72,72,1)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.25)] border flex items-stretch gap-1 overflow-hidden text-xs tracking-[-0.48px] leading-loose px-2.5 py-1 rounded-[50px] border-[rgba(255,255,255,0.24)] border-solid">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/70a0d4025f9d44e4a4f4b6ba8ce7ebe376c813fb?placeholderIfAbsent=true"
                  alt="Warning icon"
                  className="aspect-[1] object-contain w-[17px] shrink-0 my-auto"
                />
                <div className="basis-auto">Marka Henüz Doğrulanmadı</div>
              </div>
            </div>

            {/* Rating stars bar */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a16487835b4692dc8184f75f00d8165f2c25f6c0?placeholderIfAbsent=true"
              alt="Brand banner"
              className="aspect-[1000] object-contain w-full px-2 max-md:max-w-full"
            />

            {/* Main content */}
            <div className="p-6 pt-4">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                <div className="w-[64%] max-md:w-full max-md:ml-0">
                  <div className="w-full max-md:max-w-full">
                    <div className="flex w-[543px] max-w-full gap-[13px] text-white flex-wrap">
                      <div className="aspect-[1] w-[76px] h-[76px] self-stretch shrink-0 rounded-[50%] bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                        <span className="text-purple-700 text-2xl font-bold">
                          {company.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col items-stretch font-semibold">
                        <div className="flex items-center gap-1.5 text-[28px] text-center tracking-[-0.56px] leading-none">
                          <h1 className="self-stretch my-auto">
                            {company.name}
                          </h1>
                          <img
                            src="https://api.builder.io/api/v1/image/assets/TEMP/922eed6815d223177e6c8c417b5ec653eed97f12?placeholderIfAbsent=true"
                            alt="Verified badge"
                            className="aspect-[0.87] object-contain w-3.5 self-stretch shrink-0 my-auto"
                          />
                        </div>
                        <div className="text-xs leading-[1.4] self-center">
                          {company.rating ? company.rating.toFixed(1) : "0.0"}(
                          {company.commentCount} Yorum)
                        </div>
                      </div>
                      <div className="flex items-stretch gap-[5px] text-xs font-normal text-center tracking-[-0.48px] leading-loose mt-3">
                        <div className="grow">Web Sitesi </div>
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/2b28595312d2284b8382ed522b43f1d8ecb2ca64?placeholderIfAbsent=true"
                          alt="External link"
                          className="aspect-[1] object-contain w-2 shrink-0 my-auto"
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-col text-xs mt-1 pl-20 max-md:max-w-full max-md:pl-5">
                      <p className="text-[rgba(65,65,65,1)] font-normal leading-[18px] tracking-[-0.48px] max-md:max-w-full">
                        {company.description ||
                          "Şirket açıklaması henüz eklenmemiş."}
                      </p>
                      <div className="flex w-[371px] max-w-full gap-[19px] mt-4">
                        <div className="mt-[5px]">
                          <div className="flex gap-5 justify-between">
                            <div className="flex flex-col items-stretch">
                              <div className="text-black font-normal leading-none tracking-[-0.36px]">
                                Numara
                              </div>
                              <div className="text-black font-medium leading-loose tracking-[-0.48px]">
                                {company.phone || "-"}
                              </div>
                            </div>
                            <div className="flex flex-col items-stretch whitespace-nowrap">
                              <div className="text-black font-normal leading-none tracking-[-0.36px]">
                                Mail
                              </div>
                              <div className="text-black font-medium leading-loose tracking-[-0.48px]">
                                -
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-stretch whitespace-nowrap">
                          <div className="text-black font-normal leading-none tracking-[-0.36px]">
                            Sektör
                          </div>
                          <div className="flex w-full items-stretch gap-1.5 text-black font-medium text-center tracking-[-0.48px] leading-loose mt-2 flex-wrap">
                            {company.sectors && company.sectors.length > 0 ? (
                              company.sectors.map((sector, index) => (
                                <span
                                  key={index}
                                  className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md"
                                >
                                  <span className="self-stretch my-auto">
                                    {sector}
                                  </span>
                                </span>
                              ))
                            ) : (
                              <span className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md">
                                <span className="self-stretch my-auto">-</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[36%] ml-5 max-md:w-full max-md:ml-0">
                  <div className="flex w-full flex-col items-stretch mt-2.5 max-md:max-w-full max-md:mt-10">
                    <div className="flex items-center gap-[19px]">
                      <div className="self-stretch flex items-center gap-3 text-base text-[rgba(29,33,41,1)] font-medium tracking-[-0.32px] w-[140px] my-auto">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-[rgba(126,218,72,1)] shadow-[0px_1px_0px_2px_rgba(0,0,0,0.25)] self-stretch flex items-center gap-1 overflow-hidden justify-center my-auto px-6 py-2 rounded-[50px] max-md:px-5 hover:bg-[rgba(126,218,72,0.9)] transition-colors"
                        >
                          <span className="self-stretch my-auto">
                            Yorum Yaz
                          </span>
                        </button>
                      </div>
                      <div className="self-stretch flex items-center gap-3 w-9 my-auto">
                        <button
                          onClick={handleFavoriteClick}
                          className="bg-[rgba(247,247,247,0.12)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] border self-stretch flex w-9 items-center overflow-hidden justify-center h-9 my-auto rounded-[60px] border-[rgba(255,255,255,0.36)] border-solid hover:bg-[rgba(247,247,247,0.2)] transition-colors"
                        >
                          <Heart
                            size={20}
                            className={`transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
                          />
                        </button>
                      </div>
                    </div>
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/53db716f911912ae379fffc5e52072bc48334d88?placeholderIfAbsent=true"
                      alt="Brand statistics"
                      className="aspect-[4.15] object-contain w-full shadow-[-1px_0px_5px_rgba(0,0,0,0.19)] mt-9 max-md:max-w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer after gradient */}
        <div className="h-16" />
      </section>
    </>
  );
};

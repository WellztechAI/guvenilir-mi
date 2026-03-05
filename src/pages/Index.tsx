import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import {
  Search,
  Car,
  Sparkles,
  Monitor,
  Shirt,
  ShoppingCart,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import {
  searchCompaniesByName,
  getCompanySuggestions,
} from "@/services/companyService";
import { Company as CompanyType } from "@/types";

// Category data with icons
const categories = [
  { id: "otomotiv", label: "Otomotiv", icon: Car },
  { id: "guzellik", label: "Güzellik & Kişisel Bakım", icon: Sparkles },
  { id: "elektronik", label: "Elektronik", icon: Monitor },
  { id: "moda", label: "Moda", icon: Shirt },
  { id: "market", label: "Market", icon: ShoppingCart },
  { id: "banka", label: "Banka", icon: Building2 },
];

// Sample company data
const featuredCompanies = [
  { name: "Garanti BBVA", category: "Banka" },
  { name: "Nike", category: "Giyim" },
  { name: "Hoagard", category: "Ev Tekstil" },
  { name: "English Home", category: "Ev Tekstili" },
];

const mostReviewedCompanies = [
  { name: "Fuzul Ev", category: "Finansman" },
  { name: "Vestel", category: "Elektronik" },
  { name: "Turkcell", category: "Telekomünikasyon" },
  { name: "Trendyol", category: "E-Ticaret" },
];

const newReviews = [
  { name: "MediaMarkt", category: "Elektronik" },
  { name: "LC Waikiki", category: "Moda" },
  { name: "Migros", category: "Market" },
  { name: "Akbank", category: "Banka" },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanyType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // Debounced search effect
  useEffect(() => {
    const searchCompanies = async () => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        // Use suggest endpoint for autocomplete
        const suggestions = await getCompanySuggestions(searchQuery);

        // Convert suggestions to Company format
        const results: CompanyType[] = suggestions.map(
          (s) =>
            ({
              id: s.id,
              name: s.name,
              description: "",
              rating: s.rating,
              commentCount: 0,
              imageUrl: undefined,
              phone: "",
              sectors: [],
              status: "active",
              slug: s.slug, // Keep slug for navigation
            }) as any,
        );

        setSearchResults(results);
        setShowDropdown(results.length > 0 || searchQuery.length >= 3);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowDropdown(true); // Show "no results" message
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchCompanies, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Update dropdown position
  useEffect(() => {
    const updatePosition = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        // Also check if clicking inside the portal
        const portal = document.getElementById("search-dropdown-portal");
        if (portal && !portal.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryLabel: string) => {
    setSearchQuery(categoryLabel);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowDropdown(false);
      if (searchResults.length > 0) {
        navigate(`/company/${searchResults[0].id}`);
      }
    }
  };

  const handleSelectCompany = (company: CompanyType) => {
    setShowDropdown(false);
    setSearchQuery(company.name);
    // Use slug if available (from suggestions), otherwise use id
    const identifier = (company as any).slug || company.id;
    navigate(`/company/${identifier}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Search Dropdown Content
  const DropdownContent = (
    <div
      id="search-dropdown-portal"
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
      style={{
        top: `${dropdownPos.top + 8}px`,
        left: `${dropdownPos.left}px`,
        width: `${Math.min(dropdownPos.width * 0.75, dropdownPos.width - 60)}px`, // Approximate width matching design
      }}
    >
      {isSearching ? (
        <div className="p-4 text-center text-gray-500">
          <span className="animate-pulse">Aranıyor...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {searchResults.map((company) => (
            <button
              key={company.id}
              onClick={() => handleSelectCompany(company)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0">
                <span className="text-purple-600 text-sm font-semibold">
                  {company.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate">
                  {company.name}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {company.sectors?.join(", ") || "Genel"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="text-sm">★</span>
                <span className="text-gray-600 text-sm">
                  {company.rating?.toFixed(1) || "-"}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : searchQuery.length >= 3 ? (
        <div className="p-4 text-center text-gray-500">
          "{searchQuery}" için sonuç bulunamadı
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section using PageHero */}
      <section className="relative w-full pb-20">
        <PageHero title="" bgColor="#FFFFFF" />

        <div
          className="relative z-10 w-full max-w-[1400px] mx-auto px-6"
          style={{ marginTop: "-150px" }}
        >
          {/* Semi-transparent Glass Card - Wider */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl pl-32 pr-20 py-12 pb-36 shadow-2xl border border-white/20">
            {/* Title - LEFT ALIGNED - Manrope 600 65px */}
            <h1
              className="font-manrope text-white mb-3"
              style={{
                fontFamily: "Manrope",
                fontWeight: 600,
                fontSize: "65px",
                lineHeight: "60px",
                letterSpacing: "-2%",
              }}
            >
              Marka Güven Endeksi
            </h1>

            {/* Subtitle - LEFT ALIGNED - Manrope 400 32px */}
            <p
              className="font-manrope text-white/90 mb-8"
              style={{
                fontWeight: 400,
                fontSize: "32px",
                lineHeight: "100%",
              }}
            >
              Gerçek müşteri deneyimleriyle markaların güvenilirliğini keşfet!
            </p>

            {/* Search Bar */}
            <div className="mb-6" ref={searchRef}>
              <div className="flex items-center gap-3 max-w-[75%]">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() =>
                      searchQuery.length >= 3 && setShowDropdown(true)
                    }
                    placeholder="Arçelik Güvenilir Mi?"
                    className="w-full h-11 pl-12 pr-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg"
                  />
                  {showDropdown && createPortal(DropdownContent, document.body)}
                </div>
                <button
                  onClick={handleSearch}
                  className="h-12 px-4 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search size={20} />
                  <span>Ara</span>
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.label)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 rounded-full border border-gray-200 text-sm font-medium"
                  >
                    <IconComponent size={16} className="text-gray-500" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Containers - Outside card, overlapping more */}
          <div className="mt-[-120px] relative z-20 pl-32 pr-32">
            <p className="text-gray-500 text-sm mb-3">
              Seçilmiş önerileri keşfedin
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <CompanyContainer
                title="Öne Çıkan Markalar"
                companies={featuredCompanies}
              />
              <CompanyContainer
                title="En Çok Yorum Alan Markalar"
                companies={mostReviewedCompanies}
              />
              <CompanyContainer
                title="Yeni Eklenen Yorumlar"
                companies={newReviews}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Section - Moved Up */}
      <section className="w-full max-w-[1200px] mx-auto px-4 mt-8 pb-16">
        {/* Main Tagline */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4 leading-tight">
          Senin sesin,
          <br />
          milyonların pusulası
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto mb-12">
          Bir yorum, binlerce kararı değiştirebilir. Sen de güvenilir mi?'ye
          katkı sağla.
        </p>

        {/* Sample Review Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Company Logo Side */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-2xl font-bold text-teal-600">
                »»fuzul<span className="text-gray-800">EV</span>
              </div>
              <p className="text-xs text-gray-400">
                KOLAY KONUT EDİNDİRME MERKEZİ
              </p>
            </div>

            {/* Rating Side */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  ☑ güvenilir mi?
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center"
                    >
                      <span className="text-white text-lg">✓</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Toplam 15 yorum üzerinden 4.7 / 5 değerlendirme
              </p>
            </div>
          </div>

          {/* Sample Review */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    Fuat Han Albar
                  </span>
                  <span className="text-teal-500">✓</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span className="text-yellow-500">🏅</span>
                  <span>Güven Elçisi</span>
                  <span>•</span>
                  <span>3 yorum</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-teal-500 rounded-sm flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Praesent nibh justo, blandit eu consectetur sit amet, iaculis
                  in velit. Praesent nec nisi eu nisl consequat tincidunt.
                  Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut
                  quam vel neque gravida faucibus.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === 1 ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Slider Widget - Featured Brands */}
      <section className="w-full max-w-[1200px] mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Öne Çıkan Markalar
            </h2>
            <p className="text-gray-500 text-sm">
              Yüksek güven skoru ile öne çıkan markalar
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors">
              <span className="text-xl">←</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors">
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {/* Repeating company cards */}
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              {/* Company Logo */}
              <div className="text-2xl font-bold text-teal-600 mb-4">
                »»fuzul<span className="text-gray-800">EV</span>
              </div>

              {/* Company Name */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Fuzul Ev
              </h3>

              {/* Star Rating */}
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-bold">★</span>
                  </div>
                ))}
                <div className="w-7 h-7 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">★</span>
                </div>
              </div>

              {/* Rating Info */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800">4.5</span>
                <span className="text-sm text-gray-500">(128 Yorum)</span>
              </div>

              {/* Avatar */}
              <div className="mt-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal Review Cards Carousel */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Milyonlarca tüketici,
              <br />
              senin sayende en iyi kararı veriyor.
            </h2>
            <p className="text-gray-600 text-lg">
              Senin sesin, milyonların pusulası.
            </p>
          </div>

          {/* Horizontal scrolling review cards */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
                      alt="Fuat Han Albar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        Fuat Han Albar
                      </span>
                      <span className="text-yellow-500 text-sm">🏅</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Güvenilir Elçisi • 3 yorum
                    </span>
                  </div>
                </div>

                {/* Date and Stars */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">5 Ekim 2025</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center"
                      >
                        <span className="text-white text-xs">★</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-white text-xs">★</span>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Praesent nibh justo, blandit eu consectetur sit amet, iaculis
                  in velit. Praesent nec nisi eu nisl consequat tincidunt.
                  Aliquam laoreet ex elit, eu eleifend dui maximus in.
                </p>

                {/* Avatar in review */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
                      alt="Reviewer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">GB</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        Garanti BBVA
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <span key={i} className="text-yellow-400 text-xs">
                            ★
                          </span>
                        ))}
                        <span className="text-gray-300 text-xs">★</span>
                      </div>
                      <span className="text-xs text-gray-500">128 yorum</span>
                    </div>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Tamamını Gör
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

// Company Container Component
interface CompanyListItem {
  name: string;
  category: string;
}

interface CompanyContainerProps {
  title: string;
  companies: CompanyListItem[];
}

const CompanyContainer: React.FC<CompanyContainerProps> = ({
  title,
  companies,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-gray-800 font-semibold text-base">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Company List */}
      <div className="divide-y divide-gray-50">
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Company Logo Placeholder */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
              <span className="text-gray-400 text-sm font-semibold">
                {company.name.substring(0, 2).toUpperCase()}
              </span>
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-medium text-sm truncate">
                {company.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {company.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

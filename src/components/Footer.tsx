import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1061px] mt-7 max-md:max-w-full">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-[83%] max-md:w-full max-md:ml-0">
          <div className="w-full max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-[82%] max-md:w-full max-md:ml-0">
                <div className="justify-between items-center border flex mr-[-823px] min-h-[264px] w-full gap-8 flex-wrap bg-white px-8 py-[42px] rounded-3xl border-solid border-[#DBE2EB] max-md:max-w-full max-md:px-5">
                  <div className="self-stretch flex justify-between w-[186px] my-auto">
                    <div className="flex min-h-[181px] min-w-60 w-[579px] gap-8" />
                  </div>
                  <p className="text-[#202023] text-sm font-medium leading-[21px] self-stretch w-[564px] my-auto max-md:max-w-full">
                    Canlife is a company that provides technology and
                    consulting services for life insurance. Canlife is
                    licensed as an insurance agent in all states where its
                    products are offered. License information can be found
                    here. Canlife operates under the name Canlife Insurance
                    Services in LA. The information contained on this website
                    is for informational purposes only. Certain products and
                    product features may not be available in all states, and
                    other restrictions or prohibitions may apply.
                  </p>
                </div>
              </div>
              <div className="w-[18%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex min-h-[29px] items-center gap-[5px] mt-[99px] max-md:mt-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f9fda9ea38b7e8d83d6e3963b4ec7936ea56d76f?placeholderIfAbsent=true"
                    alt="Company logo"
                    className="aspect-[1] object-contain w-[29px] self-stretch my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[17%] ml-5 max-md:w-full max-md:ml-0">
          <div className="flex w-full flex-col items-stretch max-md:mt-10">
            <nav className="overflow-hidden">
              <h3 className="text-[#101010] text-lg font-bold">
                Keşfet
              </h3>
              <ul className="flex max-w-full w-40 flex-col overflow-hidden items-stretch text-base text-[#4E657F] font-medium justify-center mt-4 space-y-3">
                <li>
                  <a href="#" className="text-[#4E657F] hover:text-[#101010] transition-colors">
                    Manifest-o
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#4E657F] hover:text-[#101010] transition-colors">
                    Sıkça Sorulan Sorular
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#4E657F] hover:text-[#101010] transition-colors">
                    Marka Alanı
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#4E657F] hover:text-[#101010] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#4E657F] hover:text-[#101010] transition-colors">
                    İletişim
                  </a>
                </li>
              </ul>
            </nav>
            <div className="flex gap-6 mt-[29px]" role="list" aria-label="Social media links">
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/189d1eec113c4d975e437d8c12587c9da9073e76?placeholderIfAbsent=true"
                  alt="Facebook"
                  className="aspect-[1] object-contain w-6 shrink-0"
                />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Twitter">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/15142eb28528a8c72d0cdfd5c4a63696ed35b10b?placeholderIfAbsent=true"
                  alt="Twitter"
                  className="aspect-[1] object-contain w-6 shrink-0"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-[1079px] items-stretch gap-[40px_97px] text-lg text-[#4E657F] font-normal flex-wrap mt-[18px] max-md:max-w-full">
        <div className="text-[#4E657F] grow shrink basis-auto max-md:max-w-full">
          <a href="#" className="hover:text-[#101010] transition-colors">Aydınlatma Metni</a> {' '}
          <a href="#" className="hover:text-[#101010] transition-colors">Kullanım Şartları</a> {' '}
          <a href="#" className="hover:text-[#101010] transition-colors">Topluluk Kuralları</a> {' '}
          <a href="#" className="hover:text-[#101010] transition-colors">Değerlendirme Kılavuzu</a>
        </div>
        <div className="text-[#4E657F] grow-0 shrink w-[235px] basis-auto">
          2026 güvenilir mi? Her hakkı saklıdır.
        </div>
      </div>
    </footer>
  );
};

import React from 'react';

export const BrandHero: React.FC = () => {
  return (
    <section className="w-full -mt-3">
      {/* Full-width hero image */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/8f3e6326e92d8c9980fa21aeab55702ce9a4b8ae?placeholderIfAbsent=true"
          alt="Brand cover"
          className="w-full h-[300px] object-cover"
        />
      </div>

      {/* Purple to white gradient */}
      <div
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-24"
        style={{
          background: 'linear-gradient(180deg, #2D1B69 0%, #4C38A5 30%, #8B7BC7 60%, #FFFFFF 100%)',
          height: '200px',
        }}
      />

      {/* Semi-transparent container */}
      <div className="max-w-[1357px] mx-auto px-4 -mt-[280px] relative z-10">
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div className="basis-auto">
                Marka Henüz Doğrulanmadı
              </div>
            </div>
            <button className="bg-[rgba(19,16,44,1)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.25)] border flex flex-col overflow-hidden items-stretch text-[13px] tracking-[-0.52px] leading-loose justify-center px-[42px] py-[5px] rounded-[50px] border-[rgba(255,255,255,0.24)] border-solid max-md:px-5 hover:bg-[rgba(19,16,44,0.9)] transition-colors">
              <div>Doğrulamayı Başlat</div>
            </button>
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
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/575db4fcc3f27ace122a83abec07b8055dd416ea?placeholderIfAbsent=true"
                      alt="Brand logo"
                      className="aspect-[1] object-contain w-[76px] self-stretch shrink-0 rounded-[50%]"
                    />
                    <div className="flex flex-col items-stretch font-semibold">
                      <div className="flex items-center gap-1.5 text-[28px] text-center tracking-[-0.56px] leading-none">
                        <h1 className="self-stretch my-auto">
                          MAJORITY - Mobile Banking
                        </h1>
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/922eed6815d223177e6c8c417b5ec653eed97f12?placeholderIfAbsent=true"
                          alt="Verified badge"
                          className="aspect-[0.87] object-contain w-3.5 self-stretch shrink-0 my-auto"
                        />
                      </div>
                      <div className="text-xs leading-[1.4] self-center">
                        4.5(128 Yorum)
                      </div>
                    </div>
                    <div className="flex items-stretch gap-[5px] text-xs font-normal text-center tracking-[-0.48px] leading-loose mt-3">
                      <div className="grow">
                        Web Sitesi{" "}
                      </div>
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/2b28595312d2284b8382ed522b43f1d8ecb2ca64?placeholderIfAbsent=true"
                        alt="External link"
                        className="aspect-[1] object-contain w-2 shrink-0 my-auto"
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col text-xs mt-1 pl-20 max-md:max-w-full max-md:pl-5">
                    <p className="text-[rgba(65,65,65,1)] font-normal leading-[18px] tracking-[-0.48px] max-md:max-w-full">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent nibh justo, blandit eu consectetur sit amet,
                      iaculis in velit. Praesent nec nisi eu nisl consequat
                      tincidunt. Aliquam laoreet ex elit, eu eleifend dui
                      maximus in. Mauris ut quam vel neque gravida faucibus.
                      Etiam eget cursus justo. Maecenas vehicula eu felis ac
                      congue.
                    </p>
                    <div className="flex w-[371px] max-w-full gap-[19px] mt-4">
                      <div className="mt-[5px]">
                        <div className="flex gap-5 justify-between">
                          <div className="flex flex-col items-stretch">
                            <div className="text-black font-normal leading-none tracking-[-0.36px]">
                              Numara
                            </div>
                            <div className="text-black font-medium leading-loose tracking-[-0.48px]">
                              (855) 553 3388
                            </div>
                          </div>
                          <div className="flex flex-col items-stretch whitespace-nowrap">
                            <div className="text-black font-normal leading-none tracking-[-0.36px]">
                              Mail
                            </div>
                            <div className="text-black font-medium leading-loose tracking-[-0.48px]">
                              support@majority.com
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch whitespace-nowrap">
                        <div className="text-black font-normal leading-none tracking-[-0.36px]">
                          Sektör
                        </div>
                        <div className="flex w-full items-stretch gap-1.5 text-black font-medium text-center tracking-[-0.48px] leading-loose mt-2">
                          <span className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md">
                            <span className="self-stretch my-auto">
                              Banka
                            </span>
                          </span>
                          <span className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md">
                            <span className="self-stretch my-auto">
                              Finans
                            </span>
                          </span>
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
                      <button className="bg-[rgba(126,218,72,1)] shadow-[0px_1px_0px_2px_rgba(0,0,0,0.25)] self-stretch flex items-center gap-1 overflow-hidden justify-center my-auto px-6 py-2 rounded-[50px] max-md:px-5 hover:bg-[rgba(126,218,72,0.9)] transition-colors">
                        <span className="self-stretch my-auto">
                          Yorum Yaz
                        </span>
                      </button>
                    </div>
                    <div className="self-stretch flex items-center gap-3 w-9 my-auto">
                      <button className="bg-[rgba(247,247,247,0.12)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] border self-stretch flex w-9 items-center overflow-hidden justify-between h-9 my-auto p-2 rounded-[60px] border-[rgba(255,255,255,0.36)] border-solid hover:bg-[rgba(247,247,247,0.2)] transition-colors">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/5deba4c5c415cda4130844bfea0fbaa8af7325cc?placeholderIfAbsent=true"
                          alt="Settings"
                          className="aspect-[1] object-contain w-5 self-stretch my-auto"
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
  );
};

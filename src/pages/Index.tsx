import React from 'react';
import { Header } from '@/components/Header';
import { BrandHero } from '@/components/BrandHero';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewFilters } from '@/components/ReviewFilters';
import { Pagination } from '@/components/Pagination';
import { Footer } from '@/components/Footer';

const Index = () => {
  const sampleReviews = [
    {
      author: "Fuat Han Albar",
      date: "5 Ekim 2025",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam eget cursus justo. Maecenas vehicula eu felis ac congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam eget cursus justo. Maecenas vehicula eu felis ac congue.",
      helpful: 10,
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/ed4d506d869550e63301cda115d2a37f3f3d8102?placeholderIfAbsent=true"
    },
    {
      author: "Fuat Han Albar",
      date: "5 Ekim 2025",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam eget cursus justo. Maecenas vehicula eu felis ac congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam eget cursus justo. Maecenas vehicula eu felis ac congue.",
      helpful: 10,
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/a0f8758db9ca5ef168eb5a6438000c9ed8b08414?placeholderIfAbsent=true"
    }
  ];

  const allReviews = Array(6).fill(null).map(() => ({
    author: "Fuat Han Albar",
    date: "Bir gün önce",
    location: "İstanbul • 3 yorum",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam eget cursus justo. Maecenas vehicula eu felis ac congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit. Praesent nec nisi eu nisl consequat tincidunt.",
    helpful: 10,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314?placeholderIfAbsent=true"
  }));

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center pb-[184px] rounded-[32px] max-md:pb-[100px]">
      <Header />

      <main className="w-full max-w-[1357px] px-4">
        <BrandHero />

        {/* User Review Section */}
        <section className="mt-9">
          <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-none tracking-[-0.56px] text-center max-md:max-w-full">
            Marka Hakkında Yazdığınız Yorum
          </h2>
          <div className="bg-[rgba(253,253,253,1)] shadow-[0px_6px_10px_rgba(177,177,177,0.08)] border border flex flex-col items-stretch text-xs font-medium mr-[43px] mt-[5px] py-[23px] rounded-[26px] border-solid max-md:max-w-full max-md:mr-2.5">
            <div className="flex w-full flex-col text-[#6B6B6E] px-[30px] max-md:max-w-full max-md:px-5">
              <div className="flex items-stretch gap-[5px] text-xl text-[#202023] font-semibold text-center leading-[1.4]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ed4d506d869550e63301cda115d2a37f3f3d8102?placeholderIfAbsent=true"
                  alt="User avatar"
                  className="aspect-[1] object-contain w-[41px] shrink-0 rounded-[50%]"
                />
                <div className="text-[#202023] basis-auto">
                  Fuat Han Albar
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/985808fc9f99c5d1e1a76b39516ff8232cc5213c?placeholderIfAbsent=true"
                  alt="Verified"
                  className="aspect-[0.85] object-contain w-[11px] shrink-0 my-auto"
                />
              </div>
              <div className="text-[#6B6B6E] mt-[11px]">
                5 Ekim 2025
              </div>
              <p className="text-[rgba(65,65,65,1)] font-normal leading-[18px] tracking-[-0.48px] self-stretch mt-[39px] max-md:max-w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent nibh justo, blandit eu consectetur sit amet, iaculis in
                velit. Praesent nec nisi eu nisl consequat tincidunt. Aliquam
                laoreet ex elit, eu eleifend dui maximus in. Mauris ut quam vel
                neque gravida faucibus. Etiam eget cursus justo. Maecenas
                vehicula eu felis ac congue. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Praesent nibh justo, blandit eu
                consectetur sit amet, iaculis in velit. Praesent nec nisi eu
                nisl consequat tincidunt. Aliquam laoreet ex elit, eu eleifend
                dui maximus in. Mauris ut quam vel neque gravida faucibus. Etiam
                eget cursus justo. Maecenas vehicula eu felis ac congue.
              </p>
              <div className="flex items-stretch gap-2.5 text-[9px] mt-[29px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/95979003369fcb4fbb57385270dd0c9f990d82c8?placeholderIfAbsent=true"
                  alt="Helpful"
                  className="aspect-[1] object-contain w-[26px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] shrink-0 rounded-[60px]"
                />
                <div className="text-[#6B6B6E] my-auto">
                  Yararlı <span className="font-semibold">10</span>
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/188d2125fbabc22270598057a31a444131378ac8?placeholderIfAbsent=true"
                  alt="Share"
                  className="aspect-[1] object-contain w-[26px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] shrink-0 rounded-[60px]"
                />
                <div className="text-[#6B6B6E] my-auto">
                  Paylaş
                </div>
              </div>
            </div>
            <button className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 text-black text-center tracking-[-0.48px] leading-loose justify-center mr-9 px-2.5 py-1 rounded-md max-md:mr-2.5 hover:bg-[rgba(0,0,0,0.08)] transition-colors self-end">
              <span className="self-stretch my-auto">
                Tamamını Gör
              </span>
            </button>
          </div>
        </section>

        {/* Featured Reviews Section */}
        <section className="mt-[30px]">
          <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-none tracking-[-0.56px] text-center ml-[15px] max-md:ml-2.5">
            Öne Çıkan Yorumlar
          </h2>
          <div className="mr-[43px] mt-[30px] max-md:max-w-full max-md:mr-2.5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              {sampleReviews.map((review, index) => (
                <div key={index} className="w-6/12 max-md:w-full max-md:ml-0">
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Reviews Section */}
        <section className="mr-[43px] mt-[30px] max-md:max-w-full max-md:mr-2.5">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[71%] max-md:w-full max-md:ml-0">
              <div className="w-full max-md:max-w-full max-md:mt-8">
                <div className="max-md:max-w-full max-md:mr-2.5">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                    <div className="w-6/12 max-md:w-full max-md:ml-0">
                      <ReviewFilters />
                    </div>
                    <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="w-full mt-[50px] max-md:max-w-full max-md:mt-10">
                        <div className="flex w-full flex-col items-stretch text-xs text-black font-medium text-center tracking-[-0.48px] leading-loose pl-11 pr-[5px] max-md:max-w-full max-md:pl-5">
                          <div>Öne Çıkan Konular</div>
                          <div className="flex w-full items-stretch gap-0.5 mt-[7px] flex-wrap">
                            {['hizmet', 'kredi kartı', 'dolandırıcılık', 'öneri', 'teşekkür', 'şikayet'].map((topic) => (
                              <button
                                key={topic}
                                className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md hover:bg-[rgba(0,0,0,0.08)] transition-colors"
                              >
                                <span className="self-stretch my-auto">
                                  {topic}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex w-full items-stretch gap-5 text-sm font-normal leading-none justify-between mt-[62px] max-md:max-w-full max-md:mt-10">
                          <button className="justify-center items-center border flex gap-2 overflow-hidden text-[#99B2C6] whitespace-nowrap bg-[#F1F5F7] px-4 py-2.5 rounded-[0_8px_8px_0] border-solid border-[#D9E1E7] hover:bg-white hover:text-[#17181A] transition-colors">
                            <span className="text-[#99B2C6] self-stretch my-auto">
                              5-Harika
                            </span>
                          </button>
                          <div className="flex gap-[-1px] rounded-lg">
                            <button className="justify-center items-center border flex gap-2 overflow-hidden text-[#17181A] w-[100px] bg-white px-4 py-2.5 rounded-[8px_0_0_8px] border-solid border-[#D9E1E7] hover:bg-gray-50 transition-colors">
                              <span className="text-[#17181A] self-stretch my-auto">
                                En Eski
                              </span>
                            </button>
                            <button className="justify-center items-center border flex gap-2 overflow-hidden text-[#99B2C6] w-[100px] bg-[#F1F5F7] px-4 py-2.5 border-solid border-[#D9E1E7] hover:bg-white hover:text-[#17181A] transition-colors">
                              <span className="text-[#99B2C6] self-stretch my-auto">
                                En Yeni
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="mt-[58px] max-md:max-w-full max-md:mt-10">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                    <div className="w-6/12 max-md:w-full max-md:ml-0">
                      <div className="flex w-full flex-col items-stretch mt-1.5 max-md:max-w-full space-y-8">
                        {allReviews.slice(0, 3).map((review, index) => (
                          <article key={index} className="w-full">
                            <div className="flex w-full items-stretch gap-[40px_65px]">
                              <div className="flex items-stretch gap-[13px] grow shrink basis-auto">
                                <img
                                  src={review.avatar}
                                  alt={`${review.author} avatar`}
                                  className="aspect-[1] object-contain w-[52px] shrink-0 my-auto rounded-[50%]"
                                />
                                <div className="flex flex-col items-stretch">
                                  <div className="flex items-stretch gap-[7px] text-[26px] text-[#202023] font-semibold text-center leading-[1.4]">
                                    <div className="text-[#202023] grow">
                                      {review.author}
                                    </div>
                                    <img
                                      src="https://api.builder.io/api/v1/image/assets/TEMP/985808fc9f99c5d1e1a76b39516ff8232cc5213c?placeholderIfAbsent=true"
                                      alt="Verified"
                                      className="aspect-[0.85] object-contain w-[11px] shrink-0 mt-3.5"
                                    />
                                  </div>
                                  <div className="text-[#6B6B6E] text-base font-medium mt-2">
                                    {review.location}
                                  </div>
                                </div>
                              </div>
                              <div className="text-[#6B6B6E] text-[13px] font-medium my-auto">
                                {review.date}
                              </div>
                            </div>
                            <p className="text-[rgba(65,65,65,1)] text-xs font-normal leading-[18px] tracking-[-0.48px] mt-11 max-md:mt-10">
                              {review.content}
                            </p>
                            <div className="flex w-full gap-5 text-[9px] text-[#6B6B6E] font-medium justify-between mt-2 max-md:mr-[5px]">
                              <div className="flex gap-[31px]">
                                <button className="flex items-stretch gap-[5px] hover:opacity-70 transition-opacity">
                                  <img
                                    src="https://api.builder.io/api/v1/image/assets/TEMP/07dc1f4467d8862ae84366171051235f3f317d39?placeholderIfAbsent=true"
                                    alt="Helpful"
                                    className="aspect-[1] object-contain w-3.5 shrink-0"
                                  />
                                  <span className="text-[#6B6B6E]">
                                    Yararlı <span className="font-semibold">{review.helpful}</span>
                                  </span>
                                </button>
                                <button className="flex items-stretch gap-[7px] whitespace-nowrap hover:opacity-70 transition-opacity">
                                  <img
                                    src="https://api.builder.io/api/v1/image/assets/TEMP/a79bac48bbf0a5e04f1ea45591c2195ef4e1848f?placeholderIfAbsent=true"
                                    alt="Share"
                                    className="aspect-[1] object-contain w-3.5 shrink-0"
                                  />
                                  <span className="text-[#6B6B6E]">
                                    Paylaş
                                  </span>
                                </button>
                              </div>
                              <img
                                src="https://api.builder.io/api/v1/image/assets/TEMP/2782f7a3b0e38be65d6c730a414fb34102b806d9?placeholderIfAbsent=true"
                                alt="More options"
                                className="aspect-[0.75] object-contain w-3 shrink-0"
                              />
                            </div>
                            {index < 2 && (
                              <hr className="w-full mt-[31px] border-t border-gray-200" />
                            )}
                          </article>
                        ))}
                      </div>
                    </div>
                    <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="w-full">
                        <div className="flex w-full flex-col items-stretch mt-1.5 max-md:max-w-full space-y-8">
                          {allReviews.slice(3, 6).map((review, index) => (
                            <article key={index} className="w-full">
                              <div className="flex w-full items-stretch gap-[40px_70px]">
                                <div className="flex items-stretch gap-[13px] grow shrink basis-auto">
                                  <img
                                    src={review.avatar}
                                    alt={`${review.author} avatar`}
                                    className="aspect-[1] object-contain w-[52px] shrink-0 my-auto rounded-[50%]"
                                  />
                                  <div className="flex flex-col items-stretch">
                                    <div className="flex items-stretch gap-[7px] text-[26px] text-[#202023] font-semibold text-center leading-[1.4]">
                                      <div className="text-[#202023] grow">
                                        {review.author}
                                      </div>
                                      <img
                                        src="https://api.builder.io/api/v1/image/assets/TEMP/985808fc9f99c5d1e1a76b39516ff8232cc5213c?placeholderIfAbsent=true"
                                        alt="Verified"
                                        className="aspect-[0.85] object-contain w-[11px] shrink-0 mt-3.5"
                                      />
                                    </div>
                                    <div className="text-[#6B6B6E] text-base font-medium mt-2">
                                      {review.location}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[#6B6B6E] text-[13px] font-medium my-auto">
                                  {review.date}
                                </div>
                              </div>
                              <p className="text-[rgba(65,65,65,1)] text-xs font-normal leading-[18px] tracking-[-0.48px] mt-11 max-md:mr-[5px] max-md:mt-10">
                                {review.content}
                              </p>
                              <div className="flex w-full gap-5 text-[9px] text-[#6B6B6E] font-medium justify-between mt-2 max-md:mr-[5px]">
                                <div className="flex gap-[31px]">
                                  <button className="flex items-stretch gap-[5px] hover:opacity-70 transition-opacity">
                                    <img
                                      src="https://api.builder.io/api/v1/image/assets/TEMP/36604c57b9a3d63686bccbb1e83e92e6ea560faf?placeholderIfAbsent=true"
                                      alt="Helpful"
                                      className="aspect-[1] object-contain w-3.5 shrink-0"
                                    />
                                    <span className="text-[#6B6B6E]">
                                      Yararlı <span className="font-semibold">{review.helpful}</span>
                                    </span>
                                  </button>
                                  <button className="flex items-stretch gap-[7px] whitespace-nowrap hover:opacity-70 transition-opacity">
                                    <img
                                      src="https://api.builder.io/api/v1/image/assets/TEMP/9a6a3537a6621d8c71eae8ea5e8d58615936b07a?placeholderIfAbsent=true"
                                      alt="Share"
                                      className="aspect-[1] object-contain w-3.5 shrink-0"
                                    />
                                    <span className="text-[#6B6B6E]">
                                      Paylaş
                                    </span>
                                  </button>
                                </div>
                                <img
                                  src="https://api.builder.io/api/v1/image/assets/TEMP/2782f7a3b0e38be65d6c730a414fb34102b806d9?placeholderIfAbsent=true"
                                  alt="More options"
                                  className="aspect-[0.75] object-contain w-3 shrink-0"
                                />
                              </div>
                              {index < 2 && (
                                <hr className="w-full mt-[31px] border-t border-gray-200" />
                              )}
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[29%] ml-5 max-md:w-full max-md:ml-0">
              <aside className="flex w-full flex-col items-stretch text-xs text-[rgba(36,36,36,1)] font-normal text-center tracking-[-0.48px] leading-loose mt-7 max-md:mt-10">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/4345cc82038152849a7492f7db5b151115b3552e?placeholderIfAbsent=true"
                  alt="Advertisement"
                  className="aspect-[1.57] object-contain w-full max-md:mr-[5px]"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ba5d1392e0927b72ae819d9309cbb985f62268d2?placeholderIfAbsent=true"
                  alt="Advertisement"
                  className="aspect-[2.49] object-contain w-full mt-[18px] max-md:ml-[3px]"
                />
                <div className="flex items-stretch gap-1 mt-[9px] max-md:mr-[5px]">
                  <div className="grow">
                    Güvenilirmi.com yorumları nasıl yayınlar?
                  </div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/6bf5ccc4678e8e6600a938500d53c01b56ba819e?placeholderIfAbsent=true"
                    alt="External link"
                    className="aspect-[1] object-contain w-2 shrink-0 my-auto"
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Pagination />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

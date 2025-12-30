import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="justify-between items-center self-stretch flex w-full gap-[40px_100px] text-sm flex-wrap bg-white px-10 py-5 max-md:max-w-full max-md:px-5">
      <nav className="self-stretch flex min-w-60 items-center gap-[40px_64px] text-[#202023] font-medium whitespace-nowrap my-auto">
        <div className="self-stretch flex min-w-60 items-center my-auto">
          <div className="self-stretch flex min-h-9 items-center gap-2.5 justify-center my-auto px-3 py-2">
            <div className="text-[#202023] self-stretch my-auto">
              Manifesto
            </div>
          </div>
          <div className="self-stretch flex min-h-9 items-center gap-2.5 justify-center my-auto px-3 py-2">
            <div className="text-[#202023] self-stretch my-auto">
              Kategoriler
            </div>
          </div>
          <div className="self-stretch flex min-h-9 gap-2.5 my-auto" />
        </div>
      </nav>
      <div className="self-stretch flex min-w-60 items-center gap-3 font-semibold my-auto">
        <button className="justify-center items-center border self-stretch flex min-h-11 gap-2 text-[#D9D9D9] my-auto px-4 py-2 rounded-[44px] border-solid border-[#E2E8E2] hover:bg-gray-50 transition-colors">
          <div className="text-[#D9D9D9] self-stretch my-auto">
            Giriş Yap/Kayıt Ol
          </div>
        </button>
        <button className="justify-center items-center bg-[#0D062D] self-stretch flex min-h-11 gap-2 text-white my-auto px-4 py-2 rounded-[44px] hover:bg-[#1a1147] transition-colors">
          <div className="text-white self-stretch my-auto">
            İşletmem İçin
          </div>
        </button>
      </div>
    </header>
  );
};

import React from "react";
import Link from "next/link";
import Image from "next/image";

//justify-between flex items-center

const Header = () => {
  return (
    <header
      className="w-[1440px] h-[208px] bg-cover bg-center"
      style={{
        backgroundImage: `url('/assets/header-mask.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <div className="flex ml-[162px] mb-[119px] items-center">
        <Image src="/assets/logo.svg" alt="Logo" width={240} height={57} />
      </div>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4 mb-[146px] ml-[1155px] w-[123px] h-[30px]">
          <li>
            <Link
              href="/"
              className="font-sans font-semibold text-[18px] text-white"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="font-sans font-semibold text-[18px] text-white"
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

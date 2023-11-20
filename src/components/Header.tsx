import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const router = useRouter();
  return (
    <header
      className="relative w-full h-[208px] bg-cover bg-center"
      style={{
        backgroundImage: `url('/assets/header-mask.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex mt-[32px] gap-10 mx-auto justify-center">
        {/* Logo */}
        <div className="flex mb-[119px] w-[451px] items-center">
          <Image src="/assets/sb-logo.svg" alt="Logo" width={240} height={57} />
        </div>

        {/* Navigation */}
        <nav className="w-[642px] h-[30px]">
          <ul className="flex space-x-8 mb-[146px] justify-end">
            <li className="relative">
              <Link
                href="/"
                passHref
                className="font-sans font-semibold text-[18px] text-white"
              >
                Home
              </Link>
              {router.pathname === "/" && (
                <div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-nav-border-orange"></div>
              )}
            </li>
            <li className="relative">
              <Link
                href="/blog"
                passHref
                className="font-sans font-semibold text-[18px] text-white"
              >
                Blog
              </Link>
              {router.pathname === "/blog" && (
                <div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-nav-border-orange"></div>
              )}
            </li>
          </ul>
        </nav>
        <div className="absolute top-[133px] font-sans text-[48px] font-bold text-white h-[62px] text-center tracking-normal">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;

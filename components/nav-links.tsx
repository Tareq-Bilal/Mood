import React from "react";
import Link from "next/link";
import { Notebook, History, Bookmark } from "lucide-react";

interface NavLinksProps {
  onLinkClick?: () => void;
  showIcons?: boolean;
}

const NavLinks = ({ onLinkClick, showIcons = true }: NavLinksProps) => {
  return (
    <ul className="mt-8 flex flex-col pl-0.5 gap-6">
      <Link href="/journal" onClick={onLinkClick}>
        <li className="hover:text-indigo-500 cursor-pointer text-base">
          {showIcons && <Notebook className="inline mr-2 size-5 mb-1" />}
          Journals
        </li>
      </Link>
      <Link href="/history" onClick={onLinkClick}>
        <li className="hover:text-indigo-500 cursor-pointer text-base">
          {showIcons && <History className="inline mr-2 size-5 mb-1" />}
          History
        </li>
      </Link>
      <Link href="/bookmarks" onClick={onLinkClick}>
        <li className="hover:text-indigo-500 cursor-pointer text-base">
          {showIcons && <Bookmark className="inline mr-2 size-5 mb-1" />}
          Bookmarks
        </li>
      </Link>
    </ul>
  );
};

export default NavLinks;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { AlignJustify, CircleUserRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function Header() {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Menu = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "Artist",
      path: "/artist",
    },
    {
      id: 2,
      name: "Registration",
      path: "/registration",
    },
    // {
    //   id: 3,
    //   name: "Contact Us",
    //   path: "/",
    // },
  ];

  return (
    <div className="flex items-center justify-between p-4 shadow-sm bg-white">
      <div className="flex items-center gap-10">
        <Link href="/">
          <h1 className="font-bold text-4xl text-primary">Gigsar</h1>
        </Link>
        <ul className="hidden md:flex gap-8">
          {Menu.map((item, index) => (
            <Link href={item.path} key={index}>
              <li className="hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out">
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {isMounted && (
        <div className="md:hidden flex items-center gap-8 md:justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-0">
                <AlignJustify className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="flex flex-col gap-4 p-2">
                {Menu.map((item, index) => (
                  <Link href={item.path} key={index}>
                    <li className="hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out">
                      {item.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
          <div className="md:hidden">
            {user ? (
              <UserButton afterSignOutUrl="/sign-in" />
            ) : (
              <Link href="/sign-in">
                <CircleUserRound className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

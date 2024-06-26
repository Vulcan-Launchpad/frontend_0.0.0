import React from "react";
import dynamic from "next/dynamic";
import HeaderLoader from "@/components/layouts/header/loader";
import SiderLoader from "@/components/layouts/sider/loader";

const Header = dynamic(() => import("@/components/layouts/header"), {
  ssr: false,
  loading: () => <HeaderLoader />,
});
const Sider = dynamic(() => import("@/components/layouts/sider"), {
  ssr: false,
  loading: () => <SiderLoader />,
});

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="p-4 gap-4 flex w-full min-h-[100vh]">
      <Sider />
      <div className="flex grow">
        <div className="w-full h-full flex gap-4 flex-col">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

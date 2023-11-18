import { ReactNode } from "react";

const LadingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-[#111827] overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
    </div>
  );
};

export default LadingLayout;

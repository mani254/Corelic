import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from 'lucide-react';
import React from "react";

interface ActionButtonProps {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={handleClick}
          className="p-2 bg-slate-100 rounded-full w-[35px] cursor-pointer"
        >
          <Ellipsis size={18} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" side="left" sideOffset={10} align="start" alignOffset={0} >
        {children}
      </PopoverContent>
    </Popover>
  );
};

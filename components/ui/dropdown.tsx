import React, { ReactNode, useState, createContext, useContext, cloneElement, ReactElement, useEffect, useRef } from "react";
import clsx from "clsx";

// Context for Dropdown State
const DropdownContext = createContext({ 
  isOpen: false, 
  toggle: () => {},
  close: () => {} 
});

interface DropdownMenuProps {
  children: ReactNode;
}
export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}
export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { toggle } = useContext(DropdownContext);
  
  if (asChild && React.isValidElement(children)) {
    return cloneElement(children, { 
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        toggle();
      } 
    } as React.HTMLAttributes<HTMLElement>);
  }
  
  return (
    <button onClick={toggle} className="trigger-class">
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: ReactNode;
  className?: string;
}
export function DropdownMenuContent({ children, className }: DropdownMenuContentProps) {
  const { isOpen, close } = useContext(DropdownContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={clsx(
        "absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-md border z-50",
        className
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  asChild?: boolean;
}
export function DropdownMenuItem({ children, asChild }: DropdownMenuItemProps) {
  const { close } = useContext(DropdownContext);

  const handleClick = () => {
    close();
  };

  if (asChild && React.isValidElement(children)) {
    return cloneElement(children, { 
      onClick: (e: React.MouseEvent) => {
        handleClick();
        (children.props.onClick as any)?.(e);
      },
      className: clsx(
        "px-4 py-2 hover:bg-gray-100 cursor-pointer",
        children.props.className
      )
    } as React.HTMLAttributes<HTMLElement>);
  }
  
  return (
    <div 
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t my-1" role="separator" />;
}
import { create } from "zustand";

type SidebarState = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsMobileOpen: (isOpen: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isExpanded: true,
  isMobileOpen: false,
  isHovered: false,
  isMobile: false,
  activeItem: null,
  openSubmenu: null,

  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setIsHovered: (isHovered) => set({ isHovered }),
  setActiveItem: (item) => set({ activeItem: item }),
  toggleSubmenu: (item) =>
    set((state) => ({
      openSubmenu: state.openSubmenu === item ? null : item,
    })),
  setIsMobile: (isMobile) => set({ isMobile }),
  setIsExpanded: (isExpanded) => set({ isExpanded }),
  setIsMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
}));

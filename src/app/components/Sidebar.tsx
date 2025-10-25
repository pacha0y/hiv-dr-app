'use client';

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from 'flowbite-react';
import { usePathname } from 'next/navigation';
import {
  HiChartPie,
  HiOutlineMinusSm,
  HiOutlinePlusSm,
  HiShoppingBag,
  HiUsers,
} from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

const menuItems = [
  { type: 'item', label: 'Dashboard', href: '/', icon: HiChartPie },
  {
    type: 'collapse',
    label: 'Applications',
    icon: HiShoppingBag,
    children: [
      { label: 'Application List', href: '/applications' },
      { label: 'New application', href: '/applications/new' },
    ],
  },
  {
    type: 'collapse',
    label: 'Experts',
    icon: HiUsers,
    children: [
      { label: 'Expert List', href: '/experts' },
      { label: 'New expert', href: '/experts/new' },
    ],
  },
  // { type: "item", label: "Inbox", href: "#", icon: HiInbox },
  // { type: "item", label: "Products", href: "#", icon: HiShoppingBag },
  // { type: "item", label: "Sign In", href: "#", icon: HiArrowSmRight },
  // { type: "item", label: "Sign Up", href: "#", icon: HiTable },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function NavComponent({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar
      aria-label='Sidebar'
      className={`
        fixed md:static top-0 left-0 z-40 h-full 
        bg-gray-100 border-r transform transition-all duration-200 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'} 
        md:translate-x-0
      `}
    >
      <SidebarItems>
        <SidebarItemGroup>
          {menuItems.map((item, idx) =>
            item.type === 'item' ? (
              <SidebarItem
                key={idx}
                href={item.href}
                icon={item.icon}
                className={pathname === item.href ? 'bg-blue-200' : ''}
              >
                {isOpen && item.label}
              </SidebarItem>
            ) : (
              <SidebarCollapse
                key={idx}
                icon={item.icon}
                label={isOpen ? item.label : ''}
                renderChevronIcon={(theme, open) => {
                  if (!isOpen) return <span />;
                  const Icon = open ? HiOutlineMinusSm : HiOutlinePlusSm;
                  return (
                    <Icon
                      className={twMerge(
                        theme.label.icon.open[open ? 'on' : 'off']
                      )}
                    />
                  );
                }}
              >
                {item.children?.map((child, cidx) => (
                  <SidebarItem
                    key={cidx}
                    href={child.href}
                    className={pathname === child.href ? 'bg-blue-200' : ''}
                  >
                    {isOpen && child.label}
                  </SidebarItem>
                ))}
              </SidebarCollapse>
            )
          )}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

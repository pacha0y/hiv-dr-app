'use client';

interface HeaderProps {
  onToggleMenu: () => void;
}

// export default function Header({ onToggleMenu }: HeaderProps) {
//   return (
//     <header className="bg-blue-900 text-white px-6 py-4 shadow flex items-center justify-between">
//       {/* Menu Icon - always visible */}
//       <button
//         onClick={onToggleMenu}
//         className="text-white text-2xl"
//         aria-label="Toggle menu"
//       >
//         ☰
//       </button>

//       <h1 className="text-lg font-bold">HDR Application System</h1>

//       <nav className="hidden md:flex space-x-4">
//         <Link href="/">Home</Link>
//         <Link href="/applications/new">Submit</Link>
//         <Link href="/reports">Reports</Link>
//       </nav>
//     </header>
//   );
// }

import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarToggle,
} from 'flowbite-react';
import { useRouter } from 'next/navigation';

export default function Header({ onToggleMenu }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/users/login');
  };

  return (
    <Navbar fluid rounded>
      <button
        onClick={onToggleMenu}
        className='text-white text-2xl'
        aria-label='Toggle menu'
      >
        ☰
      </button>
      <NavbarBrand>
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          HDR Application System
        </span>
      </NavbarBrand>
      <div className='flex md:order-2'>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt='User settings'
              img='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className='block text-sm'>Don Joe</span>
            <span className='block truncate text-sm font-medium'>
              email@example.com
            </span>
          </DropdownHeader>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
    </Navbar>
  );
}

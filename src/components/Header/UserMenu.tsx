
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './UserAvatar';

interface UserMenuProps {
  user: {
    id: string;
    display_name?: string;
    username?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="rounded-full p-0 h-10 w-10 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <UserAvatar 
            userId={user.id} 
            username={user.username} 
            displayName={user.display_name} 
            email={user.email} 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-blue-800/90 backdrop-blur-sm border-blue-700 text-white">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.display_name || user.username || 'User'}</p>
            <p className="text-xs leading-none text-blue-300/90">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-700/50" />
        <DropdownMenuItem 
          className="text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate('/update-password')}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Update Password</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-700/50" />
        <DropdownMenuItem 
          className="text-white hover:bg-blue-700 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

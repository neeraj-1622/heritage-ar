
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

interface UserAvatarProps {
  userId?: string;
  username?: string;
  displayName?: string;
  email?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userId, 
  username = '', 
  displayName = '',
  email = ''
}) => {
  const [userDisplayName, setUserDisplayName] = useState<string>(displayName || username || 'User');
  const [userEmail, setUserEmail] = useState<string>(email || '');
  const [avatarColor, setAvatarColor] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, username, email')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUserDisplayName(displayName || username || 'User');
          setUserEmail(email || '');
          
          if (!avatarColor) {
            setAvatarColor(getAvatarColor(displayName || username || 'User'));
          }
        } else if (data) {
          setUserDisplayName(data.display_name || data.username || 'User');
          setUserEmail(data.email || email || '');
          
          if (!avatarColor) {
            setAvatarColor(getAvatarColor(data.display_name || data.username || 'User'));
          }
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
        setUserDisplayName(displayName || username || 'User');
        setUserEmail(email || '');
        
        if (!avatarColor) {
          setAvatarColor(getAvatarColor(displayName || username || 'User'));
        }
      }
    };

    fetchUserProfile();
  }, [userId, displayName, username, email]);

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username: string) => {
    const blueColors = [
      'bg-blue-800', 'bg-blue-700', 'bg-indigo-800', 
      'bg-indigo-700', 'bg-blue-900'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % blueColors.length;
    return blueColors[index];
  };

  return (
    <Avatar className="h-10 w-10 border-2 border-accent/30">
      <AvatarFallback className={`${avatarColor || 'bg-blue-800'} text-white font-medium`}>
        {getInitials(userDisplayName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

import React, { useEffect, useState } from 'react';
import { verifyDatabaseSetup } from '@/lib/supabase';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

export function DatabaseTest() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const checkDatabase = async () => {
    try {
      const result = await verifyDatabaseSetup();
      setIsVerified(result);
      if (result) {
        toast({
          title: "Database Setup Verified",
          description: "All tables are properly configured and accessible.",
        });
      } else {
        toast({
          title: "Database Setup Error",
          description: "There was an error accessing the database tables.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking database:', error);
      toast({
        title: "Database Check Error",
        description: "An error occurred while checking the database setup.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <Button onClick={checkDatabase}>
        Verify Database Setup
      </Button>
      {isVerified !== null && (
        <div className="mt-4">
          <p className={isVerified ? "text-green-500" : "text-red-500"}>
            Database Status: {isVerified ? "Verified" : "Error"}
          </p>
        </div>
      )}
    </div>
  );
} 
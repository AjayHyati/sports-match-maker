"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast"

type JoinedMatchesContextType = {
  joinedMatchIds: Set<number>;
  joinMatch: (matchId: number) => void;
  leaveMatch: (matchId: number) => void;
  isJoined: (matchId: number) => boolean;
};

const JoinedMatchesContext = createContext<JoinedMatchesContextType | undefined>(undefined);

export const JoinedMatchesProvider = ({ children }: { children: React.ReactNode }) => {
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const joinMatch = useCallback((matchId: number) => {
    setJoinedMatchIds(prev => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
    toast({
        title: "Match Joined!",
        description: "You've successfully joined the match.",
    })
  }, [toast]);

  const leaveMatch = useCallback((matchId: number) => {
    setJoinedMatchIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(matchId);
      return newSet;
    });
     toast({
        title: "Left Match",
        description: "You have left the match.",
        variant: "destructive"
    })
  }, [toast]);

  const isJoined = useCallback((matchId: number) => {
    return joinedMatchIds.has(matchId);
  }, [joinedMatchIds]);

  return (
    <JoinedMatchesContext.Provider value={{ joinedMatchIds, joinMatch, leaveMatch, isJoined }}>
      {children}
    </JoinedMatchesContext.Provider>
  );
};

export const useJoinedMatches = () => {
  const context = useContext(JoinedMatchesContext);
  if (context === undefined) {
    throw new Error('useJoinedMatches must be used within a JoinedMatchesProvider');
  }
  return context;
};

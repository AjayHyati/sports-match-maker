"use client"

import { useMemo } from 'react';
import { useJoinedMatches } from '@/context/JoinedMatchesContext';
import { allMatches } from '@/lib/data';
import { MatchCard } from '@/components/match-card';
import { ShieldQuestion } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyMatchesPage() {
  const { joinedMatchIds } = useJoinedMatches();

  const myMatches = useMemo(() => {
    return allMatches.filter(match => joinedMatchIds.has(match.id));
  }, [joinedMatchIds]);

  if (myMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center rounded-lg bg-card border border-dashed p-12">
        <ShieldQuestion className="w-16 h-16 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Joined Matches</h2>
        <p className="mt-2 text-muted-foreground">You haven't joined any matches yet. Explore available matches and join one!</p>
        <Button asChild className="mt-4">
            <Link href="/">Explore Matches</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {myMatches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

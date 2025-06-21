"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { allMatches } from '@/lib/data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchCard } from '@/components/match-card';
import { Sport } from '@/lib/types';
import { SportIcons } from '@/components/icons';

const sports: Sport[] = ['Basketball', 'Soccer', 'Tennis'];

export default function AllMatchesPage() {
  const [sportFilter, setSportFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
      const sportMatch = sportFilter === 'All' || match.sport === sportFilter;
      const locationMatch = match.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
                            match.district.toLowerCase().includes(locationFilter.toLowerCase());
      return sportMatch && locationMatch;
    });
  }, [sportFilter, locationFilter]);

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-lg bg-card border">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="location-filter" className="text-sm font-medium">Location</label>
            <div className="relative mt-1">
              <Search className="absolute w-5 h-5 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="location-filter"
                placeholder="Search by location or district..."
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="sport-filter" className="text-sm font-medium">Sport</label>
             <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger id="sport-filter" className="mt-1">
                    <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Sports</SelectItem>
                    {sports.map(sport => {
                        const Icon = SportIcons[sport];
                        return (
                            <SelectItem key={sport} value={sport}>
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {sport}
                                </div>
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMatches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
       {filteredMatches.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-full text-center rounded-lg bg-card border border-dashed p-12">
            <Search className="w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">No Matches Found</h2>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters to find more matches.</p>
        </div>
      )}
    </div>
  );
}

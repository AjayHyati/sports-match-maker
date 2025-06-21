"use client"

import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Users, Calendar } from 'lucide-react';
import { useJoinedMatches } from '@/context/JoinedMatchesContext';
import type { Match } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { SportIcons } from './icons';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const { isJoined, joinMatch, leaveMatch } = useJoinedMatches();
  const hasJoined = isJoined(match.id);
  const SportIcon = SportIcons[match.sport];

  const handleToggleJoin = () => {
    if (hasJoined) {
      leaveMatch(match.id);
    } else {
      joinMatch(match.id);
    }
  };

  const playersPercentage = (match.playersJoined / match.playersNeeded) * 100;

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={match.image}
            alt={match.sport}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={`${match.sport} court`}
          />
          <Badge
            variant="default"
            className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-primary-foreground"
          >
            <SportIcon className="w-4 h-4 mr-2" />
            {match.sport}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={match.avatar} alt={match.organizer} />
            <AvatarFallback>{match.organizer.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-card-foreground">{match.location}</p>
            <p className="text-sm text-muted-foreground">{match.district}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(match.dateTime, 'eee, MMM d')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{format(match.dateTime, 'p')}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-card-foreground">Players</span>
            <span className="text-sm text-muted-foreground">
              {match.playersJoined} / {match.playersNeeded}
            </span>
          </div>
          <Progress value={playersPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleToggleJoin}
          variant={hasJoined ? 'secondary' : 'default'}
          className="w-full"
        >
          <Users className="w-4 h-4 mr-2" />
          {hasJoined ? 'Leave Match' : 'Join Match'}
        </Button>
      </CardFooter>
    </Card>
  );
}

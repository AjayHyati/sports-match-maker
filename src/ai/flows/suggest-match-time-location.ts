'use server';
/**
 * @fileOverview An AI agent that suggests optimal times and locations for new matches.
 *
 * - suggestMatchTimeLocation - A function that handles the suggestion process.
 * - SuggestMatchTimeLocationInput - The input type for the suggestMatchTimeLocation function.
 * - SuggestMatchTimeLocationOutput - The return type for the suggestMatchTimeLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMatchTimeLocationInputSchema = z.object({
  sport: z.string().describe('The sport being played (e.g., basketball, soccer, tennis).'),
  generalLocation: z.string().describe('The general location where the match will be played (e.g., "Palo Alto", "Golden Gate Park").'),
  preferredDays: z.array(z.string()).describe('The preferred days of the week for the match (e.g., ["Monday", "Wednesday", "Saturday"]).'),
  userPreferences: z.string().optional().describe('Optional preferences specified by the user (e.g. skill level, match intensity).'),
});
export type SuggestMatchTimeLocationInput = z.infer<typeof SuggestMatchTimeLocationInputSchema>;

const SuggestMatchTimeLocationOutputSchema = z.object({
  suggestedTime: z.string().describe('The suggested time for the match (e.g., "6:00 PM").'),
  suggestedLocation: z.string().describe('The suggested specific location for the match (e.g., "Mitchell Park basketball courts").'),
  reasoning: z.string().describe('The reasoning behind the suggested time and location.'),
});
export type SuggestMatchTimeLocationOutput = z.infer<typeof SuggestMatchTimeLocationOutputSchema>;

export async function suggestMatchTimeLocation(input: SuggestMatchTimeLocationInput): Promise<SuggestMatchTimeLocationOutput> {
  return suggestMatchTimeLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMatchTimeLocationPrompt',
  input: {schema: SuggestMatchTimeLocationInputSchema},
  output: {schema: SuggestMatchTimeLocationOutputSchema},
  prompt: `You are an AI assistant designed to suggest optimal times and locations for sports matches.

You will be given the sport, general location, preferred days, and user preferences, and you will suggest a specific time and location for the match.

Sport: {{{sport}}}
General Location: {{{generalLocation}}}
Preferred Days: {{#each preferredDays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
User Preferences: {{{userPreferences}}}

Consider popular local spots and common times for the specified sport in the given location.
Explain your reasoning.

Output the suggested time, suggested location, and reasoning in a structured format.

{{outputFormatInstructions}}`,
});

const suggestMatchTimeLocationFlow = ai.defineFlow(
  {
    name: 'suggestMatchTimeLocationFlow',
    inputSchema: SuggestMatchTimeLocationInputSchema,
    outputSchema: SuggestMatchTimeLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

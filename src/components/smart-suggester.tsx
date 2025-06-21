"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  SuggestMatchTimeLocationInput,
  SuggestMatchTimeLocationOutput,
  suggestMatchTimeLocation,
} from "@/ai/flows/suggest-match-time-location"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { SportIcons } from "./icons"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  sport: z.enum(["Basketball", "Soccer", "Tennis"], {
    required_error: "Please select a sport.",
  }),
  generalLocation: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  preferredDays: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one day.",
  }),
  userPreferences: z.string().optional(),
})

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SmartSuggester({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [suggestion, setSuggestion] = React.useState<SuggestMatchTimeLocationOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      generalLocation: "",
      preferredDays: [],
      userPreferences: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setSuggestion(null)
    try {
      const result = await suggestMatchTimeLocation(values as SuggestMatchTimeLocationInput)
      setSuggestion(result)
    } catch (error) {
      console.error("Error getting suggestion:", error)
      // Optionally, show an error toast
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    form.reset();
    setSuggestion(null);
  }

  const SportIcon = suggestion ? SportIcons[suggestion.suggestedLocation.includes('tennis') ? 'Tennis' : suggestion.suggestedLocation.includes('basketball') ? 'Basketball' : 'Soccer'] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            Smart Match Suggester
          </DialogTitle>
          <DialogDescription>
            Let our AI find the perfect time and place for your next match.
          </DialogDescription>
        </DialogHeader>

        {!suggestion && !loading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport to play" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="Tennis">Tennis</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="generalLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Golden Gate Park, SF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Preferred Days</FormLabel>
                      <FormDescription>
                        Select the days you'd like to play.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="preferredDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), day])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {day.substring(0,3)}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., competitive play, beginner-friendly, after 6 PM"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Get Suggestion</Button>
            </form>
          </Form>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Our AI is finding the best spot...</p>
          </div>
        )}

        {suggestion && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-background">
               <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {SportIcon && <SportIcon className="w-6 h-6 text-primary" />}
                  Suggestion Found!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">{suggestion.suggestedLocation}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Time</h3>
                    <p className="text-muted-foreground">{suggestion.suggestedTime}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Reasoning</h3>
                    <p className="text-sm text-muted-foreground italic">"{suggestion.reasoning}"</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleReset} className="w-full">Try Again</Button>
                <Button onClick={() => setOpen(false)} className="w-full">Create Match</Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}

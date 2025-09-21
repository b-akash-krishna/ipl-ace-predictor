import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Loader2 } from "lucide-react";
import heroImage from "@/assets/cricket-stadium-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom"; // Import Link for navigation

interface MatchPrediction {
  predictedScore: number;
}

interface TeamStats {
  name: string;
  matches: number;
  wins: number;
  win_rate: number;
  avg_score: number;
}

const IPLPredictor = () => {
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [teams, setTeams] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsDataLoading(true);
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("name")
          .order("name", { ascending: true });

        const { data: venuesData, error: venuesError } = await supabase
          .from("venues")
          .select("name")
          .order("name", { ascending: true });

        if (teamsError || venuesError) {
          throw new Error("Failed to fetch dropdown data.");
        }

        const teamsList = teamsData?.map((item) => item.name) || [];
        const venuesList = venuesData?.map((item) => item.name) || [];

        setTeams(teamsList);
        setVenues(venuesList);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load teams and venues. Please try again.",
          variant: "destructive",
        });
        console.error("Fetch error:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    const fetchTeamStats = async () => {
      setIsStatsLoading(true);
      try {
        const { data: statsData, error: statsError } = await supabase
          .from("teams")
          .select("name, matches, wins, win_rate, avg_score")
          .order("win_rate", { ascending: false });

        if (statsError) {
          throw new Error("Failed to fetch team statistics.");
        }

        setTeamStats(statsData as TeamStats[]);
      } catch (error) {
        toast({
          title: "Error fetching stats",
          description: "Could not load team performance statistics. Please try again.",
          variant: "destructive",
        });
        console.error("Fetch error:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchDropdownData();
    fetchTeamStats();
  }, [toast]);

  const generatePrediction = async () => {
    if (!team1 || !team2 || !venue) {
      toast({
        title: "Missing Information",
        description: "Please select both teams and a venue.",
        variant: "destructive",
      });
      return;
    }

    if (team1 === team2) {
      toast({
        title: "Invalid Selection",
        description: "Please select two different teams.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team1,
          team2,
          venue,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed. Please try again later.");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Cricket Stadium"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            IPL Ace Predictor
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
            Use our advanced machine learning model to predict the final score of a match.
          </p>
          <div className="mt-6">
            <Link to="/data-viz">
              <Button variant="secondary" className="text-md">
                View Detailed Match Statistics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Match Prediction Card */}
          <Card className="card-stadium p-8 lg:col-span-2">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">
              Predict the Score
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <p className="absolute -top-6 left-0 text-sm font-semibold text-muted-foreground">Team 1</p>
                <Select value={team1} onValueChange={setTeam1} disabled={isDataLoading || isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isDataLoading ? "Loading teams..." : "Select Team 1"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team} disabled={team === team2}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <p className="absolute -top-6 left-0 text-sm font-semibold text-muted-foreground">Team 2</p>
                <Select value={team2} onValueChange={setTeam2} disabled={isDataLoading || isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isDataLoading ? "Loading teams..." : "Select Team 2"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team} disabled={team === team1}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <p className="absolute -top-6 left-0 text-sm font-semibold text-muted-foreground">Venue</p>
                <Select value={venue} onValueChange={setVenue} disabled={isDataLoading || isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isDataLoading ? "Loading venues..." : "Select Venue"} />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue} value={venue}>
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full py-6 text-lg font-bold"
              onClick={generatePrediction}
              disabled={isLoading || isDataLoading || !team1 || !team2 || !venue}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Score"
              )}
            </Button>
          </Card>

          {/* Prediction Results */}
          {prediction && (
            <Card className="card-stadium p-8 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <Trophy className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Predicted Score</h3>
                <p className="text-6xl font-extrabold text-primary mb-4">{Math.round(prediction.predictedScore)}</p>
                <p className="text-sm text-muted-foreground">
                  The model predicts the team batting first will score this many runs.
                </p>
              </div>
            </Card>
          )}

          {/* Team Statistics */}
          <Card className="card-stadium p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">
              Team Performance Statistics
            </h3>
            <div className="grid gap-4">
              {isStatsLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              ) : (
                teamStats.map((team, index) => (
                  <div key={index} className="stat-card flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{team.name}</h4>
                      <p className="text-sm text-muted-foreground">{team.matches} matches played</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{team.win_rate}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">{Math.round(team.avg_score)}</div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default IPLPredictor;
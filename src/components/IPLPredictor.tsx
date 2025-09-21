import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Loader2,
  TrendingUp,
  Target,
  Users,
  MapPin,
  BarChart3,
  Activity,
  Zap,
  Award,
  Calendar,
  Timer
} from "lucide-react";
import heroImage from "@/assets/cricket-stadium-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

// Types
interface MatchPrediction {
  predictedScore: number;
  team1WinProb?: number;
  team2WinProb?: number;
  confidence?: number;
}
interface TeamStats {
  name: string;
  matches: number;
  wins: number;
  win_rate: number;
  avg_score: number;
}
interface RecentMatch {
  team1: string;
  team2: string;
  venue: string;
  score1: number;
  score2: number;
  winner: string;
}

// UI component
const IPLPredictor = () => {
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [teams, setTeams] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [selectedTab, setSelectedTab] = useState<"predictor" | "stats" | "matches">("predictor");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isRecentMatchesLoading, setIsRecentMatchesLoading] = useState(true);
  const [animateScore, setAnimateScore] = useState(false);
  const { toast } = useToast();

  // Dropdown fetch
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

        if (teamsError || venuesError) throw new Error("Failed to fetch dropdown data.");

        setTeams(teamsData?.map((item) => item.name) || []);
        setVenues(venuesData?.map((item) => item.name) || []);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load teams and venues. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchDropdownData();
  }, [toast]);

  // Team stats fetch
  useEffect(() => {
    const fetchTeamStats = async () => {
      setIsStatsLoading(true);
      try {
        const { data: statsData, error: statsError } = await supabase
          .from("teams")
          .select("name, matches, wins, win_rate, avg_score")
          .order("win_rate", { ascending: false });

        if (statsError) throw new Error("Failed to fetch team statistics.");

        setTeamStats(statsData as TeamStats[]);
      } catch (error) {
        toast({
          title: "Error fetching stats",
          description: "Could not load team performance statistics. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchTeamStats();
  }, [toast]);

  // Recent matches fetch (if you have such a table in your database)
  useEffect(() => {
    const fetchRecentMatches = async () => {
      setIsRecentMatchesLoading(true);
      try {
        // Example: Adjust fields/names as per your supabase schema
        const { data: recent, error } = await supabase
          .from("recent_matches")
          .select("team1, team2, venue, score1, score2, winner")
          .order("id", { ascending: false })
          .limit(8);

        if (error) throw new Error("Failed to fetch recent matches.");
        setRecentMatches(recent || []);
      } catch {
        // Optionally toast error if desired
      } finally {
        setIsRecentMatchesLoading(false);
      }
    };
    fetchRecentMatches();
  }, []);

  // Predict API
  const generatePrediction = async () => {
    if (!team1 || !team2 || !venue) {
      toast({
        title: "Missing Information",
        description: "Please select both teams and a venue.",
        variant: "destructive"
      });
      return;
    }
    if (team1 === team2) {
      toast({
        title: "Invalid Selection",
        description: "Please select two different teams.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setPrediction(null);
    setAnimateScore(false);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team1, team2, venue })
      });

      if (!response.ok) throw new Error("Prediction failed. Please try again later.");
      const data = await response.json();
      setPrediction(data);
      setTimeout(() => setAnimateScore(true), 100); // Triggers CSS animation if any
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unexpected error.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Util helpers (same as mock file)
  const getTeamShortName = (fullName: string) => {
    const shortNames: Record<string, string> = {
      "Mumbai Indians": "MI",
      "Chennai Super Kings": "CSK",
      "Royal Challengers Bangalore": "RCB",
      "Delhi Capitals": "DC",
      "Kolkata Knight Riders": "KKR",
      "Rajasthan Royals": "RR",
      "Punjab Kings": "PBKS",
      "Sunrisers Hyderabad": "SRH",
      "Gujarat Titans": "GT",
      "Lucknow Super Giants": "LSG"
    };
    return shortNames[fullName] || fullName.slice(0, 3).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <img src={heroImage} alt="Cricket Stadium" className="w-full h-full object-cover brightness-50" />
        <div className="absolute inset-0 bg-black bg-opacity-50"/>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-2xl">IPL ACE PREDICTOR</h1>
          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto mb-8 font-light drop-shadow-lg">
            Harness the power of advanced machine learning to predict match outcomes with precision
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Activity className="h-5 w-5 text-green-300" />
              <span className="text-white font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-blue-300" />
              <span className="text-white font-medium">85% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Timer className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-medium">Live Updates</span>
            </div>
          </div>
        </div>
      </section>
      {/* Navigation Tabs */}
      <section>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
            <button
              onClick={() => setSelectedTab("predictor")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedTab === "predictor" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >Predictor</button>
            <button
              onClick={() => setSelectedTab("stats")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedTab === "stats" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >Team Stats</button>
            <button
              onClick={() => setSelectedTab("matches")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedTab === "matches" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >Recent Matches</button>
          </div>
          <div>
            {/* Predictor Tab */}
            {selectedTab === "predictor" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Match Prediction Card */}
                <Card className="lg:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Match Predictor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 flex items-center"><Users className="h-4 w-4 mr-2"/> Team 1</label>
                        <Select value={team1} onValueChange={setTeam1} disabled={isDataLoading || isLoading}>
                          <SelectTrigger className="w-full h-12 border-2 hover:border-blue-300 transition-colors">
                            <SelectValue placeholder={isDataLoading ? "Loading teams..." : "Select Team 1"} />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map(team => (
                              <SelectItem key={team} value={team} disabled={team === team2}>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{getTeamShortName(team)}</Badge>
                                  <span>{team}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 flex items-center"><Users className="h-4 w-4 mr-2" /> Team 2</label>
                        <Select value={team2} onValueChange={setTeam2} disabled={isDataLoading || isLoading}>
                          <SelectTrigger className="w-full h-12 border-2 hover:border-blue-300 transition-colors">
                            <SelectValue placeholder={isDataLoading ? "Loading teams..." : "Select Team 2"} />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map(team => (
                              <SelectItem key={team} value={team} disabled={team === team1}>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{getTeamShortName(team)}</Badge>
                                  <span>{team}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 flex items-center"><MapPin className="h-4 w-4 mr-2" /> Venue</label>
                        <Select value={venue} onValueChange={setVenue} disabled={isDataLoading || isLoading}>
                          <SelectTrigger className="w-full h-12 border-2 hover:border-blue-300 transition-colors">
                            <SelectValue placeholder={isDataLoading ? "Loading venues..." : "Select Venue"} />
                          </SelectTrigger>
                          <SelectContent>
                            {venues.map(venue => (
                              <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={generatePrediction}
                      disabled={isLoading || isDataLoading || !team1 || !team2 || !venue}
                    >
                      {isLoading ? (<><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analyzing Match Data...</>) : (<><Target className="mr-3 h-6 w-6" /> Generate Prediction</>)}
                    </Button>
                  </CardContent>
                </Card>
                {/* Prediction Results */}
                {prediction && (
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Match Prediction</h3>
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 shadow-lg">
                            <p className="text-sm text-gray-600 mb-2">Predicted Score</p>
                            <p className={`text-5xl font-black text-blue-600 transition-all duration-1000 ${animateScore ? "scale-110" : "scale-100"}`}>
                              {Math.round(prediction.predictedScore)}
                            </p>
                          </div>
                          {(typeof prediction.team1WinProb === "number" && typeof prediction.team2WinProb === "number") && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 shadow-md">
                                <p className="text-xs text-gray-600 mb-1">{getTeamShortName(team1)} Win</p>
                                <p className="text-2xl font-bold text-green-600">{prediction.team1WinProb}%</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-md">
                                <p className="text-xs text-gray-600 mb-1">{getTeamShortName(team2)} Win</p>
                                <p className="text-2xl font-bold text-red-600">{prediction.team2WinProb}%</p>
                              </div>
                            </div>
                          )}
                          {typeof prediction.confidence === "number" && (
                            <div className="bg-white rounded-lg p-4 shadow-md">
                              <p className="text-sm text-gray-600 mb-1">Prediction Confidence</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${prediction.confidence}%` }} />
                                </div>
                                <span className="text-sm font-bold text-green-600">{prediction.confidence}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            {/* Team Stats Tab */}
            {selectedTab === "stats" && (
              <div className="grid gap-6">
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center"><BarChart3 className="h-6 w-6 mr-2" />Team Performance Statistics</CardTitle>
                  <div className="flex justify-end mb-4">
                    <Link to="/data-viz">
                      <Button variant="secondary" className="text-md">
                        View Detailed Match Statistics
                      </Button>
                    </Link>
                  </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid gap-4">
                      {isStatsLoading ? (
                        <div className="flex justify-center items-center h-48">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                      ) : (
                        teamStats.map((team, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center space-x-3">
                                <Badge variant="secondary" className="font-bold">{getTeamShortName(team.name)}</Badge>
                                <h4 className="font-semibold text-gray-800">{team.name}</h4>
                                <p className="text-sm text-gray-600">{team.matches} matches, {team.wins} wins</p>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-600">{team.win_rate}%</div>
                                  <div className="text-xs text-gray-500">Win Rate</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-600">{Math.round(team.avg_score)}</div>
                                  <div className="text-xs text-gray-500">Avg Score</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {/* Recent Matches Tab */}
            {selectedTab === "matches" && (
              <div className="grid gap-6">
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center"><Calendar className="h-6 w-6 mr-2" />Recent Match Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {isRecentMatchesLoading ? (
                        <div className="flex justify-center items-center h-48">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                      ) : recentMatches.length > 0 ? (
                        recentMatches.map((match, index) => (
                          <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center space-x-4">
                                <Award className="h-8 w-8 text-yellow-500" />
                                <Badge variant="outline">{getTeamShortName(match.team1)}</Badge>
                                <span className="text-gray-400">vs</span>
                                <Badge variant="outline">{getTeamShortName(match.team2)}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 flex items-center"><MapPin className="h-4 w-4 mr-1" />{match.venue}</p>
                            </div>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="text-center">
                                <div className="text-lg font-bold">{match.score1}</div>
                                <div className="text-xs text-gray-500">{getTeamShortName(match.team1)}</div>
                              </div>
                              <span className="text-gray-400">-</span>
                              <div className="text-center">
                                <div className="text-lg font-bold">{match.score2}</div>
                                <div className="text-xs text-gray-500">{getTeamShortName(match.team2)}</div>
                              </div>
                            </div>
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">{match.winner} Won</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500">No recent matches found.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IPLPredictor;

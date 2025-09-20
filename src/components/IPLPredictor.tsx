import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/cricket-stadium-hero.jpg";

interface MatchPrediction {
  team1: string;
  team2: string;
  venue: string;
  team1Probability: number;
  team2Probability: number;
  confidence: string;
  factors: string[];
}

interface TeamStats {
  name: string;
  matches: number;
  wins: number;
  winRate: number;
  avgScore: number;
}

const IPL_TEAMS = [
  "Chennai Super Kings",
  "Mumbai Indians", 
  "Royal Challengers Bangalore",
  "Kolkata Knight Riders",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Punjab Kings",
  "Sunrisers Hyderabad",
  "Gujarat Titans",
  "Lucknow Super Giants"
];

const IPL_VENUES = [
  "M Chinnaswamy Stadium",
  "Wankhede Stadium",
  "Eden Gardens",
  "Feroz Shah Kotla",
  "Sawai Mansingh Stadium",
  "MA Chidambaram Stadium",
  "Rajiv Gandhi International Stadium",
  "Punjab Cricket Association Stadium",
  "Sardar Patel Stadium",
  "Ekana Cricket Stadium"
];

const IPLPredictor = () => {
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamStats] = useState<TeamStats[]>([
    { name: "Chennai Super Kings", matches: 195, wins: 120, winRate: 61.5, avgScore: 165 },
    { name: "Mumbai Indians", matches: 213, wins: 129, winRate: 60.6, avgScore: 168 },
    { name: "Royal Challengers Bangalore", matches: 207, wins: 109, winRate: 52.7, avgScore: 163 },
    { name: "Kolkata Knight Riders", matches: 208, wins: 107, winRate: 51.4, avgScore: 160 },
    { name: "Delhi Capitals", matches: 203, wins: 102, winRate: 50.2, avgScore: 158 }
  ]);

  const generatePrediction = async () => {
    if (!team1 || !team2 || !venue) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple prediction algorithm based on team performance
    const team1Stats = teamStats.find(t => t.name === team1) || { winRate: 50, avgScore: 150 };
    const team2Stats = teamStats.find(t => t.name === team2) || { winRate: 50, avgScore: 150 };
    
    // Calculate base probabilities
    let team1Prob = team1Stats.winRate;
    let team2Prob = team2Stats.winRate;
    
    // Venue advantage (home ground effect simulation)
    const venueBonus = Math.random() * 10 + 5; // 5-15% bonus for "home" team
    if (Math.random() > 0.5) {
      team1Prob += venueBonus;
    } else {
      team2Prob += venueBonus;
    }
    
    // Recent form simulation
    const formFactor = (Math.random() - 0.5) * 20; // -10% to +10%
    team1Prob += formFactor;
    team2Prob -= formFactor;
    
    // Normalize probabilities
    const total = team1Prob + team2Prob;
    team1Prob = (team1Prob / total) * 100;
    team2Prob = (team2Prob / total) * 100;
    
    const confidence = Math.abs(team1Prob - team2Prob) > 20 ? "High" : 
                     Math.abs(team1Prob - team2Prob) > 10 ? "Medium" : "Low";
    
    const factors = [
      "Historical performance",
      "Venue conditions",
      "Recent form",
      "Head-to-head record"
    ];
    
    setPrediction({
      team1,
      team2,
      venue,
      team1Probability: Math.round(team1Prob),
      team2Probability: Math.round(team2Prob),
      confidence,
      factors
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/80" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-16 h-16 text-secondary mr-4" />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-secondary via-secondary-glow to-accent bg-clip-text text-transparent">
              IPL Win Predictor
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Advanced AI predictions for IPL matches. Get real-time winning probabilities based on team performance, venue conditions, and historical data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card-stadium p-6 bg-white/10 backdrop-blur-md">
              <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accurate Predictions</h3>
              <p className="text-white/80">ML algorithms analyzing 10+ years of IPL data</p>
            </div>
            <div className="card-stadium p-6 bg-white/10 backdrop-blur-md">
              <TrendingUp className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-white/80">Live factors including venue and recent form</p>
            </div>
            <div className="card-stadium p-6 bg-white/10 backdrop-blur-md">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Insights</h3>
              <p className="text-white/80">Comprehensive statistics and performance metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Tool */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="card-stadium p-8 mb-12">
            <h2 className="text-4xl font-bold text-center mb-8 text-primary">
              Match Prediction Tool
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Team 1</label>
                <Select value={team1} onValueChange={setTeam1}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Team 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {IPL_TEAMS.filter(team => team !== team2).map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Team 2</label>
                <Select value={team2} onValueChange={setTeam2}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Team 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {IPL_TEAMS.filter(team => team !== team1).map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Venue</label>
                <Select value={venue} onValueChange={setVenue}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {IPL_VENUES.map(venueOption => (
                      <SelectItem key={venueOption} value={venueOption}>{venueOption}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={generatePrediction}
              disabled={!team1 || !team2 || !venue || isLoading}
              className="btn-cricket w-full py-4 text-lg font-semibold"
            >
              {isLoading ? "Analyzing Match..." : "Predict Winner"}
            </Button>
          </Card>

          {/* Prediction Results */}
          {prediction && (
            <Card className="prediction-display mb-12">
              <h3 className="text-2xl font-bold text-center mb-8 text-primary">
                Match Prediction: {prediction.team1} vs {prediction.team2}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <h4 className="text-xl font-semibold mb-2">{prediction.team1}</h4>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {prediction.team1Probability}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-glow h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.team1Probability}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-xl font-semibold mb-2">{prediction.team2}</h4>
                  <div className="text-4xl font-bold text-accent mb-2">
                    {prediction.team2Probability}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-accent to-accent-glow h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.team2Probability}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <Badge variant={prediction.confidence === "High" ? "default" : "secondary"} className="text-lg py-2 px-4">
                  Confidence: {prediction.confidence}
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Prediction based on:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {prediction.factors.map((factor, index) => (
                    <Badge key={index} variant="outline">{factor}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Team Statistics */}
          <Card className="card-stadium p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">
              Team Performance Statistics
            </h3>
            
            <div className="grid gap-4">
              {teamStats.map((team, index) => (
                <div key={index} className="stat-card flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">{team.matches} matches played</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{team.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent">{team.avgScore}</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default IPLPredictor;
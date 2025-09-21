import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, Trophy, Target, BarChart3, Users, MapPin, Calendar, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';

interface MatchData {
  mid: number;
  date: string;
  venue: string;
  batting_team: string;
  bowling_team: string;
  batsman: string;
  bowler: string;
  runs: number;
  wickets: number;
  overs: number;
  runs_last_5: number;
  wickets_last_5: number;
  striker: number;
  non_striker: number;
  total: number;
}

const COLORS = ['#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#84CC16'];

const DataViz = () => {
  const [data, setData] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("name")
          .order("name", { ascending: true });
        
        const { data: venuesData, error: venuesError } = await supabase
          .from("venues")
          .select("name")
          .order("name", { ascending: true });
        
        const { data: matchData, error: matchError } = await supabase
          .from("all_ipl_data")
          .select("*")
          .order("date", { ascending: true });
          
        if (teamsError || venuesError || matchError) {
          throw new Error("Failed to fetch data.");
        }

        setTeams(teamsData?.map((item) => item.name) || []);
        setVenues(venuesData?.map((item) => item.name) || []);
        setData(matchData as MatchData[]);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load all match data. Please try again.",
          variant: "destructive",
        });
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  
  const filteredData = data.filter(d => 
    (!selectedTeam || d.batting_team === selectedTeam || d.bowling_team === selectedTeam) &&
    (!selectedVenue || d.venue === selectedVenue) &&
    (!selectedYear || new Date(d.date).getFullYear().toString() === selectedYear)
  );

  const years = [...new Set(data.map(d => new Date(d.date).getFullYear().toString()))].sort();

  const clearFilters = () => {
    setSelectedTeam(null);
    setSelectedVenue(null);
    setSelectedYear(null);
  };

  // Team Performance Statistics
  const teamStats = () => {
    const stats = {};
    filteredData.forEach(d => {
      if (!stats[d.batting_team]) {
        stats[d.batting_team] = { matches: 0, totalRuns: 0, totalWickets: 0, innings: [] };
      }
      stats[d.batting_team].matches++;
      stats[d.batting_team].totalRuns += d.total;
      stats[d.batting_team].totalWickets += d.wickets;
      stats[d.batting_team].innings.push(d.total);
    });
    
    return Object.keys(stats).map(team => ({
      team,
      matches: stats[team].matches,
      avgScore: Math.round(stats[team].totalRuns / stats[team].matches),
      avgWickets: (stats[team].totalWickets / stats[team].matches).toFixed(1),
      highestScore: Math.max(...stats[team].innings),
      lowestScore: Math.min(...stats[team].innings)
    })).sort((a, b) => b.avgScore - a.avgScore);
  };

  // Venue Performance
  const venueStats = () => {
    const stats = {};
    filteredData.forEach(d => {
      if (!stats[d.venue]) {
        stats[d.venue] = { matches: 0, totalRuns: 0, scores: [] };
      }
      stats[d.venue].matches++;
      stats[d.venue].totalRuns += d.total;
      stats[d.venue].scores.push(d.total);
    });
    
    return Object.keys(stats).map(venue => ({
      venue: venue.length > 20 ? venue.substring(0, 20) + '...' : venue,
      fullVenue: venue,
      matches: stats[venue].matches,
      avgScore: Math.round(stats[venue].totalRuns / stats[venue].matches),
      highestScore: Math.max(...stats[venue].scores),
      lowestScore: Math.min(...stats[venue].scores)
    })).sort((a, b) => b.avgScore - a.avgScore);
  };

  // Runs Distribution by Overs
  const runsPerOverData = () => {
    const oversData = Array.from({ length: 20 }, (_, i) => ({
      over: i + 1,
      totalRuns: 0,
      totalWickets: 0,
      deliveries: 0
    }));

    filteredData.forEach(d => {
      const overIndex = Math.floor(d.overs);
      if (overIndex >= 0 && overIndex < 20) {
        oversData[overIndex].totalRuns += d.runs;
        oversData[overIndex].totalWickets += d.wickets;
        oversData[overIndex].deliveries++;
      }
    });

    return oversData.map(over => ({
      ...over,
      avgRuns: over.deliveries > 0 ? (over.totalRuns / over.deliveries).toFixed(2) : 0,
      avgWickets: over.deliveries > 0 ? (over.totalWickets / over.deliveries).toFixed(2) : 0
    }));
  };

  // Innings Comparison (First vs Second)
  const inningsComparison = () => {
    const firstInnings = {};
    const secondInnings = {};
    
    // Group matches by match ID
    const matchGroups = {};
    filteredData.forEach(d => {
      if (!matchGroups[d.mid]) {
        matchGroups[d.mid] = [];
      }
      matchGroups[d.mid].push(d);
    });

    Object.values(matchGroups).forEach((match: any) => {
      if (match.length >= 2) {
        // Sort by overs to determine innings order
        const sortedInnings = match.sort((a, b) => a.overs - b.overs);
        const firstInning = sortedInnings[0];
        const secondInning = sortedInnings[sortedInnings.length - 1];

        if (!firstInnings[firstInning.batting_team]) {
          firstInnings[firstInning.batting_team] = { total: 0, count: 0 };
        }
        if (!secondInnings[secondInning.batting_team]) {
          secondInnings[secondInning.batting_team] = { total: 0, count: 0 };
        }

        firstInnings[firstInning.batting_team].total += firstInning.total;
        firstInnings[firstInning.batting_team].count++;
        secondInnings[secondInning.batting_team].total += secondInning.total;
        secondInnings[secondInning.batting_team].count++;
      }
    });

    return teams.map(team => ({
      team,
      firstInnings: firstInnings[team] ? Math.round(firstInnings[team].total / firstInnings[team].count) : 0,
      secondInnings: secondInnings[team] ? Math.round(secondInnings[team].total / secondInnings[team].count) : 0
    })).filter(d => d.firstInnings > 0 || d.secondInnings > 0);
  };

  // Wickets vs Runs Scatter Plot
  const wicketsVsRuns = () => {
    const wicketGroups = {};
    filteredData.forEach(d => {
      if (!wicketGroups[d.wickets]) {
        wicketGroups[d.wickets] = [];
      }
      wicketGroups[d.wickets].push(d.total);
    });

    return Object.keys(wicketGroups).map(wickets => ({
      wickets: parseInt(wickets),
      avgRuns: Math.round(wicketGroups[wickets].reduce((a, b) => a + b, 0) / wicketGroups[wickets].length),
      matches: wicketGroups[wickets].length
    })).sort((a, b) => a.wickets - b.wickets);
  };

  // Team Radar Chart Data
  const teamRadarData = () => {
    const teamMetrics = {};
    
    filteredData.forEach(d => {
      if (!teamMetrics[d.batting_team]) {
        teamMetrics[d.batting_team] = {
          totalRuns: 0,
          totalWickets: 0,
          matches: 0,
          powerplayRuns: 0,
          deathOverRuns: 0
        };
      }
      
      teamMetrics[d.batting_team].totalRuns += d.total;
      teamMetrics[d.batting_team].totalWickets += d.wickets;
      teamMetrics[d.batting_team].matches++;
      
      if (d.overs <= 6) {
        teamMetrics[d.batting_team].powerplayRuns += d.runs;
      } else if (d.overs >= 15) {
        teamMetrics[d.batting_team].deathOverRuns += d.runs;
      }
    });

    return Object.keys(teamMetrics).slice(0, 5).map(team => {
      const metrics = teamMetrics[team];
      return {
        team,
        "Avg Score": Math.round(metrics.totalRuns / metrics.matches),
        "Wicket Rate": Math.round((10 - metrics.totalWickets / metrics.matches) * 10),
        "Powerplay": Math.round(metrics.powerplayRuns / metrics.matches * 5),
        "Death Overs": Math.round(metrics.deathOverRuns / metrics.matches * 3),
        "Consistency": Math.round(Math.random() * 30 + 70)
      };
    });
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "text-primary" }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="flex items-center p-6">
        <div className={`${color} mr-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-24 w-24 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">Loading Cricket Analytics...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
          IPL Cricket Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive statistical analysis and insights from IPL matches with interactive visualizations
        </p>
      </div>

      {/* Filter Controls
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedTeam || ""} onValueChange={(value) => setSelectedTeam(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedVenue || ""} onValueChange={(value) => setSelectedVenue(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Venues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Venues</SelectItem>
                  {venues.map(venue => (
                    <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear || ""} onValueChange={(value) => setSelectedYear(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTeam && <Badge variant="secondary">Team: {selectedTeam}</Badge>}
              {selectedVenue && <Badge variant="secondary">Venue: {selectedVenue}</Badge>}
              {selectedYear && <Badge variant="secondary">Year: {selectedYear}</Badge>}
            </div>
          </CardContent>
        )}
      </Card> */}

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Matches"
          value={new Set(filteredData.map(d => d.mid)).size.toLocaleString()}
          subtitle="Analyzed"
          icon={Trophy}
          color="text-orange-500"
        />
        <StatCard
          title="Teams"
          value={teams.length}
          subtitle="Participating"
          icon={Users}
          color="text-green-500"
        />
        <StatCard
          title="Venues"
          value={venues.length}
          subtitle="Different stadiums"
          icon={MapPin}
          color="text-blue-500"
        />
        <StatCard
          title="Data Points"
          value={filteredData.length.toLocaleString()}
          subtitle="Ball-by-ball records"
          icon={BarChart3}
          color="text-purple-500"
        />
      </div>

      <Tabs defaultValue="teamPerformance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
          <TabsTrigger value="teamPerformance" className="text-xs lg:text-sm">Team Stats</TabsTrigger>
          <TabsTrigger value="venueAnalysis" className="text-xs lg:text-sm">Venue Analysis</TabsTrigger>
          <TabsTrigger value="oversAnalysis" className="text-xs lg:text-sm">Over Analysis</TabsTrigger>
          <TabsTrigger value="inningsComparison" className="text-xs lg:text-sm">Innings</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs lg:text-sm">Advanced</TabsTrigger>
          <TabsTrigger value="dataTable" className="text-xs lg:text-sm">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teamPerformance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Team Performance Comparison
                </CardTitle>
                <CardDescription>Average scores and performance metrics by team</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={teamStats()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `Team: ${label}`}
                    />
                    <Bar dataKey="avgScore" fill="#F97316" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Team Performance Details</CardTitle>
                <CardDescription>Detailed statistics for all teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {teamStats().map((team, index) => (
                    <div key={team.team} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-lg">{team.team}</h4>
                        <p className="text-sm text-muted-foreground">{team.matches} matches</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-orange-500">{team.avgScore}</p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-500">{team.highestScore}</p>
                          <p className="text-xs text-muted-foreground">Highest</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-500">{team.lowestScore}</p>
                          <p className="text-xs text-muted-foreground">Lowest</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="venueAnalysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Venue Performance Analysis
                </CardTitle>
                <CardDescription>Average scores at different venues</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={venueStats().slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="venue" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const venue = venueStats().find(v => v.venue === label);
                        return venue ? venue.fullVenue : label;
                      }}
                    />
                    <Bar dataKey="avgScore" fill="#10B981" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Venue Statistics Distribution</CardTitle>
                <CardDescription>Score distribution across venues</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={venueStats().slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="matches"
                      label={({ venue, matches }) => `${venue}: ${matches}`}
                    >
                      {venueStats().slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="oversAnalysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Runs per Over Analysis
                </CardTitle>
                <CardDescription>Run distribution across different overs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={runsPerOverData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="over" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalRuns" fill="#F97316" name="Total Runs" />
                    <Line type="monotone" dataKey="avgRuns" stroke="#10B981" strokeWidth={3} name="Average Runs" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Wickets vs Runs Correlation</CardTitle>
                <CardDescription>Relationship between wickets lost and total score</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={wicketsVsRuns()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="wickets" name="Wickets" />
                    <YAxis dataKey="avgRuns" name="Average Runs" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                      formatter={(value, name) => [value, name === 'avgRuns' ? 'Average Runs' : name]}
                    />
                    <Scatter dataKey="avgRuns" fill="#8B5CF6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inningsComparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>First vs Second Innings Performance</CardTitle>
                <CardDescription>Comparison of team performance in different innings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={inningsComparison()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="firstInnings" fill="#F97316" name="First Innings" />
                    <Bar dataKey="secondInnings" fill="#10B981" name="Second Innings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Innings Summary</CardTitle>
                <CardDescription>Statistical breakdown by innings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {inningsComparison().map((team, index) => (
                    <div key={team.team} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-2">{team.team}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-500">{team.firstInnings}</p>
                            <p className="text-sm text-muted-foreground">1st Innings Avg</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-500">{team.secondInnings}</p>
                            <p className="text-sm text-muted-foreground">2nd Innings Avg</p>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <Badge variant={team.firstInnings > team.secondInnings ? "default" : "secondary"}>
                            {team.firstInnings > team.secondInnings ? "Better in 1st" : "Better in 2nd"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Team Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional team performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={teamRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="team" />
                    <PolarRadiusAxis angle={90} domain={[0, 200]} />
                    <Radar name="Avg Score" dataKey="Avg Score" stroke="#F97316" fill="#F97316" fillOpacity={0.2} />
                    <Radar name="Powerplay" dataKey="Powerplay" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <Radar name="Death Overs" dataKey="Death Overs" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Score Trends Over Time</CardTitle>
                <CardDescription>Historical score trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={runsPerOverData()}>
                    <defs>
                      <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="over" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="totalRuns" 
                      stroke="#F97316" 
                      fillOpacity={1} 
                      fill="url(#colorRuns)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="dataTable">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Complete Dataset
              </CardTitle>
              <CardDescription>
                Ball-by-ball data with enhanced scrolling - {filteredData.length.toLocaleString()} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="max-h-[600px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background border-b">
                      <TableRow>
                        <TableHead className="min-w-[80px] sticky left-0 bg-background border-r">Match ID</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[200px]">Venue</TableHead>
                        <TableHead className="min-w-[150px]">Batting Team</TableHead>
                        <TableHead className="min-w-[150px]">Bowling Team</TableHead>
                        <TableHead className="min-w-[120px]">Batsman</TableHead>
                        <TableHead className="min-w-[120px]">Bowler</TableHead>
                        <TableHead className="min-w-[80px]">Runs</TableHead>
                        <TableHead className="min-w-[80px]">Wickets</TableHead>
                        <TableHead className="min-w-[80px]">Overs</TableHead>
                        <TableHead className="min-w-[100px]">Runs Last 5</TableHead>
                        <TableHead className="min-w-[100px]">Wickets Last 5</TableHead>
                        <TableHead className="min-w-[80px]">Striker</TableHead>
                        <TableHead className="min-w-[100px]">Non-Striker</TableHead>
                        <TableHead className="min-w-[100px] sticky right-0 bg-background border-l">Total Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="font-medium sticky left-0 bg-background border-r">{row.mid}</TableCell>
                          <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={row.venue}>{row.venue}</TableCell>
                          <TableCell>{row.batting_team}</TableCell>
                          <TableCell>{row.bowling_team}</TableCell>
                          <TableCell>{row.batsman}</TableCell>
                          <TableCell>{row.bowler}</TableCell>
                          <TableCell>
                            <Badge variant={row.runs >= 4 ? "default" : "secondary"}>
                              {row.runs}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={row.wickets > 0 ? "destructive" : "outline"}>
                              {row.wickets}
                            </Badge>
                          </TableCell>
                          <TableCell>{row.overs?.toFixed(1)}</TableCell>
                          <TableCell>{row.runs_last_5}</TableCell>
                          <TableCell>{row.wickets_last_5}</TableCell>
                          <TableCell>{row.striker}</TableCell>
                          <TableCell>{row.non_striker}</TableCell>
                          <TableCell className="font-bold sticky right-0 bg-background border-l">
                            <Badge variant="outline" className="text-lg">
                              {row.total}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Insights Footer */}
      <Card className="mt-8 bg-gradient-to-r from-orange-50 to-green-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cricket Analytics Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <Trophy className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h4 className="font-semibold mb-1">Performance Tracking</h4>
              <p className="text-muted-foreground">
                Track team and player performance across different venues, conditions, and match situations.
              </p>
            </div>
            <div>
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Strategic Analysis</h4>
              <p className="text-muted-foreground">
                Analyze batting and bowling strategies, powerplay utilization, and death over performance.
              </p>
            </div>
            <div>
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Trend Identification</h4>
              <p className="text-muted-foreground">
                Identify scoring trends, venue advantages, and seasonal performance variations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataViz;
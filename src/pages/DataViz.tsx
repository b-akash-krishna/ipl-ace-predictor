import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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

const DataViz = () => {
  const [data, setData] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
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
    (!selectedVenue || d.venue === selectedVenue)
  );

  const runsPerOverData = () => {
    const runsData: { over: number; runs: number; wickets: number; total_runs: number }[] = [];
    filteredData.forEach(d => {
      if (d.overs && d.runs) {
        const over = Math.floor(d.overs) + 1;
        if (!runsData[over]) {
          runsData[over] = { over, runs: 0, wickets: 0, total_runs: 0 };
        }
        runsData[over].runs += d.runs;
        runsData[over].wickets += d.wickets;
        runsData[over].total_runs = d.total;
      }
    });
    return runsData.filter(d => d);
  };
  
  const teamPerformanceByVenue = () => {
    const venueStats = filteredData.reduce((acc: any, d: MatchData) => {
      if (!acc[d.venue]) {
        acc[d.venue] = {};
      }
      if (!acc[d.venue][d.batting_team]) {
        acc[d.venue][d.batting_team] = { total_runs: 0, count: 0 };
      }
      acc[d.venue][d.batting_team].total_runs += d.total;
      acc[d.venue][d.batting_team].count++;
      return acc;
    }, {});
    
    const chartData = Object.keys(venueStats).map(venue => {
      const entry = { venue };
      Object.keys(venueStats[venue]).forEach(team => {
        entry[team] = venueStats[venue][team].total_runs / venueStats[venue][team].count;
      });
      return entry;
    });
    return chartData;
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary">
        IPL Match Visualizations
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-24 w-24 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Select onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null as any}>All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null as any}>All Venues</SelectItem>
                {venues.map(venue => (
                  <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="runsPerOver" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="runsPerOver">Runs per Over</TabsTrigger>
              <TabsTrigger value="teamByVenue">Team Performance by Venue</TabsTrigger>
              <TabsTrigger value="dataPreview">Data Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="runsPerOver">
              <Card className="shadow-lg mt-8">
                <CardHeader>
                  <CardTitle>Runs per Over</CardTitle>
                  <CardDescription>
                    A line chart showing the total runs per over.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={runsPerOverData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="over" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="runs" stroke="#F97316" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teamByVenue">
              <Card className="shadow-lg mt-8">
                <CardHeader>
                  <CardTitle>Team Performance by Venue</CardTitle>
                  <CardDescription>
                    A bar chart showing the average score for each team at different venues.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamPerformanceByVenue()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="venue" angle={-45} textAnchor="end" height={100} interval={0} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={teams[0]} fill="#F97316" stackId="a" />
                      <Bar dataKey={teams[1]} fill="#10B981" stackId="a" />
                      {/* Add more bars for other teams as needed */}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dataPreview">
              <Card className="shadow-lg mt-8">
                <CardHeader>
                  <CardTitle>Full Dataset Preview</CardTitle>
                  <CardDescription>
                    First 100 rows of the imported CSV data for verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Match ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Batting Team</TableHead>
                          <TableHead>Bowling Team</TableHead>
                          <TableHead>Total Runs</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.slice(0, 100).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.mid}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.venue}</TableCell>
                            <TableCell>{row.batting_team}</TableCell>
                            <TableCell>{row.bowling_team}</TableCell>
                            <TableCell>{row.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DataViz;
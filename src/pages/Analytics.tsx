import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnalytics, mockBrands } from "@/data/mockData";
import { Search, Calendar, BarChart3, Eye } from "lucide-react";

const Analytics = () => {
  const [brandFilter, setBrandFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2024-01-31" });
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const filteredAnalytics = mockAnalytics.filter(entry => {
    const matchesBrand = brandFilter === "all" || entry.brand === brandFilter;
    const matchesChannel = channelFilter === "all" || entry.channel === channelFilter;
    return matchesBrand && matchesChannel;
  });

  const getMatchMethodBadge = (method: string) => {
    const colors = {
      semantic: 'bg-primary text-primary-foreground',
      keyword: 'bg-secondary text-secondary-foreground',
      fuzzy: 'bg-accent text-accent-foreground'
    };
    return <Badge className={colors[method as keyof typeof colors] || 'bg-muted text-muted-foreground'}>
      {method.toUpperCase()}
    </Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-success';
    if (score >= 0.7) return 'text-warning';
    return 'text-destructive';
  };

  const mockMatchInspector = {
    queryText: "how to reset password",
    method: "semantic",
    score: 0.95,
    candidates: [
      { qaid: "QA1001", question: "How do I reset my password?", score: 0.95 },
      { qaid: "QA1004", question: "Password reset instructions", score: 0.72 },
      { qaid: "QA1005", question: "Forgot password help", score: 0.68 }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Monitor FAQ performance and usage patterns</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div>
              <Label>Brand</Label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {mockBrands.map(brand => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Channel</Label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="Chat">Chat</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Voice">Voice</SelectItem>
                  <SelectItem value="Pre-sales">Pre-sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">247</div>
            <p className="text-sm text-muted-foreground">Total Queries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">94.2%</div>
            <p className="text-sm text-muted-foreground">Match Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">0.87</div>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">156ms</div>
            <p className="text-sm text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Log ({filteredAnalytics.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Query Text</TableHead>
                <TableHead>Served QAID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalytics.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-[200px] truncate">
                    {entry.queryText}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <Badge variant="outline">{entry.servedQaid}</Badge>
                  </TableCell>
                  <TableCell>
                    {getMatchMethodBadge(entry.matchMethod)}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(entry.matchScore)}`}>
                      {Math.round(entry.matchScore * 100)}%
                    </span>
                  </TableCell>
                  <TableCell>{entry.brand}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.channel}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Match Inspector</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Original Query</Label>
                            <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                              {mockMatchInspector.queryText}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Match Method</Label>
                              <div className="mt-1">
                                {getMatchMethodBadge(mockMatchInspector.method)}
                              </div>
                            </div>
                            <div>
                              <Label>Final Score</Label>
                              <div className={`text-xl font-bold mt-1 ${getScoreColor(mockMatchInspector.score)}`}>
                                {Math.round(mockMatchInspector.score * 100)}%
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Candidate Matches</Label>
                            <div className="mt-2 space-y-2">
                              {mockMatchInspector.candidates.map((candidate, index) => (
                                <div key={candidate.qaid} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{candidate.qaid}</Badge>
                                      {index === 0 && <Badge className="bg-success text-success-foreground">SELECTED</Badge>}
                                    </div>
                                    <p className="text-sm mt-1">{candidate.question}</p>
                                  </div>
                                  <div className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                                    {Math.round(candidate.score * 100)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
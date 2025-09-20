import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { mockFAQs } from "@/data/mockData";
import { Clock, Eye, RotateCcw, Search } from "lucide-react";

const Versions = () => {
  const { currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);

  // Generate mock version history for demonstration
  const mockVersionHistory = [
    {
      id: "v1",
      qaid: "QA1001",
      version: 1,
      question: "How do I reset my password?",
      changeType: "Created",
      timestamp: "2024-01-10T10:00:00Z",
      author: "FAQ Editor",
      environment: "Draft"
    },
    {
      id: "v2", 
      qaid: "QA1001",
      version: 2,
      question: "How do I reset my password?",
      changeType: "Published",
      timestamp: "2024-01-12T14:30:00Z", 
      author: "Admin User",
      environment: "SIT"
    },
    {
      id: "v3",
      qaid: "QA1001", 
      version: 3,
      question: "How do I reset my password?",
      changeType: "Published",
      timestamp: "2024-01-15T09:15:00Z",
      author: "Admin User", 
      environment: "PROD"
    },
    {
      id: "v4",
      qaid: "QA1002",
      version: 1,
      question: "What are your business hours?", 
      changeType: "Created",
      timestamp: "2024-01-14T11:20:00Z",
      author: "Admin User",
      environment: "Draft"
    },
    {
      id: "v5",
      qaid: "QA1002",
      version: 2, 
      question: "What are your business hours?",
      changeType: "Updated",
      timestamp: "2024-01-14T16:45:00Z",
      author: "FAQ Editor", 
      environment: "Draft"
    }
  ];

  const filteredHistory = mockVersionHistory.filter(version =>
    version.qaid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChangeTypeBadge = (changeType: string) => {
    const colors = {
      Created: 'bg-primary text-primary-foreground',
      Updated: 'bg-warning text-warning-foreground', 
      Published: 'bg-success text-success-foreground',
      Reverted: 'bg-destructive text-destructive-foreground'
    };
    return <Badge className={colors[changeType as keyof typeof colors] || 'bg-muted text-muted-foreground'}>
      {changeType}
    </Badge>;
  };

  const getEnvironmentBadge = (environment: string) => {
    const colors = {
      Draft: 'bg-muted text-muted-foreground',
      SIT: 'bg-warning text-warning-foreground',
      PROD: 'bg-destructive text-destructive-foreground'
    };
    return <Badge className={colors[environment as keyof typeof colors]}>
      {environment}
    </Badge>;
  };

  const handleRollback = (versionId: string, qaid: string) => {
    if (currentRole === 'admin') {
      alert(`Rolling back ${qaid} to version ${versionId}`);
    }
  };

  const mockDiffView = {
    before: `## How do I reset my password?

To reset your password:
1. Go to the login page
2. Click "Forgot Password" 
3. Enter your email address
4. Check your inbox for reset instructions`,
    after: `## How do I reset my password?

To reset your password:
1. Navigate to the login page
2. Click "Forgot Password" link
3. Enter your registered email address  
4. Check your inbox for password reset instructions
5. Follow the link in the email to create a new password`
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Versions & Audit</h1>
          <p className="text-muted-foreground">Track changes and manage FAQ version history</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by QAID, question, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Version History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Version History ({filteredHistory.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QAID</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-mono text-sm">
                    <Badge variant="outline">{version.qaid}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">v{version.version}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={version.question}>
                    {version.question}
                  </TableCell>
                  <TableCell>
                    {getChangeTypeBadge(version.changeType)}
                  </TableCell>
                  <TableCell>
                    {getEnvironmentBadge(version.environment)}
                  </TableCell>
                  <TableCell>{version.author}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(version.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedFAQ(version)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Version Diff - {version.qaid} v{version.version}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 h-96">
                              <div>
                                <h4 className="font-medium mb-2 text-destructive">Previous Version</h4>
                                <div className="border rounded-lg p-4 bg-destructive/5 h-full overflow-y-auto">
                                  <pre className="text-sm whitespace-pre-wrap">{mockDiffView.before}</pre>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-success">Current Version</h4>
                                <div className="border rounded-lg p-4 bg-success/5 h-full overflow-y-auto">
                                  <pre className="text-sm whitespace-pre-wrap">{mockDiffView.after}</pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {currentRole === 'admin' && version.environment === 'PROD' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRollback(version.id, version.qaid)}
                          className="text-destructive hover:text-destructive"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline View - QA1001</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Created in Draft</p>
                <p className="text-sm text-muted-foreground">FAQ Editor • Jan 10, 2024 10:00 AM</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">Created</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Published to SIT</p>
                <p className="text-sm text-muted-foreground">Admin User • Jan 12, 2024 2:30 PM</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Published</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Published to PROD</p>
                <p className="text-sm text-muted-foreground">Admin User • Jan 15, 2024 9:15 AM</p>
              </div>
              <Badge className="bg-success text-success-foreground">Published</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Versions;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { mockPublishRequests, mockFAQs } from "@/data/mockData";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const PublishQueue = () => {
  const { currentRole } = useApp();
  const [environmentFilter, setEnvironmentFilter] = useState("all");

  const handleApprove = (requestId: string) => {
    alert(`Approved publish request ${requestId}`);
  };

  const handleReject = (requestId: string) => {
    alert(`Rejected publish request ${requestId}`);
  };

  const handlePublishToSIT = (qaid: string) => {
    alert(`Publishing ${qaid} to SIT environment`);
  };

  const handleRequestPROD = (qaid: string) => {
    alert(`Requested PROD publish for ${qaid}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    return env === 'PROD' 
      ? <Badge className="bg-destructive text-destructive-foreground">PROD</Badge>
      : <Badge className="bg-warning text-warning-foreground">SIT</Badge>;
  };

  // FAQs ready for SIT publish (Draft status)
  const readyForSIT = mockFAQs.filter(faq => faq.status === 'Draft');

  // FAQs ready for PROD request (SIT status)
  const readyForPROD = mockFAQs.filter(faq => faq.status === 'SIT');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publish Queue</h1>
          <p className="text-muted-foreground">Manage FAQ publishing to SIT and PROD environments</p>
        </div>
      </div>

      {/* Quick Publish Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ready for SIT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Ready for SIT Publish
              <Badge variant="outline">{readyForSIT.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readyForSIT.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No FAQs ready for SIT</p>
            ) : (
              <div className="space-y-3">
                {readyForSIT.map(faq => (
                  <div key={faq.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">{faq.qaid}</p>
                      <p className="text-sm truncate max-w-[200px]">{faq.question}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handlePublishToSIT(faq.qaid)}
                      className="bg-warning text-warning-foreground hover:bg-warning/90"
                    >
                      Publish to SIT
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ready for PROD Request */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Ready for PROD Request
              <Badge variant="outline">{readyForPROD.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readyForPROD.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No FAQs ready for PROD</p>
            ) : (
              <div className="space-y-3">
                {readyForPROD.map(faq => (
                  <div key={faq.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">{faq.qaid}</p>
                      <p className="text-sm truncate max-w-[200px]">{faq.question}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRequestPROD(faq.qaid)}
                    >
                      Request PROD
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests (Admin Only) */}
      {currentRole === 'admin' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending PROD Requests</CardTitle>
            <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Environments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="SIT">SIT</SelectItem>
                <SelectItem value="PROD">PROD</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QAID</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPublishRequests.map((request) => {
                  const faq = mockFAQs.find(f => f.qaid === request.qaid);
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono">{request.qaid}</TableCell>
                      <TableCell>
                        {getEnvironmentBadge(request.environment)}
                      </TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="text-sm">{request.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'Pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Warning Notice for PROD */}
      <Card className="border-destructive">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive">Production Publishing Notice</h4>
              <p className="text-sm text-muted-foreground mt-1">
                PROD publishing requires admin approval and affects live customer interactions. 
                Ensure all changes are thoroughly tested in SIT environment before requesting PROD deployment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishQueue;
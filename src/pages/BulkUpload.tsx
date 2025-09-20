import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, CheckCircle, AlertCircle, XCircle, FileText } from "lucide-react";

interface ValidationResult {
  row: number;
  question: string;
  status: 'accepted' | 'duplicate' | 'error';
  qaid?: string;
  suggestedQaid?: string;
  reason?: string;
}

const BulkUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const mockResults: ValidationResult[] = [
    {
      row: 1,
      question: "How to reset password?",
      status: "accepted",
      qaid: "QA1007"
    },
    {
      row: 2, 
      question: "What are business hours?",
      status: "duplicate",
      suggestedQaid: "QA1002",
      reason: "Similar FAQ already exists"
    },
    {
      row: 3,
      question: "How to cancel subscription?",
      status: "duplicate", 
      suggestedQaid: "QA1003",
      reason: "Exact match found"
    },
    {
      row: 4,
      question: "Product pricing information",
      status: "accepted",
      qaid: "QA1008"
    },
    {
      row: 5,
      question: "",
      status: "error",
      reason: "Question field is required"
    },
    {
      row: 6,
      question: "How to contact support team?",
      status: "accepted", 
      qaid: "QA1009"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleValidation = () => {
    setValidationResults(mockResults);
    setShowResults(true);
  };

  const downloadTemplate = () => {
    // Simulate template download
    alert('CSV template downloaded!');
  };

  const downloadErrors = () => {
    // Simulate error CSV download
    alert('Error report downloaded!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'duplicate':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      accepted: 'bg-success text-success-foreground',
      duplicate: 'bg-warning text-warning-foreground', 
      error: 'bg-destructive text-destructive-foreground'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>;
  };

  const acceptedCount = validationResults.filter(r => r.status === 'accepted').length;
  const duplicateCount = validationResults.filter(r => r.status === 'duplicate').length;
  const errorCount = validationResults.filter(r => r.status === 'error').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1>
          <p className="text-muted-foreground">Upload multiple FAQs using CSV format</p>
        </div>
        <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop your CSV file here, or click to browse</p>
              <p className="text-sm text-muted-foreground">
                Supported format: CSV (max 10MB)
              </p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-4"
            />
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 bg-accent rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(uploadedFile.size / 1024)} KB
                  </p>
                </div>
              </div>
              <Button onClick={handleValidation}>Validate & Process</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {showResults && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold text-success">{acceptedCount}</p>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-warning">{duplicateCount}</p>
                    <p className="text-sm text-muted-foreground">Duplicates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Validation Results</CardTitle>
              {errorCount > 0 && (
                <Button variant="outline" onClick={downloadErrors} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Error Report
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationResults.map((result) => (
                    <TableRow key={result.row}>
                      <TableCell className="font-mono">{result.row}</TableCell>
                      <TableCell className="max-w-[300px] truncate" title={result.question}>
                        {result.question || '(empty)'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.qaid && (
                          <Badge variant="outline" className="font-mono">
                            {result.qaid}
                          </Badge>
                        )}
                        {result.suggestedQaid && (
                          <Badge variant="outline" className="font-mono">
                            Similar: {result.suggestedQaid}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {result.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline">Retry Upload</Button>
            <Button>Confirm Import ({acceptedCount} FAQs)</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkUpload;
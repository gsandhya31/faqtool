import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { mockFAQs, mockBrands } from "@/data/mockData";
import { Plus, Eye, Edit, Clock, Rocket, Send } from "lucide-react";

const FAQList = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter FAQs based on user permissions
  const availableFAQs = currentRole === 'admin' 
    ? mockFAQs 
    : mockFAQs.filter(faq => 
        faq.brands.some(brand => currentUser.assignedBrands.includes(brand))
      );

  // Apply filters
  const filteredFAQs = availableFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.qaid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === "all" || faq.brands.includes(brandFilter);
    const matchesStatus = statusFilter === "all" || faq.status === statusFilter;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROD': return 'bg-success text-success-foreground';
      case 'SIT': return 'bg-warning text-warning-foreground';
      case 'Draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FAQ Management</h1>
          <p className="text-muted-foreground">Manage and organize your FAQ content</p>
        </div>
        <Button onClick={() => navigate('/faqs/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New FAQ
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {mockBrands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="SIT">SIT</SelectItem>
                <SelectItem value="PROD">PROD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Table */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs ({filteredFAQs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QAID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Brand(s)</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFAQs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-mono text-sm">{faq.qaid}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={faq.question}>
                    {faq.question}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {faq.brands.map(brandId => {
                        const brand = mockBrands.find(b => b.id === brandId);
                        return (
                          <Badge key={brandId} variant="outline" className="text-xs">
                            {brand?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {faq.channels.map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(faq.status)}>
                      {faq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {faq.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/faqs/${faq.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Clock className="w-4 h-4" />
                      </Button>
                      {faq.status === 'Draft' && (
                        <Button variant="ghost" size="sm" className="text-warning">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      {(faq.status === 'SIT' && currentRole === 'admin') && (
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Rocket className="w-4 h-4" />
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
    </div>
  );
};

export default FAQList;
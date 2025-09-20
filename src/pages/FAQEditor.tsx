import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { mockBrands, mockFAQs } from "@/data/mockData";
import { Save, Search, Plus, X } from "lucide-react";
import { Channel } from "@/types";

const FAQEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useApp();
  const isEditing = Boolean(id);
  
  // Find existing FAQ if editing
  const existingFAQ = isEditing ? mockFAQs.find(f => f.id === id) : null;

  const [formData, setFormData] = useState({
    question: existingFAQ?.question || "",
    canonicalAnswer: existingFAQ?.canonicalAnswer || "",
    brands: existingFAQ?.brands || [],
    channels: existingFAQ?.channels || [],
    tags: existingFAQ?.tags || [],
    similarUtterances: existingFAQ?.similarUtterances || [],
    ticketParameters: existingFAQ?.ticketParameters || {}
  });

  const [newTag, setNewTag] = useState("");
  const [newUtterance, setNewUtterance] = useState("");
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Available brands based on user permissions
  const availableBrands = mockBrands.filter(brand => 
    currentUser.assignedBrands.includes(brand.id)
  );

  // All available channels from selected brands
  const availableChannels = Array.from(new Set(
    formData.brands.flatMap(brandId => {
      const brand = mockBrands.find(b => b.id === brandId);
      return brand?.channels || [];
    })
  ));

  const handleBrandToggle = (brandId: string) => {
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
    }));
  };

  const handleChannelToggle = (channel: Channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addUtterance = () => {
    if (newUtterance.trim()) {
      setFormData(prev => ({
        ...prev,
        similarUtterances: [...prev.similarUtterances, newUtterance.trim()]
      }));
      setNewUtterance("");
    }
  };

  const removeUtterance = (utteranceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      similarUtterances: prev.similarUtterances.filter(u => u !== utteranceToRemove)
    }));
  };

  const checkDuplicates = () => {
    // Simulate duplicate check
    setDuplicates([
      {
        qaid: "QA1001",
        question: "How to reset password?",
        similarity: 0.89,
        brands: ["brand-a"]
      },
      {
        qaid: "QA1004", 
        question: "Password reset instructions",
        similarity: 0.72,
        brands: ["brand-b"]
      }
    ]);
    setShowDuplicates(true);
  };

  const handleSave = () => {
    // Simulate save - show QAID
    const newQAID = isEditing ? existingFAQ?.qaid : `QA${Math.floor(Math.random() * 9000) + 1000}`;
    alert(`FAQ saved successfully! QAID: ${newQAID}`);
    navigate('/faqs');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit FAQ' : 'Create New FAQ'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? `Editing ${existingFAQ?.qaid}` : 'Create a new FAQ entry'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/faqs')}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save FAQ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({...prev, question: e.target.value}))}
                  placeholder="Enter the FAQ question..."
                />
              </div>

              <div>
                <Label htmlFor="answer">Canonical Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.canonicalAnswer}
                  onChange={(e) => setFormData(prev => ({...prev, canonicalAnswer: e.target.value}))}
                  placeholder="Enter the answer in markdown format..."
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={checkDuplicates}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Check Duplicates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brand and Channel Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Brand & Channel Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Brands (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableBrands.map(brand => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={formData.brands.includes(brand.id)}
                        onCheckedChange={() => handleBrandToggle(brand.id)}
                      />
                      <Label htmlFor={brand.id}>{brand.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {availableChannels.length > 0 && (
                <div>
                  <Label>Channels</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableChannels.map(channel => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={channel}
                          checked={formData.channels.includes(channel)}
                          onCheckedChange={() => handleChannelToggle(channel)}
                        />
                        <Label htmlFor={channel}>{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Similar Utterances */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Utterances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newUtterance}
                  onChange={(e) => setNewUtterance(e.target.value)}
                  placeholder="Add similar utterance..."
                  onKeyPress={(e) => e.key === 'Enter' && addUtterance()}
                />
                <Button onClick={addUtterance} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.similarUtterances.map(utterance => (
                  <div key={utterance} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{utterance}</span>
                    <X className="w-4 h-4 cursor-pointer" onClick={() => removeUtterance(utterance)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Duplicate Suggestions */}
          {showDuplicates && (
            <Card>
              <CardHeader>
                <CardTitle>Duplicate Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {duplicates.map(duplicate => (
                  <div key={duplicate.qaid} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm">{duplicate.qaid}</span>
                      <Badge variant="outline">{Math.round(duplicate.similarity * 100)}%</Badge>
                    </div>
                    <p className="text-sm">{duplicate.question}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Merge</Button>
                      <Button size="sm" variant="outline">Override</Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full">Create New</Button>
              </CardContent>
            </Card>
          )}

          {/* Ticket Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'category', 'priority', 'department', 'urgency', 'type',
                'source', 'escalation', 'assignment', 'resolution', 'followup'
              ].map(param => (
                <div key={param}>
                  <Label htmlFor={param} className="capitalize">{param}</Label>
                  <Input
                    id={param}
                    value={formData.ticketParameters[param] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ticketParameters: {
                        ...prev.ticketParameters,
                        [param]: e.target.value
                      }
                    }))}
                    placeholder={`Enter ${param}...`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQEditor;
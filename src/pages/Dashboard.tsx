import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { vastApi, VastTag, Credits } from "@/lib/api";
import { Upload, LogOut, Copy, Pencil, Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tags, setTags] = useState<VastTag[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingTag, setEditingTag] = useState<VastTag | null>(null);
  const [newName, setNewName] = useState("");
  const [dollarAmount, setDollarAmount] = useState("10");
  const [purchasingCredits, setPurchasingCredits] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const payStatus = searchParams.get('pay');
    
    if (payStatus === 'success') {
      // Track purchase event
      const amount = parseFloat(dollarAmount) || 0;
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'purchase', {
          transaction_id: `${user?.id}_${Date.now()}`,
          currency: 'USD',
          value: amount
        });
      }
      
      toast({
        title: "Payment Successful! 🎉",
        description: "Your impressions have been added to your account",
      });
      // Reload data to show updated credits
      if (user) loadData();
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    } else if (payStatus === 'failed') {
      toast({
        variant: "destructive",
        title: "Payment Canceled",
        description: "Your payment was not completed",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [user, toast]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [tagsData, creditsData] = await Promise.all([
        vastApi.getTags(user.id),
        vastApi.getCredits(user.id),
      ]);
      
      setTags(tagsData);
      setCredits(creditsData);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      await vastApi.uploadVideo(selectedFile, user.id);
      
      toast({
        title: "Video uploaded!",
        description: "Your VAST tag has been created",
      });
      
      setSelectedFile(null);
      loadData();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (tag: VastTag) => {
    if (!user) return;

    try {
      await vastApi.updateTag(tag.tag_id, user.id, { active: !tag.active });
      loadData();
      
      toast({
        title: tag.active ? "Tag deactivated" : "Tag activated",
      });
    } catch (error) {
      toast({
        title: "Error updating tag",
        variant: "destructive",
      });
    }
  };

  const handleUpdateName = async () => {
    if (!editingTag || !user || !newName.trim()) return;

    try {
      await vastApi.updateTag(editingTag.tag_id, user.id, { name: newName });
      loadData();
      setEditingTag(null);
      setNewName("");
      
      toast({
        title: "Tag name updated",
      });
    } catch (error) {
      toast({
        title: "Error updating name",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (tag: VastTag) => {
    if (!user || !confirm('Are you sure you want to delete this tag?')) return;

    try {
      await vastApi.deleteTag(tag.tag_id, user.id);
      loadData();
      
      toast({
        title: "Tag deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting tag",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  const handlePurchaseCredits = async () => {
    if (!user) return;
    
    const amount = parseFloat(dollarAmount);
    if (isNaN(amount) || amount < 1 || amount > 1000) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter an amount between $1 and $1,000",
      });
      return;
    }

    setPurchasingCredits(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { amount_usd: amount },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create checkout",
      });
    } finally {
      setPurchasingCredits(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VAST Creator Hub
          </h1>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Credits Card */}
        {credits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 shadow-card">
              <CardHeader>
                <CardTitle>Your Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Credits</p>
                    <p className="text-2xl font-bold">${credits.credit_usd.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={credits.status === 'active' ? 'default' : 'secondary'}>
                      {credits.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Impressions Bought</p>
                    <p className="text-2xl font-bold">{credits.credit_imps_bought.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Impressions Used</p>
                    <p className="text-2xl font-bold">{credits.credit_imps_used.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-card">
              <CardHeader>
                <CardTitle>Purchase Impressions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dollar-amount">Amount ($)</Label>
                  <Input
                    id="dollar-amount"
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={dollarAmount}
                    onChange={(e) => setDollarAmount(e.target.value)}
                    placeholder="Enter amount ($1-$1,000)"
                  />
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      You'll receive: <span className="text-accent">{(parseFloat(dollarAmount) * 20000).toLocaleString()} impressions</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      $0.05 CPM • Minimum $1
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handlePurchaseCredits}
                  disabled={purchasingCredits}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {purchasingCredits ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Purchase for $${parseFloat(dollarAmount).toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Section */}
        <Card className="p-6 border-2 shadow-card">
          <h2 className="text-xl font-bold mb-4">Upload New Video</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-upload">Video File (MP4, MOV, AVI - Max 500MB)</Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
            </div>
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Create VAST Tag
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Tags Table */}
        <Card className="p-6 border-2 shadow-card">
          <h2 className="text-xl font-bold mb-4">Your VAST Tags</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>VAST URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No tags yet. Upload a video to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-mono text-sm">{tag.tag_id.slice(0, 8)}...</TableCell>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={tag.active}
                          onCheckedChange={() => handleToggleActive(tag)}
                        />
                      </TableCell>
                      <TableCell>{tag.imp_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(tag.vast_url)}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy URL
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTag(tag);
                                  setNewName(tag.name);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Tag Name</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label htmlFor="new-name">Tag Name</Label>
                                  <Input
                                    id="new-name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                  />
                                </div>
                                <Button
                                  onClick={handleUpdateName}
                                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                  Update Name
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

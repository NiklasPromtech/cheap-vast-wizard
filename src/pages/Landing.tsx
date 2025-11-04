import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Shield, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VAST Creator Hub
          </h1>
          <Link to="/auth">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent animate-fade-in">
            <TrendingDown className="w-4 h-4" />
            80% cheaper than market average
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight animate-fade-in">
            VAST Tag Hosting at{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              $0.05 CPM
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Host your video advertising tags at a fraction of the cost. Simple, fast, and reliable infrastructure for your marketing campaigns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/auth">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Pricing
            </Button>
          </div>

          <p className="text-sm text-muted-foreground animate-fade-in">
            No credit card required • Setup in minutes
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 border-2 hover:border-accent transition-colors hover:shadow-accent">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Upload your video and get your VAST tag instantly. Start serving ads in seconds.
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-accent transition-colors hover:shadow-accent">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Unbeatable Pricing</h3>
            <p className="text-muted-foreground">
              At $0.05 CPM, you're paying 80% less than industry average. More budget for your campaigns.
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-accent transition-colors hover:shadow-accent">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enterprise Reliable</h3>
            <p className="text-muted-foreground">
              99.9% uptime with real-time tracking and analytics. Your campaigns never miss a beat.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">
            Pay only for what you use. No hidden fees, no surprises.
          </p>

          <Card className="p-8 border-2 border-accent shadow-accent">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">
                $0.05
                <span className="text-2xl text-muted-foreground"> per 1,000 impressions</span>
              </div>
              <p className="text-muted-foreground">vs. industry average of $0.25 CPM</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited VAST tag creation',
                'Real-time impression tracking',
                'High-speed video delivery',
                '99.9% uptime guarantee',
                'Detailed analytics dashboard',
                'No setup fees or minimums'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/auth" className="block">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Start Saving Today
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 VAST Creator Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

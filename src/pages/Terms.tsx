import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              ← Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Ownership</h2>
              <p className="text-muted-foreground">
                VAST Creator Hub is owned and operated by Promtech Systems Ltd.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Support</h2>
              <p className="text-muted-foreground">
                If you need any support or have questions, please reach out to us at{" "}
                <a 
                  href="mailto:support@promtech.systems" 
                  className="text-primary hover:underline"
                >
                  support@promtech.systems
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Terms</h2>
              <p className="text-muted-foreground">
                By using VAST Creator Hub, you agree to our pricing structure of $0.05 CPM for VAST tag hosting. 
                Payment is required to maintain active service, and credits can be topped up through the dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
              <p className="text-muted-foreground">
                We collect and process data necessary to provide our services. Your data is handled securely 
                and in accordance with applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Promtech Systems Ltd provides this service "as is" and makes no warranties regarding the 
                availability or performance of the service. We are not liable for any indirect or consequential 
                damages arising from the use of our service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

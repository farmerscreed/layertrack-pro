import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bird, Egg } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bird className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">LayerTrack</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Modern Poultry Farm Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your layer farm operations with comprehensive tracking,
              analytics, and management tools.
            </p>
            <Button size="lg" asChild className="mr-4">
              <Link to="/register">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-gray-50 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Bird}
                title="Batch Management"
                description="Track multiple batches of birds with detailed monitoring of health, age, and productivity."
              />
              <FeatureCard
                icon={Egg}
                title="Production Tracking"
                description="Record and analyze daily egg production with grade-wise categorization."
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics Dashboard"
                description="Get insights into your farm's performance with comprehensive analytics and reports."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bird className="h-6 w-6" />
                <span className="text-xl font-semibold">LayerTrack</span>
              </div>
              <p className="text-gray-400">
                Modern solutions for modern poultry farming
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Icon className="h-12 w-12 text-primary mb-4" />
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Landing;
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bird, Egg, LineChart, PiggyBank, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bird className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">LayerTrack</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Transform Your Poultry Farm Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Streamline operations, boost productivity, and maximize profits with our comprehensive layer farm management solution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link to="/register">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Egg}
                title="Production Tracking"
                description="Monitor daily egg production, track quality metrics, and optimize your output with detailed analytics."
              />
              <FeatureCard
                icon={LineChart}
                title="Performance Analytics"
                description="Make data-driven decisions with comprehensive reports and real-time performance insights."
              />
              <FeatureCard
                icon={PiggyBank}
                title="Financial Management"
                description="Track expenses, revenue, and profitability with our integrated financial tools."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <Carousel className="max-w-xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <TestimonialCard
                    quote="LayerTrack has revolutionized how we manage our farm. Production is up 25% since we started using it!"
                    author="Sarah Johnson"
                    role="Farm Manager"
                  />
                </CarouselItem>
                <CarouselItem>
                  <TestimonialCard
                    quote="The analytics features helped us identify and fix inefficiencies we didn't even know existed."
                    author="Michael Chen"
                    role="Farm Owner"
                  />
                </CarouselItem>
                <CarouselItem>
                  <TestimonialCard
                    quote="Finally, a solution that understands the needs of modern poultry farming!"
                    author="Emma Williams"
                    role="Operations Director"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-primary text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold">500+</div>
                <div className="text-primary-foreground/80">Active Farms</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">1M+</div>
                <div className="text-primary-foreground/80">Birds Tracked</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">98%</div>
                <div className="text-primary-foreground/80">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-t from-background to-primary/5">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful farmers who have already modernized their operations with LayerTrack.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link to="/register">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <Icon className="h-12 w-12 text-primary mb-4" />
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6 text-center">
        <p className="text-lg mb-4 italic text-gray-600">"{quote}"</p>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </CardContent>
    </Card>
  );
};

export default Landing;
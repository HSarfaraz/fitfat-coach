import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { packages } from "@shared/schema";
import PackageCard from "@/components/package-card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Activity, Target, Clock, Users } from "lucide-react";

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<string>();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const features = [
    {
      icon: <Activity className="h-12 w-12 text-primary" />,
      title: "Personalized Training",
      description: "Get customized workout plans tailored to your goals and fitness level"
    },
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Goal Tracking",
      description: "Monitor your progress with detailed metrics and achievements"
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Flexible Scheduling",
      description: "Book consultations at times that work best for you"
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Expert Support",
      description: "Access to certified trainers and nutrition specialists"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
              Transform Your Life with
              <span className="text-primary block mt-2">Expert Guidance</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Start your fitness journey today with personalized training, expert nutrition advice,
              and dedicated support to achieve your goals.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the difference with our comprehensive approach to fitness
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Package</h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the package that best fits your goals and commitment level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(packages).map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onSelect={() => setSelectedPackage(pkg.id)}
                isSelected={selectedPackage === pkg.id}
              />
            ))}
          </div>
          {selectedPackage && (
            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Sign Up Now"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
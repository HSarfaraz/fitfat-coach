import { Card, CardContent } from "@/components/ui/card";
import { Activity, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Meet Your <span className="text-primary">Expert Trainer</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Dedicated to helping you achieve your fitness goals with personalized training and expert guidance.
          </p>
        </div>

        {/* Trainer Profile */}
        <Card className="mb-16">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-24 h-24 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shaikh Shaibaz</h2>
                <p className="text-gray-600 mb-4">
                  With over 10 years of experience in fitness training and nutrition coaching, 
                  I've helped hundreds of clients transform their lives through personalized 
                  fitness programs and dedicated support.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    Certified Personal Trainer
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    Nutrition Specialist
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    Weight Management Expert
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Activity className="h-12 w-12 text-primary" />,
              title: "Expert Guidance",
              description: "Personalized training programs tailored to your specific goals and fitness level"
            },
            {
              icon: <Heart className="h-12 w-12 text-primary" />,
              title: "Holistic Approach",
              description: "Focus on both physical fitness and mental well-being for sustainable results"
            },
            {
              icon: <Award className="h-12 w-12 text-primary" />,
              title: "Proven Results",
              description: "Track record of successful transformations and satisfied clients"
            }
          ].map((value, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-500">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
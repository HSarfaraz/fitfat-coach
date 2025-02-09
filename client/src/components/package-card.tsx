import { Package } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
  isSelected?: boolean;
}

export default function PackageCard({ package: pkg, onSelect, isSelected }: PackageCardProps) {
  return (
    <Card className={`w-full transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <CardTitle>{pkg.name}</CardTitle>
        <CardDescription>₹{pkg.price} for {pkg.duration} month{pkg.duration > 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onSelect(pkg)}
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? "Selected" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

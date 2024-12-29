import { Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const FarmSettings = () => {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Farm Information
        </CardTitle>
        <CardDescription>
          Update your farm's profile and business details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Farm Name</Label>
            <Input placeholder="Enter your farm's name" />
          </div>
          <div className="space-y-2">
            <Label>Business Registration</Label>
            <Input placeholder="Registration number" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input placeholder="Farm location" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
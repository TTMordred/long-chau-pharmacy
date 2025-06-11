
import { Upload, Heart, Star, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeatureSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-none overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Quick Prescription Upload</h3>
                <p className="text-blue-100">Upload your prescription and get verified by licensed pharmacists</p>
              </div>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Upload className="w-4 h-4 mr-2" />
                Upload Prescription
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="font-semibold text-sm">Health Tips</h4>
            <p className="text-xs text-muted-foreground">Daily wellness advice</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <h4 className="font-semibold text-sm">Favorites</h4>
            <p className="text-xs text-muted-foreground">Your saved items</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="font-semibold text-sm">My Orders</h4>
            <p className="text-xs text-muted-foreground">Track deliveries</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="font-semibold text-sm">Verified</h4>
            <p className="text-xs text-muted-foreground">Licensed pharmacy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureSection;

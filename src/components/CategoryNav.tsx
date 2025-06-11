
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCategories, type Category } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-32 rounded-2xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  const allCategories = [
    { id: 'all', name: 'All Products', color_class: 'bg-gradient-to-r from-slate-500 to-gray-600' },
    ...categories
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom duration-500">
        <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
        <p className="text-muted-foreground">Find exactly what you need for your health and wellness</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {allCategories.map((category, index) => (
          <Button
            key={category.id}
            variant="ghost"
            className={`group relative whitespace-nowrap flex-shrink-0 h-14 px-6 rounded-2xl transition-all duration-500 hover:scale-105 border-2 animate-in slide-in-from-bottom duration-700 ${
              activeCategory === category.name 
                ? 'bg-white shadow-xl border-blue-500/30 text-blue-600 scale-105' 
                : 'bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg text-gray-700'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onCategoryChange(category.name)}
          >
            {/* Active indicator */}
            {activeCategory === category.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
            )}
            
            {/* Category indicator dot */}
            <span className={`relative z-10 w-3 h-3 rounded-full mr-3 transition-all duration-300 ${
              activeCategory === category.name 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110' 
                : category.color_class?.includes('gradient') 
                  ? category.color_class 
                  : `${category.color_class?.split(' ')[0] || 'bg-gray-400'} group-hover:scale-110`
            }`} />
            
            {/* Category name */}
            <span className="relative z-10 font-medium">
              {category.name}
            </span>

            {/* Hover effect overlay */}
            {activeCategory !== category.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

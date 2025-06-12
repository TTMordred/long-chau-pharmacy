
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
    { id: 'all', name: 'All Products', color_class: 'bg-gradient-to-r from-navy to-blue' },
    ...categories
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom duration-500">
        <h2 className="text-2xl font-bold text-navy">Browse Categories</h2>
        <p className="text-navy/70 font-medium">Find exactly what you need for your health and wellness</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {allCategories.map((category, index) => (
          <Button
            key={category.id}
            variant="ghost"
            className={`group relative whitespace-nowrap flex-shrink-0 h-14 px-6 rounded-2xl transition-all duration-500 hover:scale-105 border-2 animate-in slide-in-from-bottom duration-700 ${
              activeCategory === category.name 
                ? 'bg-white shadow-xl border-blue/40 text-blue scale-105 font-semibold' 
                : 'bg-white/70 backdrop-blur-sm border-mint/40 hover:bg-white/90 hover:shadow-lg text-navy font-medium'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onCategoryChange(category.name)}
          >
            {/* Active indicator */}
            {activeCategory === category.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-navy/10 rounded-2xl"></div>
            )}
            
            {/* Category indicator dot */}
            <span className={`relative z-10 w-3 h-3 rounded-full mr-3 transition-all duration-300 ${
              activeCategory === category.name 
                ? 'bg-gradient-to-r from-blue to-navy scale-110' 
                : 'bg-navy group-hover:scale-110 group-hover:bg-blue'
            }`} />
            
            {/* Category name */}
            <span className="relative z-10">
              {category.name}
            </span>

            {/* Friendly hover effect overlay */}
            {activeCategory !== category.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-navy/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

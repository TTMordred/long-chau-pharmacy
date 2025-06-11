
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
      <div className="flex gap-3 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-md flex-shrink-0" />
        ))}
      </div>
    );
  }

  const allCategories = [
    { id: 'all', name: 'All Products', color_class: 'bg-slate-100 text-slate-700' },
    ...categories
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {allCategories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.name ? "default" : "outline"}
          className={`whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:scale-105 ${
            activeCategory === category.name 
              ? 'bg-primary shadow-lg' 
              : 'hover:shadow-md'
          }`}
          onClick={() => onCategoryChange(category.name)}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            activeCategory === category.name 
              ? 'bg-white' 
              : category.color_class?.split(' ')[0] || 'bg-gray-400'
          }`} />
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryNav;

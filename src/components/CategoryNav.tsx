
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CategoryNav = () => {
  const categories = [
    { name: 'Baby Care', color: 'bg-pink-100 text-pink-700', active: false },
    { name: 'Medicine', color: 'bg-green-100 text-green-700', active: true },
    { name: 'Women Care', color: 'bg-purple-100 text-purple-700', active: false },
    { name: 'Vitamins', color: 'bg-orange-100 text-orange-700', active: false },
    { name: 'Personal Care', color: 'bg-blue-100 text-blue-700', active: false },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant={category.active ? "default" : "outline"}
          className={`whitespace-nowrap ${category.active ? 'bg-primary' : ''}`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryNav;

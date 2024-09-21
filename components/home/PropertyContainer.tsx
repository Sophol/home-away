import { fetchProperties } from '@/utils/actions';
import PropertyList from './PropertyList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';

async function PropertyContainer({category, search}: {category: string, search: string}){
    const properties: PropertyCardProps[] = await fetchProperties({
        category,
        search,
      });
    if (properties.length === 0) {
        return (
          <EmptyList
            heading='No results.'
            message='Try changing or removing some of your filters.'
            btnText='Clear Filters'
          />
        );
      }
    
      return <PropertyList properties={properties} />;
}
export default PropertyContainer;
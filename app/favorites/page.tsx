import EmptyList from "@/components/home/EmptyList";
import PropertyList from "@/components/home/PropertyList";
import { fetchFavorites } from "@/utils/actions";

async function FavoritesPage(){
    const favorites = await fetchFavorites();
    if(favorites.length === 0){
        return <EmptyList />
    }else{
        return <PropertyList properties={favorites} />
    }
}
export default FavoritesPage;
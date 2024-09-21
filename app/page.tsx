import LoadingCard from "@/components/card/LoadingCard";
import CategoryList from "@/components/home/CategoryList";
import PropertyContainer from "@/components/home/PropertyContainer";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';

function HomePage({ searchParams }: {searchParams: { category?: string; search?: string }}){
  return (
    <div>
      <CategoryList 
        category={searchParams?.category}
        search={searchParams?.search}
      />
      <Suspense fallback={<LoadingCard />} >
        <PropertyContainer
          category={searchParams?.category}
          search={searchParams?.search}
        />
      </Suspense>
     
    </div>
  )
}
export default HomePage;

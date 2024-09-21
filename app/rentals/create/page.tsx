import FormInput from '@/components/form/form-input';
import FormContainer from '@/components/form/form-container';
import { createPropertyAction } from '@/utils/actions';
import SubmitButton  from '@/components/form/submit-button';
import PriceInput from '@/components/form/price-input';
import CategoriesInput from '@/components/form/categories-input';
import TextAreaInput from '@/components/form/textarea-input';
import CountriesInput from '@/components/form/countries-input';
import ImageInput from '@/components/form/image-input';
import CounterInput from '@/components/form/counter-input';
import AmenitiesInput from '@/components/form/amenities-input';
function CreatePropertyPage(){
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>create property</h1>
            <div className='border p-8 rounded'>
                <h3 className='text-lg font-medium mb-4'>General Info</h3>
                <FormContainer action={createPropertyAction}>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                        name='name'
                        type='text'
                        label='Name (20 limit)'
                        defaultValue='Cabin in Latvia'
                        />
                        <FormInput
                        name='tagline'
                        type='text '
                        label='Tagline (30 limit)'
                        defaultValue='Dream Getaway Awaits You Here!'
                        />
                        {/* price */}
                        <PriceInput />
                        {/* categories */}
                        <CategoriesInput />
                    </div>
                    {/* text area / description */}
                    <TextAreaInput name='description' labelText='Description (10 - 100 words)'/>
                    <div className='grid sm:grid-cols-2 gap-8'>
                        <CountriesInput />
                        <ImageInput />
                    </div>
                    <h3 className='text-lg mt-8 mb-4 font-medium'>Accommodation Details</h3>
                    <CounterInput detail='guests' />
                    <CounterInput detail='bedrooms' />
                    <CounterInput detail='beds' />
                    <CounterInput detail='baths' />
                    <h3 className='text-lg mt-8 mb-4 font-medium'>Amenities</h3>
                    <AmenitiesInput />
                    <SubmitButton text='create rental' className='mt-12' />
                </FormContainer>
            </div>
        </section>
    );
}

export default CreatePropertyPage;
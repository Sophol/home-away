'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FormContainer from './form-container';
import ImageInput from './image-input';
import  SubmitButton from './submit-button';
import { type actionFunction } from '@/utils/types';
import { LuUser2 } from 'react-icons/lu';

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};
function ImageInputContainer(props: ImageInputContainerProps){
    const {image, name, action,text, children} = props;
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const userIcon = (<LuUser2 className='w-24 h-24 bg-primary rounded text-white mb-4' />);
    return (
        <div>
            {image ? <Image src={image} alt={name} width={100} height={100} 
            className='w-24 h-24 object-cover rounded mb-4'/> : userIcon}
            <Button variant='outline' size='sm' onClick={() => setUpdateFormVisible((pre) => !pre)}>
                {text}
            </Button>
            {isUpdateFormVisible && <div>
                <FormContainer action={action}>
                    {children}
                    <ImageInput />
                    <SubmitButton size='sm'/>
                </FormContainer>
             </div>}
        </div>
    );
}
export default ImageInputContainer;
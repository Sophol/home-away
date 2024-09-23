'use server'
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as fs from "fs";
import { profileSchema, validateWithZodSchema, imageSchmena, propertySchema } from './schema';
import { Property } from '@prisma/client';

const getUserAuth =async () => {
    const user =  await currentUser();
    if(!user) throw new Error('Please Login to create profile');
    if(!user.privateMetadata.hasProfile) redirect('/profile/create');
    return user;
}
const renderError = (error: unknown): {message: string} =>{
    
    return {message: error instanceof Error ? error.message : 'there was an error...'};
} 
export const createProfileAction = async (prevState: any,formData: FormData) => {
    try{
        const user = await currentUser();
        if(!user) throw new Error('Please Login to create profile');
        const rawData = Object.fromEntries(formData);
        const validatedFields =  validateWithZodSchema(profileSchema, rawData);
        await db.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validatedFields
            }
        })
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true
            }
        });
        //return {message: 'profile created!'};
    }catch(error){
        return renderError(error);
    }
    redirect('/');
  };
  export const fetchProfileImage =async () => {
    const user = await currentUser();
    if(!user) return null;
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
        select: {
            profileImage: true
        }
    });
    return profile?.profileImage;
  }
  export const fetchProfile =async () => {
    const user = await getUserAuth();
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        }
    });
    if(!profile) redirect('profile/create');
    return profile;
  }
  export const updateProfileAction =async (prevState: any, formData: FormData):Promise<{message: string}> => {
    const user = await getUserAuth();
    try{
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);
        await db.profile.update({
            where: {
                clerkId: user.id
            },
            data:validatedFields
        });
        revalidatePath('/profile');
        return {message: 'profile updated successfully.'}
    }catch(error){
        return renderError(error);
    }
  }
  export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user = await getUserAuth();
    try{
        const image = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(imageSchmena, { image });
        const fullPath = await uploadImage(validatedFields.image, user.id);
        await db.profile.update({
            where: {
              clerkId: user.id,
            },
            data: {
              profileImage: fullPath,
            },
          });
        revalidatePath('/profile');
        return { message: 'Profile image updated successfully' };
    }catch(error){
        return renderError(error);
    }
  };

  export const createPropertyAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user = await getUserAuth();
    try{
        const rawData = Object.fromEntries(formData);
        const file = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        
        const validatedImage = validateWithZodSchema(imageSchmena, { image: file });
        const fullPath = await uploadProperty(validatedImage.image);
        await db.property.create({
            data: {
                ...validatedFields,
                image: fullPath,
                profileId: user.id
            }
        });
        //return { message: 'Property created successfully' };
    }catch(error){
        return renderError(error);
    }
    redirect('/');
  };

  export const fetchProperties =async ({search = '', category}: {search?: string; category?: string}) => {
    const properties = await db.property.findMany({
        where: {
            category,
            OR: [
                {name: {contains: search, mode: 'insensitive'}},
                {tagline: {contains: search, mode: 'insensitive'}}
            ]
        },
        select: {
            id: true,
            name: true,
            tagline: true,
            price: true,
            image: true,
            country: true
        }
    });
    return properties;
  }

  export const fetchFavoriteId = async ({
    propertyId,
  }: {
    propertyId: string;
  }) => {
    const user = await getUserAuth();
    
    const favorite = await db.favorite.findFirst({
        where: {
          propertyId,
          profileId: user.id,
        },
        select: {
          id: true,
        },
      });
      return favorite?.id || null;
  };
  export const toggleFavoriteAction = async (prevState: {propertyId: string; favoriteId: string | null; pathname: string;}) => {
    const user = await getUserAuth();
    const { propertyId, favoriteId, pathname } = prevState;
    try{
        if (favoriteId) {
            await db.favorite.delete({
              where: {
                id: favoriteId,
              },
            });
          } else {
            await db.favorite.create({
              data: {
                propertyId,
                profileId: user.id,
              },
            });
          }
          revalidatePath(pathname);
          return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' };
    }catch(error){
        return renderError(error);
    }
  };

  export const fetchFavorites = async () => {
    const user = await getUserAuth();
    //try{
      const favorites = await db.favorite.findMany({
        where: {
          profileId: user.id
        },
        select: {
          property: {
            select: {
              id: true,
              name: true,
              tagline: true,
              price: true,
              image: true,
              country: true
            }
          }
        }
      });
      return favorites.map((favorite) => favorite.property);
    // }catch(error){
    //     return renderError(error);
    // }
  }
  export const fetchPropertyDetails = async(id: string) => {
    return db.property.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });
  };
  
  const uploadImage = async (image: File, user_id: string) => {
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user_id
        }
    });
    if(profile){
        let filePath = `./public${profile.profileImage}`;
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    }
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.promises.writeFile(`./public/uploads/${image.name}`, buffer);
    const fullPath = `/uploads/${image.name}`;
    return fullPath;
  }
  const uploadProperty = async (image: File) => {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.promises.writeFile(`./public/properties/${image.name}`, buffer);
    const fullPath = `/properties/${image.name}`;
    return fullPath;
  }
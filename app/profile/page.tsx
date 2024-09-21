import FormContainer from '@/components/form/form-container';
import { updateProfileAction, fetchProfile, updateProfileImageAction } from '@/utils/actions';
import FormInput from '@/components/form/form-input';
import  SubmitButton from '@/components/form/submit-button';
import ImageInputContainer from '@/components/form/image-input-container';

async function ProfilePage(){
    const profile = await fetchProfile();
    return (
        <section>
          <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
          <div className='border p-8 rounded-md'>
            <ImageInputContainer image={profile.profileImage} name={profile.username} action={updateProfileImageAction} 
                text='Update Profile image'/>
            <FormContainer action={updateProfileAction}>
                <div className='grid md:grid-cols-2 gap-4 mt-4'>
                    <FormInput type='text' name='firstName' label='First Name' defaultValue={profile.firstName} />
                    <FormInput type='text' name='lastName' label='Last Name' defaultValue={profile.lastName} />
                    <FormInput type='text' name='username' label='UserName' defaultValue={profile.username} />
                </div>
                <SubmitButton text='Update Profile' className='mt-8' />
            </FormContainer>
          </div>
        </section>
      );
}
export default ProfilePage;
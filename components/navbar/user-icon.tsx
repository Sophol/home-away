import {LuUser2} from 'react-icons/lu';
import {fetchProfileImage} from '@/utils/actions'
async function UserIcon(){
    const profileImage = await fetchProfileImage();
    const urlImage = profileImage? profileImage : "";
    if(urlImage){
        return (
            <img src={urlImage} className='w-6 h-6 bg-primary rounded-full object-cover' />
        );
    }
    return <LuUser2 className='w-6 h-6 bg-primary rounded-full text-white' />
}
export default UserIcon;
import fetcher from "@/libs/fetcher";
import useSWR from "swr";
import useCurrentUser from "./useCurrentUser";
import useUser from "./useUser";
import { useCallback, useMemo } from "react";
import useLoginModal from "./useLoginModal";
import toast from "react-hot-toast";
import axios from "axios";


const useFollow = (userId: string) => {
    const { data: currentUser , mutate: mutateCurrentUser} = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(userId);

    const loginModal = useLoginModal()

    const isFollowing = useMemo(() => {
        const list = currentUser?.followingIds || [];

        return list.includes(userId)
    },[userId, currentUser?.followingIds]);

    const toggleFollow = useCallback(async() => {
        console.log('current user', currentUser)
        if(!currentUser) {
            console.log('in open modal')
            return loginModal.onOpen()
        }

        try{
            let request;

            if(isFollowing) {
                request = () => axios.delete('/api/follow', { data: { userId}})
            } else {
                request = () => axios.post('/api/follow', {userId})
            }
            await request();

            mutateCurrentUser()
            mutateFetchedUser()

            toast.success('Success')
        } catch(error) {
            toast.error("Something went wrong")
        }
    },[currentUser, isFollowing, userId, mutateCurrentUser, mutateFetchedUser, loginModal])


    return {
        isFollowing, 
        toggleFollow
    }
}

export default useFollow;
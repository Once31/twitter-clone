import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const usePost = (postId: string) => {
    const url = postId ? `/api/posts/${postId}` : null
    const { data, isLoading, error, mutate} = useSWR(url, fetcher)

    return {
        data,
        error,
        isLoading,
        mutate
    }
}


export default usePost;
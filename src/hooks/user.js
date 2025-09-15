const useGetuser = () => {
    // get from local storage
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export default useGetuser;
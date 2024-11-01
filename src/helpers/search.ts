export const searchUser = async (userName: string) => {
    try {
        const findUser = await fetch(`api/searchusers?id=${userName}`);
        const users = await findUser.json();
        return users;
    } catch (error: any) {
        console.error(error, " Issue while searching user")
        return
    }
};

export const getUser = async (userId: number) => {
    try {
        const getUser = await fetch(`/api/user?id=${userId}`);
        const data = await getUser.json();
        return data;
    } catch (error: any) {
        console.error(error, " Issue while getting user details")
        return
    }
};
export const getEntry = async (uid: string , week_no:string) => {
    try {
        const getUser = await fetch(`/api/getEntry?uid=${uid}&week=${week_no}`);
        const data = await getUser.json();
        return data;
    } catch (error: any) {
        console.error(error, " Issue while getting user details")
        return
    }
};

export const registerUser = async (username: string, email: string, phonenumber: string) => {
    try {
        const dataToSubmit = {
            username, email, phonenumber
        }
        const response = await fetch("/api/adduser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSubmit),
        });
    }
    catch (error: any) {

    }
}

export const updateUser = async (updateForm: any) => {
    try {
        const response = await fetch("/api/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateForm),
        });
    } catch (error) {
        console.error(error, "Issue while updating user")
    }
}
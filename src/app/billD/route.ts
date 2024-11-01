export const submitDate = async(selectedUserId:string,start:string,end:string) => {
    const response = await fetch(`/api/bill?id=${selectedUserId}&start=${start}&end=${end}`)
    const data = await response.json()
    console.log("THIS IS RESPONSE" ,data);
    return data;
}


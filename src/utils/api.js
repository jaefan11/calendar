export function uploadFile(data,processid){
    return axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
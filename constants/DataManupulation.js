export const deleteNullFromObj = (obj) => {
    for (const key in obj) {
        if (obj[key] == null || obj[key] == undefined || obj[key] == "") {
            delete obj[key]
        }
    }
    return obj
}

export const mediaUrl = (bucketName, mediaKey) => {
    return `https://${bucketName}.s3.eu-central-1.amazonaws.com/${mediaKey}`
}
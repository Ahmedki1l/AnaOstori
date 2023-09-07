export const deleteNullFromObj = (obj) => {
    for (const key in obj) {
        if (obj[key] == null || obj[key] == undefined || obj[key] == "") {
            delete obj[key]
        }
    }
    return obj
}

export const mediaUrl = (bucketName, mediaKey) => {
    if (bucketName == null) {
        return '/images/anaOstori.png'
    }
    return `https://${bucketName}.s3.eu-central-1.amazonaws.com/${mediaKey}`
}

export const stringUpdation = (value, digit) => {
    if (value?.length > digit) {
        return `${value.slice(0, 15)}...`
    } else {
        return value
    }
}
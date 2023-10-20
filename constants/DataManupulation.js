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
        return null
    }
    return `https://${bucketName}.s3.eu-central-1.amazonaws.com/${mediaKey}`
}

export const stringUpdation = (value, digit) => {
    if (value?.length > digit) {
        return `${value.slice(0, 10)}...`
    } else {
        return value
    }
}

export const secondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
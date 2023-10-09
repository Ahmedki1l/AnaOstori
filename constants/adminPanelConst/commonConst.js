export const noOfItemTag = (noOfItem) => {
    if (noOfItem == 0) {
        return 'مافي عناصر'
    }
    else if (noOfItem == 1) {
        return 'عنصر واحد'
    }
    else if (noOfItem == 2) {
        return 'عنصرين'
    }
    else if (noOfItem > 2) {
        return `${noOfItem} عناصر `
    }
    else if (noOfItem > 10) {
        return `${noOfItem} عنصر `
    }
}

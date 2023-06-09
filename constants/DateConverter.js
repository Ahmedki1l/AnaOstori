export const fullDate = (date) => {
    return new Date(date)?.toLocaleDateString('ar-AE', { timeZone: "UTC", day: 'numeric', month: 'long', year: 'numeric' })
}

export const dateRange = (dateFrom, dateTo) => {
    return (
        <>
            {`${new Date(dateFrom)?.toLocaleDateString('ar-AE', { timeZone: "UTC", day: 'numeric', month: 'long' })} 
        - 
              ${new Date(dateTo)?.toLocaleDateString('ar-AE', { timeZone: "UTC", day: 'numeric', month: 'long' })}`}
        </>
    )
}

export const timeDuration = (timeFrom, timeTo) => {
    return (
        <>
            {` ${new Date('1970-01-01T' + timeFrom + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}
                                                    إلى
              ${new Date('1970-01-01T' + timeTo + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}
        </>
    )
}

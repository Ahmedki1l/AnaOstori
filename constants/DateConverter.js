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

export const dateWithDay = (date) => {
    const month = new Date(date).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
    const dateNumber = new Date(date).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
    const day = new Date(date).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

    return `${day} ${dateNumber} ${month}`
}

export const timeDuration = (timeFrom, timeTo) => {
    return (
        <>
            {` ${new Date('1970-01-01T' + timeFrom + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}
                                                    إلى
               ${new Date('1970-01-01T' + timeTo + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} `}
        </>
    )
}

export const enDateWithDay = (date) => {
    return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', weekday: 'long' })
}

export const enTimeDuration = (timeFrom, timeTo) => {
    const enStartTime = new Date('1970-01-01T' + timeFrom + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })
    const enEndTime = new Date('1970-01-01T' + timeTo + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })
    return `${enStartTime} - ${enEndTime}`
}
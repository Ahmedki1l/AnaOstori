import React from 'react'

export async function getServerSideProps(contex) {
    if (contex?.query.attendanceKey == undefined) {
        return {
            notFound: true,
        };
    }
}

export default function Index() {
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    )
}

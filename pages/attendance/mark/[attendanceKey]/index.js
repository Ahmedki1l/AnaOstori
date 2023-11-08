import React from 'react'

export async function getServerSideProps(contex) {
    if (contex?.query.courseId == undefined) {
        return {
            notFound: true,
        };
    }
}

const Index = () => {
    return (
        <div>Index</div>
    )
}

export default Index
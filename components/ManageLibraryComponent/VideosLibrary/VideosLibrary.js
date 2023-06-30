import React from 'react'
import ManageLibraryTableComponent from '../../CommonComponents/ManageLibraryTableComponent/ManageLibraryTableComponent'

const VideosLibrary = ({ setIsModalForAddItem }) => {
    return (
        <div>
            <ManageLibraryTableComponent setIsModalForAddItem={setIsModalForAddItem} />
        </div>
    )
}

export default VideosLibrary    
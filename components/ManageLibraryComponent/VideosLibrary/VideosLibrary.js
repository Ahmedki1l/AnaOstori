import React from 'react'
import ManageLibraryTableComponent from '../../CommonComponents/ManageLibraryTableComponent/ManageLibraryTableComponent'

const VideosLibrary = ({ onclose, folderTableData }) => {
    return (
        <div>
            <ManageLibraryTableComponent onclose={onclose} folderTableData={folderTableData} />
        </div>
    )
}

export default VideosLibrary    
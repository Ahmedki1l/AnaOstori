import React from 'react'
import ManageLibraryTableComponent from '../../CommonComponents/ManageLibraryTableComponent/ManageLibraryTableComponent'

const ExamsLibrary = ({ onclose, folderTableData }) => {
    return (
        <div>
            <ManageLibraryTableComponent onclose={onclose} folderTableData={folderTableData} />
        </div>
    )
}

export default ExamsLibrary
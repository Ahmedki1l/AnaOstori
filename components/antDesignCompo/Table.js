import React, { useState } from 'react';
import { Table as AntdTable } from 'antd';
import styled from 'styled-components';

const StyledTable = styled(AntdTable)`
    padding: 0;
    border-radius:0
`
// rowSelection object indicates the need for row selection
// const rowSelection = {
//     onChange: (selectedRowKeys, selectedRows) => {
//         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//     },
//     getCheckboxProps: (record) => ({
//         disabled: record.name === 'Disabled User',
//         // Column configuration not to be checked
//         name: record.name,
//     }),
// };
const Table = ({
    tableColumns,
    rowSelection,
    tableData,
    selectedItem
}) => {
    console.log(selectedItem);
    return (
        <div>
            <StyledTable
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={tableData}
                pagination={false}
            />
        </div>
    );
};
export default Table;
import React, { useState } from 'react';
import { Table as AntdTable } from 'antd';
import styled from 'styled-components';

const StyledTable = styled(AntdTable)`
    padding: 0;
    border-radius:0;
`

const Table = ({
    tableColumns,
    rowSelection,
    tableData,
    minheight,
    setSelectedItems,
}) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedItems(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelectionForItem = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div>
            <StyledTable
                rowSelection={!rowSelection ? rowSelection : rowSelectionForItem}
                columns={tableColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{
                    y: minheight,
                }}
            />
        </div>
    );
};
export default Table;
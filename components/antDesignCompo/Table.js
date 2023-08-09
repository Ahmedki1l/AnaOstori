import React, { useEffect } from 'react';
import { Table as AntdTable } from 'antd';
import styled from 'styled-components';
import Spinner from '../CommonComponents/spinner';
import Empty from '../CommonComponents/Empty';

const StyledTable = styled(AntdTable)`
    padding: 0;
    border-radius:0;
`

const Table = ({
    tableColumns,
    rowSelection,
    tableData,
    minheight,
    onItemSelection,
    tableLoading,
    onEmptyBtnClick,
    selectedItems,
}) => {

    const onSelectChange = (newSelectedRowKeys) => {
        onItemSelection(newSelectedRowKeys)
    };

    const rowSelectionForItem = {
        selectedItems,
        onChange: onSelectChange,
    };

    const CustomLoadingIndicator = (
        <Spinner borderwidth={5} width={3} height={3} />
    );

    const handleCreateFolder = () => {
        onEmptyBtnClick()
    }

    const customEmptyComponent = (
        <Empty buttonText={'الإنتقال إلى إدارة المكتبة'} emptyText={'لم تقم بإضافة اي مجلد'} containerhight={200} onClick={() => handleCreateFolder()} />
    )

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
                loading={{ indicator: CustomLoadingIndicator, spinning: tableLoading }}
                locale={{ emptyText: customEmptyComponent }}
            />
        </div>
    );
};
export default Table;
import { Table } from 'antd'
import React from 'react'
import Empty from '../Empty'

const CustomOrderListComponent = ({ data }) => {
    const customEmptyComponent = (
        <Empty emptyText={'لم يتم العثور على أية بيانات'} containerhight={300} />
    )
    return (
        <div className='mt-4'>
            <Table
                columns={data?.tableColumns}
                minheight={400}
                dataSource={data?.dataSource}
                pagination={data?.paginationConfig}
                locale={{ emptyText: customEmptyComponent }}
                onChange={data?.handleTableChange}
            />
        </div>
    )
}

export default CustomOrderListComponent
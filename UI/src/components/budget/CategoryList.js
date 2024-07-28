import { List } from 'antd';
import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { getIndianMoneyFormat } from '../../helper';

const CategoryList = ({ list }) => {
    
    return (
        <div className='categoryListDiv'>
            <h2>Categories</h2>
            <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <MoreOutlined />,
                            // <a key="list-loadmore-more">more</a>
                        ]}
                    >
                        {/* <Skeleton avatar title={false} loading={item.loading} active> */}
                        {/* <List.Item.Meta
                            avatar={<Avatar src={item.picture.large} />}
                            title={<a href="https://ant.design">{item.name?.last}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        /> */}
                        <div style={{ margin: '0 1%', width: '25%' }}>{item.name}</div>
                        <div>₹ {getIndianMoneyFormat(item.totalBudget)}</div>
                        {/* </Skeleton> */}
                    </List.Item>
                )}
            />
        </div>
    )
}

export default CategoryList;
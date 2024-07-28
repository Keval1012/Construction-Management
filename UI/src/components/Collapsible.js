import { Collapse } from 'antd';
import React from 'react';

const Collapsible = ({ label, children }) => {
    return (
        <>
            <Collapse
                // collapsible="header"
                defaultActiveKey={['1']}
                className='collapseCard'
                ghost
                items={[
                    {
                        key: '1',
                        label: label,
                        children: children,
                    },
                ]}
            />
        </>
    )
}

export default Collapsible;
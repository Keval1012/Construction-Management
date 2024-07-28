import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { filterSelectData } from '../constants';
import AppButton from './AppButton';
import Selectable from './Selectable';

const FilterBox = ({
    active,
    isCard = false,
    handleChangeFilterInput,
    onFilterValues,
    onChangeActiveFilter,
    extraFilter = false,
    extraFilterBox,
    labelName = false
}) => {
  return (
    <Row className={(isCard ? 'filterBox' : '') || (labelName ? 'labelRangeStyle' : '')}>
        <Row className={labelName ? 'labelRangeStyle' : 'firstRow'} align='bottom' justify='space-between'>
            <Col xl={{ span: 16 }} lg={{ span: 16 }} md={{ span: 16 }} sm={{ span: 16 }} xs={{ span: 16 }} className='searchCategoryDiv'>
                <Row>
                    <Col xl={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }} xs={{ span: 22 }}>
                        <Form>
                        {/* <TextInput className='searchInput' placeholder='Search here...' onChange={(e) => handleChangeFilterInput(e)} /> */}
                            <Input className='searchInput' placeholder='Search here...' onChange={(e) => handleChangeFilterInput(e)} />
                        </Form>
                    </Col>
                    <Col xl={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }}>
                        <AppButton label='Filter' className='filterBtn' onClick={() => onFilterValues()} />
                    </Col>
                </Row>
            </Col>
            {(active === true || active === false) &&
                <Col xl={{ span: 4 }} lg={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} xs={{ span: 4 }}>
                    <Form>
                        <Selectable
                            name='isActiveFilter'
                            defaultVal={active ? '1' : '0'}
                            firstName='name'
                            data={filterSelectData}
                            onChange={onChangeActiveFilter}
                        />
                    </Form>
                </Col>
            }
            {extraFilter &&
                <>
                    {extraFilterBox}
                </>
            }
        </Row>
    </Row>
  )
}

export default FilterBox;
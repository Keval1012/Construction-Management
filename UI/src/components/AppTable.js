import { Pagination, Row, Table } from "antd";
import React from "react";
import '../styles/table.css';

const AppTable = ({ 
  handleSort, 
  handlePageChange, 
  currentPage,
  setCurrentPage,
  rowClass = '',
  isSmallWidth = false,
  columns, 
  dataSource, 
  paginationTotal, 
  pageSize,
  showSizeChanger,
  onShowSizeChange,
  pagination = false,
  ...props 
}) => { 

  const getRowClassName = (r, i) => {
    if (i % 2 && rowClass) return `evenRow ${rowClass}` 
    if (!(i % 2) && rowClass) return `oddRow ${rowClass}`;
    if (i % 2) return `evenRow` 
    if (!(i % 2)) return `oddRow`;
    return '';
  };

  return (
    <>
      <Row justify="center">
        <Table
            {...props}
            onChange={handleSort}
            rowClassName={(r, i) => getRowClassName(r, i)}
            // pagination={{ pageSize: pageSize }}
            // pagination={false}
            pagination={pagination}
            className="dataTable"
            style={{ width: isSmallWidth ? '90%' : '100%' }}
            columns={columns}
            dataSource={dataSource}
        />
        </Row>
        <Row className="paginationMainRow">
            <div className="paginationDiv">
                <Row align="middle">
                {/* <button onClick={() => setCurrentPage(1)} className="paginationBtn">First</button> */}
                <Pagination
                    className="tablePagination"
                    total={paginationTotal}
                    current={currentPage}
                    onChange={handlePageChange}
                    pageSize={pageSize}
                    showSizeChanger={showSizeChanger}
                    onShowSizeChange={onShowSizeChange}
                    // itemRender={itemRender}
                />
                {/* <button onClick={() => setCurrentPage(Math.ceil(paginationTotal/pageSize))} className="paginationBtn">Last</button> */}
                </Row>
            </div>
        </Row>
    </>
  );
};

export default AppTable;

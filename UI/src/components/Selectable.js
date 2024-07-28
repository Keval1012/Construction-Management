import React from "react";
import { Form, Select } from "antd";

const Selectable = ({
  handleSelectChange,
  handleSelectSearch,
  filterOption,
  optionFilterProp,
  isMultiple = false,
  isNested = false,
  isAddUser = false,
  showSearch = false,
  allowClear = false,
  firstName = '',
  secondName = '',
  defaultVal,
  data,
  refName = null,
  nestedData,
  name,
  label,
  placeholder,
  required = false,
  requiredMsg,
  ...props
}) => {
  const { Option, OptGroup } = Select;

  const getFirstName = (item) => {
    let val = '';
    if (firstName) {
      let arr = firstName?.split('.'); 
      if (arr?.length === 2) {
        val = item[`${arr[0]}`] ? item[`${arr[0]}`][`${arr[1]}`] : '';
      } else if (arr?.length === 3) {
        val = (item[`${arr[0]}`] && item[`${arr[0]}`][`${arr[1]}`]) ? item[`${arr[0]}`][`${arr[1]}`][`${arr[2]}`] : '';
      } else {
        val = item[firstName];
      }
    }
    return val ? val : ''
  };

  return (
    <Form.Item
      className={(isMultiple || isAddUser) ? 'filterItem' : 'filterItemDrop'} 
      name={name}
      initialValue={defaultVal}
      label={label}
      rules={[
        {
          required: required,
          message: requiredMsg
        }
      ]}
    >
      {isMultiple ? (
        <Select
          mode='multiple'
          placeholder={placeholder}
          onChange={(value) => handleSelectChange(value)}
          optionLabelProp="label"
          ref={refName}
          maxTagCount={2}
          showArrow
          {...props}
          // maxTagTextLength={1}
        >
          {data &&
            data.map((o, i) => {
              return (
                <Option key={i} value={o._id} label={o.name}>
                  <div>{o.name} - {o.rate}</div>
                </Option>
              );
            })}
        </Select>
      ) : isNested ? (
        <Select
          placeholder={placeholder}
          // style={{ width: 180 }}
          showSearch={showSearch}
          ref={refName}
          filterOption={filterOption}
          optionFilterProp={optionFilterProp}
          onSearch={handleSelectSearch}
          className="dropDownSelectWidth"
          onChange={(value) => handleSelectChange(value)}
          allowClear={allowClear}
          {...props}
        >
          {nestedData &&
            nestedData.map((item, i) => {
              return (
                <>
                  <OptGroup key={i} label={item.name}>
                    {item?.childs?.length > 0 && item?.childs.map((child, index) => {
                      return (
                        <Option value={child._id}>{child.name} - {child.rate}</Option>
                      )
                    })}
                  </OptGroup>
                </>
              );
            })}
        </Select>
      ) : (
        <Select
          placeholder={placeholder}
          showSearch={showSearch}
          ref={refName}
          // style={{ width: 180 }}
          className="dropDownSelectWidth"
          onChange={(value) => handleSelectChange(value)}
          allowClear={allowClear}
          {...props}
        >
          {data &&
            data.map((item, i) => {
              return (
                <>
                  {secondName ?
                    <Option key={i} value={item._id}>
                      {/* {item.name} - {item.shortName} */}
                      {item[firstName]} - {item[secondName]}
                    </Option>
                    :
                    <Option key={i} value={item._id}>
                      {/* {item[firstName]} */}
                      {getFirstName(item)}
                      {/* {firstName?.split('.')?.length > 0 ?  : item[firstName]} */}
                    </Option>
                  }
                </>
              );
            })}
        </Select>
      )}
    </Form.Item>
  );
};

export default Selectable;  
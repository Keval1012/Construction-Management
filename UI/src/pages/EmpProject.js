import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { getAllTasksByEmployeeId } from '../API/Api';
import { AuthContext } from '../context/AuthProvider';

const EmpProject = () => {

    const initialColumns = [
        {
          key: "projectName",
          title: "Project Name",
          dataIndex: "projectName",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "completionDate",
          title: "Completion Date",
          dataIndex: "completionDate",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "status",
          title: "Status",
          dataIndex: "status",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "priority",
          title: "Priority",
          dataIndex: "priority",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
    ];

    const initialColumnsForTasks = [
        {
          key: "taskName",
          title: "Task Name",
          dataIndex: "taskName",
          sorter: false,
        //   width: '5%',
          render: (val) => {
            // debugger
            val ? <div>{val}</div> : <div>-</div>
            // val ? <div>{employeeNewProjectList?.find(o => o?.taskName === val)?.name}</div> : <div>-</div>
            // val ? <div>{employeeNewProjectList?.map((o) => o._id)}</div> : <div>-</div>
          }
        },
        {
          key: "dueDate",
          title: "Due Date",
          dataIndex: "dueDate",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "completionPercent",
          title: "Completion Percent",
          dataIndex: "completionPercent",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "description",
          title: "Description",
          dataIndex: "description",
          sorter: false,
        //   width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            sorter: false,
            // width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
          },
          {
            key: "priority",
            title: "Priority",
            dataIndex: "priority",
            sorter: false,
            // width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
          },
    ];


    const { userId, currentRole } = useContext(AuthContext)??{};
    const [employeeProjectList, setEmployeeProjectList] = useState([]);
    const [employeeNewProjectList, setEmployeeNewProjectList] = useState([]);
    const [employeeNewProjectList1, setEmployeeNewProjectList1] = useState([]);

    const [employeeProjectColumns, setEmployeeProjectColumns] = useState(initialColumns);
    const [employeeTaskColumns, setEmployeeTaskColumns] = useState(initialColumnsForTasks);

    useEffect(() => {
      fetchAllTasksByEmployee();
    }, []);

    useEffect(() => {
      fetchAllTasksByEmployee();
    }, [JSON.stringify(currentRole), JSON.stringify(userId)]);
    
    useEffect(() => {
      // debugger
      // if (employeeNewProjectList.length > 0) {
        const newArray = employeeProjectList.map((element) => {
          return Object.assign({}, element, element.project);
        });
      setEmployeeNewProjectList(newArray);
      console.log('o', employeeNewProjectList);
      // }
    })

    if (employeeProjectList.length > 0) {
      // debugger
      // const newArray = employeeProjectList.map((element)=>{
      //   element=Object.assign({}, element, element.project);
      // })
      // console.log('object1', newArray);
      // setEmployeeProjectList1(employeeProjectList);
      // console.log('object', employeeProjectList1);
    }

      // const newArr = () => {
      //   debugger
      //   employeeProjectList.map((element)=>{
      //     element=Object.assign({}, element, element.project);
      //   })
      //   setEmployeeProjectList1(employeeProjectList);
      //   console.log('object1', employeeProjectList1);
      // }
      // console.log('object32', newArr)

      // debugger

      // const newArray = employeeProjectList.map((element) => {
      //   return Object.assign({}, element, element.project);
      // });
      // setEmployeeNewProjectList(newArray);
      // console.log('o', employeeNewProjectList);
      


    const fetchAllTasksByEmployee = async () => {
        // debugger
        if (currentRole === 'employee' && userId) {
            const res = await getAllTasksByEmployeeId(userId, ['medium', 'high', 'critical']);
            if (res?.data?.status === 200) {
                setEmployeeProjectList(res?.data?.data);
                // setPaginationTotal(res.data?.totalLength);
            }
        }
    };
    console.log('list', employeeProjectList);
    

    // employeeProjectList.map((element)=>{
    //   element=Object.assign({}, element, element.project);
    // })
    // setEmployeeProjectList1(employeeProjectList);
    // console.log('object', employeeProjectList1);


    let output=[];
    for(let item of employeeProjectList){
        output.push(item.project); 
    }
    console.log('op', output);
    
    let output1=[];
    for(let item of employeeNewProjectList){
        output.push(item.tasks); 
    }
    console.log('ops', output1);

    // const children = employeeProjectList.concat(result);
    // console.log('con' ,children)


    // const newObj = Object.assign({}, obj, obj.criteria);
    // const newObj = employeeProjectList.assign({}, obj, obj.project);
    // delete newObj.criteria;
    // console.log(result1);


    // debugger
    // for (var key in employeeNewProjectList.map((o) => o.tasks)) { 
    //   debugger
    //   // Console logs all the values in the objArr Array: 
    //   console.log('sk', employeeNewProjectList.map((o) => o.tasks)[key]); 
    // }
    const a = employeeNewProjectList?.map((o) => o.tasks);
    console.log('os', a);

      
      const expandedRow = row => {
        // debugger

        console.log('row',row);
        let inTable = (row._id == row.tasks.map((o) => o.projectId)) ? employeeNewProjectList : '';
        return <Table columns={initialColumnsForTasks} dataSource={inTable} pagination={false} />;
      };

    
  return (
    <div>
        <Table columns={initialColumns} expandedRowRender={expandedRow} dataSource={employeeNewProjectList} />
    </div>
  )
}

export default EmpProject;
import React, { useEffect, useRef, useState } from 'react';
import { GanttOriginal, ViewMode as vm } from "react-gantt-chart";
// import Gantt from 'react-ganttastic';
// import 'react-ganttastic/dist/styles.css';
import { Gantt, ViewMode } from 'gantt-chart-react';
import { addMilestone, getAllMilestonesOfProject, updateMilestone } from '../../API/Api';
import { Alert, Button, Col, Row, message } from 'antd';
import AppButton from '../AppButton';
import AppModal from '../AppModal';
import AddEditMilestone from './AddEditForm';
import dayjs from 'dayjs';
import DataView from '@grapecity/dataviews.react';
import { GridLayout } from '@grapecity/dataviews.grid';
// load gantt view plugin
import '@grapecity/dataviews.gantt';
import ReactGantt, { GanttRow } from 'react-gantt';

const Milestone = ({ defaultProject }) => {

	const ganttRef = useRef(null);
	const testData = [
		{
			id: '1',
			name: 'SITE DESIGN',
			description: 'SITE DESIGN',
			start: 'Jan 01,2018',
			end: 'Jan 10,2018',
			percentComplete: 0.3,
			resources: 'Steve, David, Wilson, Clark, Smith',
		},
		{
			id: '2',
			parentID: '1',
			name: 'MARKET RESEARCH',
			description: 'MARKET RESEARCH',
			start: 'Jan 01,2018',
			end: 'Jan 10,2018',
			percentComplete: 0.7,
			resources: 'Steve, David',
		},
		{
			id: '3',
			parentID: '1',
			predecessorID: '2',
			name: 'VISUAL DESIGN',
			description: 'VISUAL DESIGN',
			start: 'Jan 11,2018',
			end: 'Jan 16,2018',
			percentComplete: 0.1,
			resources: 'Wilson',
		},
		{
			id: '4',
			parentID: '1',
			predecessorID: '3',
			name: 'PROGRAMMING',
			description: 'PROGRAMMING',
			start: 'Jan 16,2018',
			end: 'Jan 29,2018',
			percentComplete: 0.45,
			resources: 'Steve, Clark, Smith',
		},
	];

	const cols = [
		{
		  id: 'id',
		  caption: 'Id',
		  dataField: 'id',
		  width: 80,
		},
		{
		  id: 'start',
		  caption: 'Start',
		  dataField: 'start',
		  width: 100,
		  dataType: 'date',
		  format: 'mmm dd,yyyy',
		},
		{
		  id: 'end',
		  caption: 'End',
		  dataField: 'end',
		  width: 100,
		  dataType: 'date',
		  format: 'mmm dd,yyyy',
		},
		{
		  id: 'gantt',
		  ganttColumn: {
			timeLineScale: 'month',
			scale: 300,
			start: 'start',
			end: 'end',
			text: 'description',
		  },
		  width: '*',
		},
		{
		  id: 'description',
		  caption: 'Description',
		  dataField: 'description',
		  visible: false,
		},
		{
		  id: 'resources',
		  caption: 'Resources',
		  dataField: 'resources',
		  visible: false,
		},
		{
		  id: 'predecessorID',
		  caption: 'predecessorID',
		  dataField: 'predecessorID',
		  visible: false,
		  allowEditing: false,
		},
		{
		  id: 'parentID',
		  caption: 'parentID',
		  dataField: 'parentID',
		  visible: false,
		  allowEditing: false,
		},
	];
	  
	const layout = new GridLayout({
		colHeaderHeight: 48,
		rowHeight: 48,
		allowEditing: true,
		editRowTemplate: '#popupTemplate',
		editMode: 'popup',
		hierarchy: {
			keyField: 'id',
			parentField: 'parentID',
			collapsed: false,
			column: 'id',
				footer: {
					visible: false,
				},
			},
	});

	const [tasks, setTasks] = useState([
		// {
		// 	type: "project",
		// 	id: "ProjectSample",
		// 	name: "1.Project",
		// 	start: new Date(2023, 6, 1),
		// 	end: new Date(2023, 9, 30),
		// 	progress: 25,
		// 	hideChildren: false,
		// },
		// {
		// 	type: "task",
		// 	id: "Task 0",
		// 	name: "1.1 Task",
		// 	start: new Date(2023, 6, 1),
		// 	end: new Date(2023, 6, 30),
		// 	progress: 45,
		// 	project: "ProjectSample",
		// },
		// {
		// 	type: "task",
		// 	id: "Task 1",
		// 	name: "1.2 Task",
		// 	start: new Date(2023, 7, 1),
		// 	end: new Date(2023, 7, 30),
		// 	progress: 25,
		// 	dependencies: ["Task 0"],
		// 	project: "ProjectSample",
		// },
		// {
		// 	type: "task",
		// 	id: "Task 2",
		// 	name: "1.3 Task",
		// 	start: new Date(2023, 6, 1),
		// 	end: new Date(2023, 7, 30),
		// 	progress: 10,
		// 	dependencies: ["Task 1"],
		// 	project: "ProjectSample",
		// },
		// {
		// 	type: "milestone",
		// 	id: "Task 6",
		// 	name: "1.3.1 MileStone (KT)",
		// 	start: new Date(2023, 6, 1),
		// 	end: new Date(2023, 6, 30),
		// 	progress: 100,
		// 	dependencies: ["Task 2"],
		// 	project: "ProjectSample",
		// }
	]);
	const [formatedTasks, setFormatedTasks] = useState([]);
	const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
	const [defaultMilestone, setDefaultMilestone] = useState(null);
	const [isEditMilestone, setIsEditMilestone] = useState(false);
	const [isDataUpdate, setIsDataUpdate] = useState(false);
	const [toUpdateMilestoneList, setToUpdateMilestoneList] = useState([]);

	// useEffect(() => {
	// 	fetchMilestonesOfProjects();
	// }, []);

	useEffect(() => {
		fetchMilestonesOfProjects();
		// if (defaultProject && !tasks?.find(o => o.id === defaultProject?._id)) {
		// 	setTasks([{
		// 		type: 'project',
		// 		id: defaultProject?._id,
		// 		name: defaultProject?.projectName,
		// 		start: new Date(defaultProject?.startDate),
		// 		end: new Date(defaultProject?.completionDate),
		// 		progress: defaultProject?.completionPercentage,
		// 		hideChildren: false,
		// 	}, ...tasks]);
		// }
	}, [JSON.stringify(defaultProject)]);

	useEffect(() => {
		if (tasks?.length === 0) {
			setFormatedTasks([
				{
					type: 'project',
					id: defaultProject?._id,
					name: defaultProject?.projectName,
					start: new Date(defaultProject?.startDate),
					end: new Date(defaultProject?.completionDate),
					progress: defaultProject?.completionPercentage,
					hideChildren: false,
				},
				...tasks
			]);
		}
		if (tasks?.length > 0) {
			let list = tasks;
			if (!list.find(o => o.type === 'project')) {
				list = [{
					type: 'project',
					id: defaultProject?._id,
					name: defaultProject?.projectName,
					start: new Date(defaultProject?.startDate),
					end: new Date(defaultProject?.completionDate),
					progress: defaultProject?.completionPercentage,
					hideChildren: false,
				}, ...list ];
			}
			setFormatedTasks(
				list.map(o => {
					if (o?.type === 'project') return o;
					else return {
							type: 'task',
							id: o?._id,
							name: o?.milestoneName,
							milestoneNumber: o?.milestoneNumber,
							start: new Date(o?.startDate),
							end: new Date(o?.endDate),
							progress: o?.progress,
							dependencies: [o?.dependencies],
							project: o?.projectId,
						}
			}));
		}
	}, [JSON.stringify(tasks)]);

	const fetchMilestonesOfProjects = async () => {
		if (defaultProject) {
			const res = await getAllMilestonesOfProject(defaultProject?._id);
			if (res?.data?.success) {
				setTasks(res?.data?.data);
			}
		}
	};

	const handleExpanderClick = (task) => {
		console.log("On expander click Id:" + task.id);
		setFormatedTasks(() => formatedTasks.map((t) => (t.id === task.id ? task : t)));
	};

	const handleMilestoneModal = () => {
		setMilestoneModalOpen(!milestoneModalOpen);
	};

	const handleDoubleClick = (task) => {
		if (task?.type === 'task') {
			let milestoneData = tasks?.find(o => o?._id === task?.id);
			setDefaultMilestone(milestoneData);
			setIsEditMilestone(true);
			setMilestoneModalOpen(true);
		}
	};

	const handleTaskDataChange = (task, val, val1) => {
		console.log(task, val, val1);
		let temp = toUpdateMilestoneList?.find(o => o.id === task.id);
		if (temp) setToUpdateMilestoneList(() => toUpdateMilestoneList.map((t) => (t.id === task.id ? task : t)));
		else setToUpdateMilestoneList([ ...toUpdateMilestoneList, task ]);
		setFormatedTasks(() => formatedTasks.map((t) => (t.id === task.id ? task : t)));
		setIsDataUpdate(true);
	};

	const handleMilestoneFormValues = async (form) => {
		const { milestoneName, milestoneNumber, milestoneStartDate, milestoneEndDate, milestoneStatus, milestonePriority, milestoneProgress, milestoneDescription, milestoneDependencies } = form.getFieldsValue();

		if (milestoneName && milestoneDescription && milestoneStartDate && milestoneEndDate && milestonePriority && milestoneStatus && (milestoneProgress).toString()) {
			if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
				return;
			}

			let data = {
				milestoneName: milestoneName,
				milestoneNumber: milestoneNumber ? milestoneNumber : '',
				projectId: defaultProject?._id,
				description: milestoneDescription,
				startDate: milestoneStartDate,
				endDate: milestoneEndDate,
				dependencies: milestoneDependencies ? milestoneDependencies : '',
				priority: milestonePriority,
				status: milestoneStatus,
				progress: milestoneProgress,
			};

			if (isEditMilestone) {
				try {

					const res = await updateMilestone(defaultMilestone?._id, data);
					if (res.data?.success) {
						setMilestoneModalOpen(false);
						message.success(defaultMilestone.milestoneName + ' Milestone Updated Successfully');
						fetchMilestonesOfProjects();
						return;
					} else message.error(res.data?.message);

				} catch (error) {
					message.error('Something went wrong' + error);
				}
			}

			if (!isEditMilestone) {
				try {
					const res = await addMilestone(data);
					if (res.data?.success) {
						setMilestoneModalOpen(false);
						message.success('Milestone Added Successfully')
						fetchMilestonesOfProjects();
						return;
					} else {
						message.error(res.data?.message);
					}

				} catch (error) {
					// message.error('Something went wrong' + error);
					message.error(error.response.data.error);
				}
			}

		} else {
			message.error('Please Add Required Fields');
		}

	};

	const updateMilestoneChanges = async () => {
		let isUpdate = true;

		toUpdateMilestoneList.forEach(async (o) => {
			let data = {
				startDate: o?.start,
				endDate: o?.end,
				progress: o?.progress,
				// dependencies: milestoneDependencies ? milestoneDependencies : '',
			};

			const update = await updateMilestone(o.id, data);
			if (update.data?.status !== 200) {
				message.error("Something went wrong!");
				isUpdate = false;
			}
		});

		if (isUpdate) {
			message.success('Updated Successfully.');
			setIsDataUpdate(false);
		}
	};

	const CustomGanttChart = ({ tasks, onTaskClick }) => {
		const handleTaskClickIn = (task) => {
			onTaskClick(task.id);
		};

		const calculateTaskWidth = (task) => {
			const startDate = new Date(task.start);
			const endDate = new Date(task.end);
			const totalTime = endDate - startDate;
			const totalDays = totalTime / (1000 * 60 * 60 * 24);
			return `${totalDays}px`;
		};

		const calculateDependencyArrowPosition = (task) => {
			if (!task.dependencies || task.dependencies.length === 0) {
			  return null;
			}
		
			const dependencyId = task.dependencies[0]; // Assuming a task has only one dependency
			const dependencyTask = tasks.find((t) => t.id === dependencyId);
		
			if (!dependencyTask) {
			  return null;
			}
		
			const dependencyTaskWidth = calculateTaskWidth(dependencyTask);
			return `calc(${dependencyTaskWidth} + 5px)`; // Adjust as needed
		  };

		return (
			<div>
				{/* <GanttOriginal tasks={formatedTasks} /> */}

				{/* <div>
					{formatedTasks.map((task) => (
					<div key={task?.id} onClick={() => handleTaskClickIn(task?.id)}>
						<div>{task?.name}</div>
						<div>Type: {task?.type}</div>
						<div>Progress: {task?.progress}%</div>
						<div>Dependencies: {task?.dependencies?.join(', ')}</div>
					</div>
					))}
				</div> */}
				<div className="gantt-chart">
					{tasks && tasks?.length > 0 && tasks?.map((task) => (
						<div key={task?.id} className="task-container">
						<div
							className="task-bar"
							style={{
							width: calculateTaskWidth(task),
							backgroundColor: task.color || '#3498db',
							}}
						>
							<div
							className="progress-indicator"
							style={{ width: `${task?.progress}%` }}
							/>
						</div>

						<div className="task-details">
							<div>{task?.name}</div>
							<div>{dayjs(new Date(task?.start)).format('DD/MM/YYYY')}</div>
							<div>{dayjs(new Date(task?.end)).format('DD/MM/YYYY')}</div>
						</div>
						{task?.dependencies && task?.dependencies?.length > 0 &&
							task?.dependencies?.map((dependencyId) => (
							// <div
							// 	key={`arrow-${task?.id}-${dependencyId}`}
							// 	className="dependency-arrow"
							// />
							<svg className="dependency-arrow">
								<line
									x1="0"
									y1="50%"
									x2={calculateDependencyArrowPosition(task)}
									y2="50%"
									stroke="#ecf0f1"
									strokeWidth="2"
									markerEnd="url(#arrowhead)"
								/>
								<defs>
									<marker
									id="arrowhead"
									markerWidth="6"
									markerHeight="6"
									refX="3"
									refY="3"
									orient="auto"
									>
									<polygon points="0 0, 6 3, 0 6" fill="#ecf0f1" />
									</marker>
								</defs>
							</svg>
						))}
						</div>
					))}
				</div>
			</div>
		);
	};

	const handleTaskClick = (val) => {
		console.log(val);
	};

	// const [dependencies, setDependencies] = useState([
	// 	{ id: 1, from: 1, to: 2 },
	// 	{ id: 2, from: 2, to: 3 },
	//   ]);
	
	//   const [items, setItems] = useState([
	// 	{ id: 1, content: 'Task 1', start: '2023-01-01', end: '2023-01-05' },
	// 	{ id: 2, content: 'Task 2', start: '2023-01-06', end: '2023-01-10' },
	// 	{ id: 3, content: 'Task 3', start: '2023-01-11', end: '2023-01-15' },
	//   ]);

	//   const handleItemMove = (newItems) => {
	// 	setItems(newItems);
	//   };
	
	//   const handleItemResize = (newItems) => {
	// 	setItems(newItems);
	//   };
	
	//   const handleDependencyUpdate = (newDependencies) => {
	// 	setDependencies(newDependencies);
	//   };

	return (
		<div>
			<Row align='middle' justify='space-between'>
				<Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
					<h1 className='allPageHeader'>Milestone</h1>
				</Col>
				<Col>
					<AppButton
						label='+ Add Milestone'
						onClick={() => {
							setIsEditMilestone(false);
							setMilestoneModalOpen(true);
							setDefaultMilestone(null);
						}}
					/>
				</Col>
			</Row>
			{formatedTasks?.length > 0 &&
				<>
					{isDataUpdate &&
						<>
							<br />
							<Row style={{ width: '100%' }}>
								<Alert
									message="Want to update milestone's changes?"
									showIcon
									className='taskUpdateAlert'
									// description="Want to update changes in milestones?"
									type="warning"
									action={
										<Button className='taskUpdateBtn' size="middle" onClick={updateMilestoneChanges}>
										Update
										</Button>
									}
								/>
							</Row>
						</>
					}
					{/* <DataView id="grid" className="grid" data={testData} cols={cols} layout={layout} autoFocus /> */}
					{/* <ReactGantt data={testData} /> */}
					{/* <ReactGantt
						templates={{
							myTasks: {
								title: 'My Tasks',
								steps: [
								{
									name: 'Task Phase One',
									color: '#0099FF'
								},
								{
									name: 'Task Phase Two',
									color: '#FF9900'
								}
								]
							}
						}}
						ref={ganttRef}
						leftBound={dayjs().set({hour: 0, date: 30, month: 5, year: 2016}).toDate()}
						rightBound={dayjs().set({hour: 0, date: 29, month: 8, year: 2016}).toDate()}
					>
						<GanttRow
						title="Task 1"
						templateName="myTasks"
						steps={[
							dayjs().set({hour: 0, date: 1, month: 6, year: 2016}).toDate(),
							dayjs().set({hour: 0, date: 4, month: 8, year: 2016}).toDate(),
							dayjs().set({hour: 0, date: 17, month: 8, year: 2016}).toDate()
						]}
						/>
						<GanttRow
						title="Task 1"
						templateName="myTasks"
						steps={[
							dayjs().set({hour: 0, date: 27, month: 2, year: 2016}).toDate(),
							dayjs().set({hour: 0, date: 9, month: 7, year: 2016}).toDate(),
							dayjs().set({hour: 0, date: 22, month: 7, year: 2016}).toDate()
						]}
						/>
					</ReactGantt> */}
					{/* <Gantt
						tasks={formatedTasks}
						viewMode={vm.Month}
						style={{ backgroundColor: 'white' }}
						// dependencies={dependencies}
						// items={formatedTasks}
						// onItemMove={handleItemMove}
						// onItemResize={handleItemResize}
						// onDependencyUpdate={handleDependencyUpdate}
					/> */}
					{/* <CustomGanttChart tasks={formatedTasks} onTaskClick={handleTaskClick} /> */}
					<GanttOriginal
						// tasks={tasks}
						tasks={formatedTasks}
						// taskRenderer={(task, index, tasks, width, getLeft, getLabelWidth) => (
						// 	<CustomGanttTask key={index} task={task} onTaskClick={handleTaskClick} />
						// )}
						listCellWidth="500px"
						viewMode={ViewMode.Month}
						columnWidth={200}
						// ganttHeight={250}
						onDateChange={handleTaskDataChange}
						onProgressChange={handleTaskDataChange}
						onExpanderClick={handleExpanderClick}
						onDoubleClick={handleDoubleClick}
					/>
				</>
			}
			{formatedTasks?.length === 0 &&
				<p>No milestone available</p>
			}
			<AppModal
				open={milestoneModalOpen}
				children={
					<AddEditMilestone
						defaultMilestone={defaultMilestone}
						isEditMilestone={isEditMilestone}
						tasks={tasks}
						setMilestoneModalOpen={setMilestoneModalOpen}
						handleMilestoneFormValues={handleMilestoneFormValues}
					/>}
				width='65%'
				onOk={handleMilestoneModal}
				onCancel={handleMilestoneModal}
			/>
		</div>
	)
}

export default Milestone;
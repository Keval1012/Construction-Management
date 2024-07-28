import { Col, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import { Pie } from 'react-chartjs-2';
import { getAllBudget, getAllBudgetCategory, getAllPurchaseOrder, getAllSaleInvoice } from '../../API/Api';
import { getIndianMoneyFormat } from '../../helper';

const Dashboard = ({ defaultProject }) => {

    const [categoryList, setCategoryList] = useState([]);
    const [projectCost, setProjectCost] = useState(0);
    const [totalPurchaseOrder, setTotalPurchaseOrder] = useState(0);
    const [totalSaleInvoice, setTotalSaleInvoice] = useState(0);

    const [totalBudgetList, setTotalBudgetList] = useState([]);
    const [formatedBudgetList, setFormatedBudgetList] = useState([]);
    const [pieLabel, setPieLabel] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [allPOList, setAllPOList] = useState([]);
    const [allSIList, setAllSIList] = useState([]);

    useEffect(() => {
        fetchBudgetCategories();
    }, []);

    useEffect(() => {
        if (defaultProject) {
            fetchAllBudgets();
            fetchAllPurchaseOrders();
            fetchAllSaleInvoices();
        }
    }, [JSON.stringify(defaultProject)]);

    useEffect(() => {
        extractCategoryArray();
    }, [JSON.stringify(totalBudgetList)]);

    useEffect(() => {
        percentageOfBudgetCategory();
    }, [JSON.stringify(formatedBudgetList)]);

    const extractCategoryArray = () => {
        const totalBudgetSum = totalBudgetList.reduce((sum, item) => sum + item.totalBudget, 0);
        const newArray = totalBudgetList.map((o) => {
            return { ...o, ...o?.categoryDetails, percentage: o?.totalBudget / totalBudgetSum * 100, key: o._id };
        });
        setFormatedBudgetList(newArray);
    };
    
    const percentageOfBudgetCategory = () => {
        let thresholdValue = 5.00;
        let under5PercentCategory = formatedBudgetList.filter(value => value.percentage < thresholdValue);
        let aboveOrEqual5PercentCategory = formatedBudgetList.filter(value => value.percentage >= thresholdValue);

        let aboveOrEqual5Label = aboveOrEqual5PercentCategory.map(o => o?.name); 
        let pieChartLabel = [...aboveOrEqual5Label, 'Others'];
        setPieLabel(pieChartLabel);
        
        let under5Data = under5PercentCategory.map(o => o?.percentage); 
        let aboveOrEqual5Data = aboveOrEqual5PercentCategory.map(o => o?.percentage); 
        let totalSumOfUnder5Data = under5Data.reduce((sum, item) => sum + item, 0);
        let allData = [...aboveOrEqual5Data, totalSumOfUnder5Data];
        let pieChartData = allData.map(value => parseFloat(value).toFixed(2));
        setPieData(pieChartData);
    };

    const fetchAllPurchaseOrders = async () => {
        const res = await getAllPurchaseOrder(defaultProject?._id);
        if (res?.data?.success) {
            setAllPOList(res?.data?.data);
            let temp = 0;
            res?.data?.data?.forEach(o => {
                // if (o?.status === 'completed') temp = Number(temp) + Number(o.totalAmount);
                temp = Number(temp) + Number(o.totalAmount);
            });
            setTotalPurchaseOrder(temp);
        }
    };

    const fetchAllSaleInvoices = async () => {
        const res = await getAllSaleInvoice(defaultProject?._id);
        if (res?.data?.success) {
            setAllSIList(res?.data?.data);
            let temp = 0;
            res?.data?.data?.forEach(o => {
                temp = Number(temp) + Number(o.totalAmount);
            });
            setTotalSaleInvoice(temp);
        }
    };

    const fetchBudgetCategories = async () => {
        const res = await getAllBudgetCategory();
        if (res?.data?.success) {
            setCategoryList(res?.data?.data);
        }
    };

    const fetchAllBudgets = async () => {
        const res = await getAllBudget(defaultProject?._id);
        if (res?.data?.success && res?.data?.data?.length > 0) {
            setTotalBudgetList(res.data?.data);
            let temp = 0;
            res?.data?.data?.forEach(o => {
                temp += parseFloat(o.totalBudget);
            });
            setProjectCost(temp);
        }
    };

    const getSuitableY = (y, yArray = [], direction) => {
        let result = y;
        yArray.forEach((existedY) => {
            if (existedY - 14 < result && existedY + 14 > result) {
                if (direction === "right") {
                    result = existedY + 14;
                } else {
                    result = existedY - 14;
                }
            }
        });

        return result;
    };

    const pieChartData = {
        type: 'outlabeledPie',
        // labels: ['Materials', 'Build', 'Labour', 'Glass', 'Furniture', 'Transportation'],
        labels: pieLabel,
        // pieceLabel: {
        //     render: 'label',
        //     fontColor: '#000',
        //     position: 'outside',
        //     segment: true
        // },
        datasets: [
            {
                label: 'By Category',
                // data: [12, 19, 3, 5, 2, 3],
                data: pieData,
                backgroundColor: [
                    // 'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)',
                // ],
                borderWidth: 0,
            },
        ],
        polyline: {
            color: "#000",
            labelColor: "#000",
            formatter: (value) => `${value}`
        },
        // options: {
        //     plugins: {
        //         legend: false,
        //         outlabels: {
        //             text: '%l %p',
        //             color: 'black',
        //             stretch: 35,
        //             font: {
        //                 resizable: true,
        //                 // minSize: 12,
        //                 // maxSize: 18,
        //             },
        //         },
        //     },
        // },
    };

    const plugins = [
        {
            afterDraw: (chart) => {
                const ctx = chart?.chart?.ctx || chart?.ctx;
                ctx.save();
                ctx.font = "10px 'Averta Std CY'";
                const leftLabelCoordinates = [];
                const rightLabelCoordinates = [];
                const chartCenterPoint = {
                    x: (chart.chartArea.right - chart.chartArea.left) / 2 + chart.chartArea.left,
                    y: (chart.chartArea.bottom - chart.chartArea.top) / 2 + chart.chartArea.top
                };
                chart.config.data.labels.forEach((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const arc = meta.data[i];
                    const dataset = chart.config.data.datasets[0];

                    // Prepare data to draw
                    // important point 1
                    const centerPoint = arc.getCenterPoint();
                    // const model = arc?._model;
                    let color = arc?.options?.borderColor;
                    let labelColor = arc?.options?.borderColor;
                    if (dataset.polyline && dataset.polyline.color) {
                        color = dataset.polyline.color;
                    }

                    if (dataset.polyline && dataset.polyline.labelColor) {
                        labelColor = dataset.polyline.labelColor;
                    }

                    const angle = Math.atan2(
                        centerPoint.y - chartCenterPoint.y,
                        centerPoint.x - chartCenterPoint.x
                    );
                    // important point 2, this point overlapsed with existed points
                    // so we will reduce y by 14 if it's on the right
                    // or add by 14 if it's on the left
                    const point2X = chartCenterPoint.x + Math.cos(angle) * (arc.outerRadius + 15);
                    let point2Y = chartCenterPoint.y + Math.sin(angle) * (arc.outerRadius + 15);

                    let suitableY;
                    if (point2X < chartCenterPoint.x) {
                        // on the left
                        suitableY = getSuitableY(point2Y, leftLabelCoordinates, "left");
                    } else {
                        // on the right
                        suitableY = getSuitableY(point2Y, rightLabelCoordinates, "right");
                    }

                    point2Y = suitableY;
                    let value = dataset.data[i] + '%';
                    if (dataset.polyline && dataset.polyline.formatter) {
                        value = dataset.polyline.formatter(value);
                    }
                    let edgePointX = point2X < chartCenterPoint.x ? 10 : chart.width - 10;

                    if (point2X < chartCenterPoint.x) {
                        leftLabelCoordinates.push(point2Y);
                    } else {
                        rightLabelCoordinates.push(point2Y);
                    }
                    //DRAW CODE
                    // first line: connect between arc's center point and outside point
                    // ctx.strokeStyle = color;
                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.moveTo(centerPoint.x, centerPoint.y);
                    ctx.lineTo(point2X, point2Y);
                    ctx.stroke();
                    // second line: connect between outside point and chart's edge
                    ctx.beginPath();
                    ctx.moveTo(point2X, point2Y);
                    ctx.lineTo(edgePointX, point2Y);
                    ctx.stroke();
                    //fill custom label
                    const labelAlignStyle =
                        edgePointX < chartCenterPoint.x ? "left" : "right";
                    const labelX = edgePointX;
                    const labelY = point2Y;
                    ctx.textAlign = labelAlignStyle;
                    ctx.textBaseline = "bottom";
                    ctx.font = "bold 12px black";
                    // ctx.fillStyle = labelColor;
                    ctx.fillStyle = 'black';
                    ctx.fillText(value, labelX, labelY);
                });
                ctx.restore();
            }
        }
    ];

    const options = {
        legend: {
            display: false,
        },
        layout: {
            padding: {
                top: 30,
                left: 0,
                right: 0,
                bottom: 20
            },
        }
    };

    const HeaderCard = ({ label = '', value = 0 }) => {
        return (
            <div className='headerCardDiv'>
                <h2>{label}</h2>
                <Divider className='divider' />
                <h3>₹ {value}</h3>
            </div>
        )
    };

    return (
        <div>
            <Row>
                <Col className='headerCardCol'><HeaderCard label='Budget' value={getIndianMoneyFormat(defaultProject?.estimatedBudget)} /></Col>
                <Col className='headerCardCol'><HeaderCard label='Project Value' value={getIndianMoneyFormat(defaultProject?.projectValue)} /></Col>
                <Col className='headerCardCol'><HeaderCard label='Project Cost' value={getIndianMoneyFormat(projectCost)} /></Col>
            </Row>
            <Row justify='space-between'>
                <Col className='listCol'>
                    <CategoryList
                        // list={categoryList}
                        list={formatedBudgetList}
                    />
                </Col>
                <Col className='listCol'>
                    <Pie
                        // options={{
                        //     // pieceLabel: {
                        //     //     render: 'label',
                        //     //     fontColor: '#000',
                        //     //     position: 'outside',
                        //     //     segment: true
                        //     // }
                        //     legend: {
                        //         position: 'outside',
                        //         render: 'label',
                        //         fontColor: '#000',
                        //         segment: true
                        //     }

                        // }}
                        // plugins={{
                        //     labels: {
                        //         render: 'percentage',
                        //         fontColor: 'black',
                        //         fontSize: '18',
                        //         precision: 1,
                        //     }
                        // }}
                        data={pieChartData}
                        options={options}
                        plugins={plugins}
                    />
                </Col>
            </Row>
            <Row>
                <Col className='headerCardCol'><HeaderCard label='Purchase Orders' value={getIndianMoneyFormat(totalPurchaseOrder)} /></Col>
                {/* <Col className='headerCardCol'><HeaderCard label='Purchase Invoices' value={0} /></Col> */}
                <Col className='headerCardCol'><HeaderCard label='Sale Invoices' value={getIndianMoneyFormat(totalSaleInvoice)} /></Col>
            </Row>
        </div>
    )
}

export default Dashboard;
"use client";
import Topheader from "../headbar/headmain/page";
import Sidebar from "../headbar/headside/page";
import { useState, useEffect, useMemo, useRef } from "react";
import Chart from 'chart.js/auto';
import React from 'react';
import { Spin } from "antd";
export default function Mboard() {
    const [sidebarToggled, setSidebarToggled] = useState(false);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    // const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(false);
    const areaChartRef = useRef(null);
    const pieChartRef = useRef(null);

    let userName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";
    // useEffect(() => {
    //     // This code will only run on the client side (after the component mounts)
    //     const storedUserName = localStorage.getItem("userName");
    //     if (storedUserName) {
    //       setUserName(storedUserName);
    //     }
    //   }, [userName]);

    const toggleSidebar = () => setSidebarToggled(!sidebarToggled);
    useEffect(() => {
        async function fetchMainData() {
            try {
                setLoading(true);
                // console.log(userName,"inside use effect")
                const [budgetRes, employeeRes] = await Promise.all([
                    fetch(`/api/allbudgetget?userName=${userName}`),
                    fetch(`/api/allemployeeget?userName=${userName}`)
                ]);

                const budgetData = await budgetRes.json();
                const employeeData = await employeeRes.json();
                const bud = budgetData.users;
                const employee = employeeData.users;

                if (bud && Array.isArray(bud)) {
                    const totalBudgetCalc = bud.reduce((sum, item) => {
                        const income = parseFloat((item.income || '0').toString().replace(/,/g, ''));
                        return sum + (isNaN(income) ? 0 : income);
                    }, 0);
                    setTotalBudget(totalBudgetCalc);
                }
                if (employee && Array.isArray(employee)) {
                    const totalIncomeCalc = employee.reduce((sum, item) => {
                        const income = parseFloat((item.income || '0').toString().replace(/,/g, ''));
                        return sum + (isNaN(income) ? 0 : income);
                    }, 0);

                    const totalExpenseCalc = employee.reduce((sum, item) => {
                        const income = parseFloat((item.expense || '0').toString().replace(/,/g, ''));
                        return sum + (isNaN(income) ? 0 : income);
                    }, 0);
                    setTotalIncome(totalIncomeCalc);
                    setTotalExpense(totalExpenseCalc);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching main data:", error);
                setLoading(false);
            }
        }

        fetchMainData();
    }, [userName]);
    console.log(totalBudget, "totalBudget")
    // console.log(totalExpense, "totalExpense")
    // console.log(totalIncome, "totalIncome")

    useEffect(() => {
        if (!loading && (totalBudget || totalIncome || totalExpense)) {
            if (areaChartRef.current) {
                areaChartRef.current.destroy();
            }
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
            const ctx1 = document.getElementById("myAreaChart");
            areaChartRef.current = new Chart(ctx1, {
                type: "line",
                data: {
                    labels: ["Budget", "Income", "Expense"],
                    datasets: [{
                        label: "Amount",
                        data: [totalBudget, totalIncome, totalExpense],
                        backgroundColor: "rgba(78, 115, 223, 0.05)",
                        borderColor: "rgba(78, 115, 223, 1)",
                        pointRadius: 3,
                        pointBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointBorderColor: "rgba(78, 115, 223, 1)",
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false }, },
                        y: { grid: { color: "rgba(234, 236, 244, 1)" }, },
                    },
                },
            });
            const ctx2 = document.getElementById("myPieChart");
            pieChartRef.current = new Chart(ctx2, {
                type: "doughnut",
                data: {
                    labels: ["Budget", "Income", "Expense"],
                    datasets: [{
                        data: [totalBudget, totalIncome, totalExpense],
                        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
                        hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '80%',
                },
            });
        }
    }, [loading, totalBudget, totalIncome, totalExpense]);

    return (
        <>
            <Sidebar toggleSidebar={toggleSidebar} sidebarToggled={sidebarToggled} />

            <div className={`test ${sidebarToggled ? 'sidebar-toggled' : ''}`}>
                <div className="topbar">
                    <Topheader toggleSidebar={toggleSidebar} />
                </div>
                <div className="container-fluid">
                    <div className="d-md-flex d-sm-grid justify-content-between align-items-center mb-4">
                        <h1 style={{ color: "mediumseagreen" }}>Hi, This is your financial summary</h1>
                        <h1 style={{ color: "blue" }}>{userName} Check your Budgets</h1>
                    </div>
                    {loading ? (
                        <div className="text-center mt-4 spinner">
                            <Spin size="large" tip="Loading Dashboard..." />
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-xl-4 col-md-6 mb-4">
                                    <div className="card border-left-primary shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2 text-center">
                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                        Total-BUDGET (Yearly)
                                                    </div>
                                                    ₹{totalBudget.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2 text-center">
                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                        Income (Yearly)
                                                    </div>
                                                    ₹{totalIncome.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4 col-md-6 mb-4">
                                    <div className="card border-left-danger shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2 text-center">
                                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                        Expense (Yearly)
                                                    </div>
                                                    ₹{totalExpense.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphs Section */}
                            <div className="row d-flex">
                                <div className="col-xl-8 col-lg-7 d-flex align-items-stretch">
                                    <div className="card shadow mb-4 w-100">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">Overview Graphs</h6>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ height: '300px' }}>
                                                <canvas id="myAreaChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4 col-lg-5 d-flex align-items-stretch">
                                    <div className="card shadow mb-4 w-100">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">Circle-Graphs</h6>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ height: '300px' }}>
                                                <canvas id="myPieChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


                </div>
            </div>
        </>
    );
}

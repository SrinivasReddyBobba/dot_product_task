'use client';
import { useState, useEffect, useMemo } from "react";
import Topheader from "../headbar/headmain/page";
import Sidebar from "../headbar/headside/page";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Spin } from 'antd';

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
export default function Employee() {
    const [sidebarToggled, setSidebarToggled] = useState(false);
    const [loading, setLoading] = useState(true);
    const toggleSidebar = () => setSidebarToggled(!sidebarToggled);
    const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";
    const [selectedId, setSelectedId] = useState(null);
    // console.log(selectedId, "check")
    const [formData, setFormData] = useState({
        person: '',
        income: '',
        accessdate: '',
        username: userName || '',
    });
    const [rowData, setRowData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            fetchUserData();
            setLoading(false);
        }, 1000);
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/allbudgetget?userName=${userName}`);
            // console.log(userName, "inside")
            if (!response.ok) throw new Error('Failed to fetch user data');
            const data = await response.json();
            setRowData(data.users || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            person: formData.person,
            userName: formData.username,
            categories: formData.categories,
            expense: formData.expense,
            income: formData.income,
            dashboardaccessdate: formData.accessdate,
        };
        // console.log(payload, "pay")
        try {
            const response = await fetch("/api/allbudget", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {

                const offcanvasElement = document.getElementById('offcanvasExampleuser');
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                offcanvasInstance.hide();
                fetchUserData();
                resetForm();
            } else {
                alert('Failed to submit user data.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('An error occurred.');
        }
    };



    const handleEdit = (userData) => {
        setIsEditMode(true);
        setFormData({
            person: userData.person || '',
            categories: userData.categories || '',
            income: userData.income || '',
            expense: userData.expense || '',
            accessdate: userData.dashboardaccessdate || '',
            //   userstatus: userData.userstatus || '',
            username: userData.userName || '',
        });
        setSelectedId(userData._id); // Set the selected row's _id for update
        setIsEditMode(true);
        document.getElementById('updateoffcanvasExampleuser').classList.add('show');
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            person: formData.person,
            categories: formData.categories,
            income: formData.income,
            expense: formData.expense,
            dashboardaccessdate: formData.accessdate,
            userName: formData.username,
            _id: selectedId // use the stored _id
        };

        // console.log(payload, "Submitting payload");

        try {
            const response = await fetch("/api/budgetdataupdation", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // console.log("Update successful");
                const offcanvasElement = document.getElementById('updateoffcanvasExampleuser');
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                offcanvasInstance.hide();

                fetchUserData(); // Reload data
                resetForm();     // Clear form fields
                setIsEditMode(false);
                setSelectedId(null); // Clear after updating
            } else {
                alert('Failed to update user.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            person: '',
            categories: '',
            income: '',
            expense: '',
            accessdate: '',
            username: ''
        });
        setSelectedId(null);
    };
    const handleDelete = async (id) => {
        // console.log(id, "calltotal")
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch("/api/budgetdelete", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: id }),
                });
                if (response.ok) {
                    alert('User deleted successfully!');
                    fetchUserData();
                } else {
                    alert('Failed to delete user.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred.');
            }
        }
    };
    const editButtonRenderer = (params) => {
        // console.log(params.data,"dhdnd")
        if (params.node.rowPinned) {
            return null; // hide button if it's pinned row
        }
        return (
            <button
                className="btn btn-primary btn-sm"
                data-bs-toggle="offcanvas"
                data-bs-target="#updateoffcanvasExampleuser"
                aria-controls="updateoffcanvasExampleuser"
                onClick={() => handleEdit(params.data)}
            >
                Edit
            </button>
        );
    };

    const Deleted = (params) => {
        if (params.node.rowPinned) {
            return null; // hide button if it's pinned row
        }
        return (
            <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(params.data._id)}
            >
                Delete
            </button>
        );
    };
    const [columnDefs] = useState([
        { headerName: "BG_RELEASE_NAME", field: "person", sortable: true, filter: true },
        { headerName: "Access Date", field: "dashboardaccessdate", sortable: true, filter: true },
        { headerName: "Income", field: "income", sortable: true, filter: true },
        { headerName: "Update", cellRenderer: editButtonRenderer, },
        { headerName: "Delete", cellRenderer: Deleted, },
    ]);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
            floatingFilter: true,
        };
    }, []);

    return (
        <>
            <Sidebar toggleSidebar={toggleSidebar} sidebarToggled={sidebarToggled} />
            <div className={`test ${sidebarToggled ? 'sidebar-toggled' : ''}`}>
                <div className="topbar">
                    <Topheader toggleSidebar={toggleSidebar} />
                </div>
                <div className="container-fluid">
                    <div className="page-head-handler float-end mb-3">
                        <h2>Monthly Budget</h2>
                        <button
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleuser"
                            aria-controls="offcanvasExampleuser"
                        >
                            Add Budget
                        </button>
                    </div>
                    <div className="offcanvas offcanvas-end" id="offcanvasExampleuser" aria-labelledby="offcanvasExampleLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title">Edit Budget</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <form onSubmit={handleSubmit}>
                                {renderForm()}
                            </form>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-start" id="updateoffcanvasExampleuser" aria-labelledby="updateoffcanvasExampleLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title">Update Budget</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <form onSubmit={handleUpdateSubmit}>
                                {renderForm()}
                            </form>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-body" id="dataholdlist">
                            {renderContent()}
                            <footer className="text-center mt-4">
                                <p>© 2025 Budget Tracker. All rights reserved.</p>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    function renderContent() {
        if (loading) {
            return (
                <div className="text-center mt-4">
                    <Spin size="large" tip="Loading Monthly Budget..." />
                </div>
            );
        }

        if (rowData.length === 0) {
            return (
                <p className="text-center mt-4 zero">No Monthly Budget available for Signed-in User Name</p>
            );
        }

        return (
            <div className="ag-theme-alpine" style={{ height: "80vh", width: "100%" }}>
                <div style={containerStyle}>
                    <div style={gridStyle}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            pagination={true}
                            paginationPageSize={2}
                            getRowHeight={(params) => {
                                if (params.node.rowPinned) {
                                    return 50;
                                }
                                return 65;
                            }}
                            pinnedBottomRowData={[
                                {
                                    dashboardaccessdate: 'Total',
                                    categories: '',
                                    expense: rowData.reduce((sum, row) => sum + (parseFloat(row.expense) || 0), 0),
                                    income: rowData.reduce((sum, row) => {
                                        const cleanIncome = Number((row.income || '0').toString().replace(/[^0-9.-]+/g, ''));
                                        return sum + (isNaN(cleanIncome) ? 0 : cleanIncome);
                                    }, 0).toLocaleString('en-IN'),
                                }
                            ]}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </div>
            </div>
        );
    }


    function renderForm() {
        return (
            <div className="row gy-3">
                <div className="col-xl-6">
                    <label className="form-label">Access Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="accessdate"
                        value={formData.accessdate}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-xl-6">
                    <label className="form-label">Budget-Released-personname</label>
                    <input
                        type="text"
                        className="form-control"
                        name="person"
                        value={formData.person}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-xl-6">
                    <label className="form-label">Release-Budget</label>
                    <input
                        type="text"
                        className="form-control"
                        name="income"
                        value={formData.income}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-xl-12 text-center">
                    <button type="submit" className="btn btn-primary">{isEditMode ? 'Update' : 'Submit'}</button>
                </div>
            </div>
        );
    }
}

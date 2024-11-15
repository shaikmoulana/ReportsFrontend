import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Box, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

const GenerateReports = () => {
    const [period, setPeriod] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedQuarter, setSelectedQuarter] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectionType, setSelectionType] = useState('all'); // State for Employee Selection Type
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [team, setTeam] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [employee, setEmployee] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [category, setCategory] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('https://localhost:7169/api/Employee')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleGenerateReport = () => {
        setLoading(true);
        const params = {
            // category: category.join(','),
            categories: category.length > 0 ? category : [],
            // employeeIds: employee.length > 0 ? employee : [],
            period: period,
            month: selectedMonth,
            quarter: selectedQuarter,
            year: selectedYear,
            fromDate: fromDate ? fromDate.toISOString() : null,
            toDate: toDate ? toDate.toISOString() : null,
            employeeSelection: selectionType,
            employeeIds: selectionType === 'all'
                ? employees.map(emp => emp.id)
                : selectionType === 'individual'
                    ? [selectedEmployee]
                    : team,
        };

        axios.post('https://localhost:7138/api/Reports/generateReport', params)
            .then(response => {
                setReports(response.data);
            })
            .catch(error => {
                console.error('Error generating report:', error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 4 }}>
            <Typography variant="h5" gutterBottom align="center">
                Generate Reports
            </Typography>

            {/* Category Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Category</InputLabel>
                <Select
                    multiple
                    label="Select Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                >
                    <MenuItem value="webinars">Webinars</MenuItem>
                    <MenuItem value="blogs">Blogs</MenuItem>
                    <MenuItem value="certifications">Certifications</MenuItem>
                    <MenuItem value="pocs">POCs</MenuItem>
                </Select>
            </FormControl>

            {/* Period Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Period</InputLabel>
                <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                    <MenuItem value="specificDates">Specific Dates</MenuItem>
                </Select>
            </FormControl>

            {/* Display fields based on selected period */}
            {period === "monthly" && (
                <Box>
                    <TextField
                        label="Select Month"
                        select
                        fullWidth
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        margin="normal"
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                            <MenuItem key={index} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            {/* Display Quarter for Quarterly Period */}
            {period === "quarterly" && (
                <Box>
                    <TextField
                        label="Select Quarter"
                        select
                        fullWidth
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                        margin="normal"
                    >
                        {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
                            <MenuItem key={index} value={quarter}>
                                {quarter}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            {/* Display Year for all periods */}
            {(period === "monthly" || period === "quarterly" || period === "yearly") && (
                <Box>
                    <TextField
                        label="Select Year"
                        select
                        fullWidth
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        margin="normal"
                    >
                        {[2023, 2024, 2025].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            {/* Display Date Pickers for Specific Dates */}
            {period === "specificDates" && (
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="From Date"
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                        <DatePicker
                            label="To Date"
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
                </Box>
            )}
            {/* Employee Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Employee Selection</InputLabel>
                <Select
                    value={selectionType}
                    onChange={(e) => setSelectionType(e.target.value)}
                >
                    <MenuItem value="all">All Employees</MenuItem>
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                </Select>
            </FormControl>

            {/* Individual Employee Selection */}
            {selectionType === 'individual' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Employee</InputLabel>
                    <Select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        {employees.map(emp => (
                            <MenuItem key={emp.id} value={emp.id}>
                                {emp.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* Team Selection */}
            {selectionType === 'team' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Team Members</InputLabel>
                    <Select
                        multiple
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        renderValue={(selected) =>
                            selected.map(id => employees.find(emp => emp.id === id)?.name).join(', ')
                        }
                    >
                        {employees.map(emp => (
                            <MenuItem key={emp.id} value={emp.id}>
                                {emp.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}


            {/* Generate Report Button */}
            <Button variant="contained" color="primary" onClick={handleGenerateReport} fullWidth>
                Generate Report
            </Button>

            {/* Loading Spinner */}
            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

            {/* Display No Data Message */}
            {!loading && reports && reports.length === 0 && (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
                    No Data/Reports Available
                </Typography>
            )}

            {/* Report Table */}
            {reports && reports.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report, index) => {
                                // Find the employee with the matching ID in the employees array
                                const employee = employees.find(emp => emp.id === report.referenceName);

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{report.title}</TableCell>
                                        <TableCell>{employee.name}</TableCell> {/* Display the name or 'Unknown' if not found */}
                                        <TableCell>{new Date(report.createdDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{report.category}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default GenerateReports;

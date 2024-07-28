import React, { useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Roles from './pages/Role';
import Users from './pages/Users';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthProvider';
import Projects from './pages/Projects';
import AddEditProjectForm from './components/AddEditProjectForm';
import ProjectDetails from './components/ProjectDetailsPage';
import AddEditTaskForm from './components/AddEditTaskForm';
import ProjectDashboard from './components/ProjectDashboard/ProjectDashboard';
import SiteInspection from './components/siteInspection/SiteInspection';
import AddEditForm from './components/siteInspection/AddEditForm';
import DailyStatus from './pages/DailyStatus';
import Equipments from './pages/Equipments';
import AddEditEquipmentForm from './components/AddEditEquipmentForm';
import AddEditEquipmentRequest from './components/AddEditEquipmentRequest';
import EmployeeProjects from './pages/EmployeeProjects';
import EquipmentName from './pages/EquipmentName';
import { Result } from 'antd';
import AppButton from './components/AppButton';
import Documents from './pages/Documents';
import BudgetCategory from './components/budget/BudgetCategory';
import Tax from './pages/Tax';
import AddEditSaleInvoice from './components/AddEditSaleInvoice';
import AddEditPurchaseOrder from './components/AddEditPurchaseOrder';

const MainRoutes = () => {
  const { user, currentRole } = useContext(AuthContext)??{};
  const navigate = useNavigate();

  return (
    <>
        <Routes>
            <Route path='/' element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            {/* <Route path='/users' element={<ProtectedRoute user={user} module='User' currentCompany={currentCompany}><Users /></ProtectedRoute>} />
            <Route path='/roles' element={<ProtectedRoute user={user} module='Role' currentCompany={currentCompany}><Roles /></ProtectedRoute>} /> */}
            <Route path='/login' element={user ? <Dashboard /> : <Login />} />

            <Route path='/users' element={<ProtectedRoute user={user} module='User'><Users screenType='User' /></ProtectedRoute>} />
            <Route path='/employees' element={<ProtectedRoute user={user} module='Employee'><Users screenType='Employee' /></ProtectedRoute>} />
            <Route path='/builders' element={<ProtectedRoute user={user} module='Builder'><Users screenType='Builder' /></ProtectedRoute>} />

            <Route path='/roles' element={<ProtectedRoute user={user} module='Role'><Roles /></ProtectedRoute>} />

            {(currentRole === 'builder') && <Route path='/budgetCategory' element={<ProtectedRoute user={user}><BudgetCategory /></ProtectedRoute>} />}
            <Route path='/equipmentNames' element={<ProtectedRoute user={user} module='EquipmentName'><EquipmentName /></ProtectedRoute>} />

            <Route path='/dailyStatus' element={<ProtectedRoute user={user} module='DailyStatus'><DailyStatus /></ProtectedRoute>} />

            <Route path='/documents' element={<ProtectedRoute user={user} module='Document'><Documents /></ProtectedRoute>} />

            <Route path='/taxes' element={<ProtectedRoute user={user} module='Tax'><Tax /></ProtectedRoute>} />

            <Route path='/siteInspection' element={<ProtectedRoute user={user} module='SiteInspection'><SiteInspection /></ProtectedRoute>} />
            <Route path='/siteInspection/form' element={<ProtectedRoute user={user} module='SiteInspection'><AddEditForm /></ProtectedRoute>} />

            <Route path='/equipments' element={<ProtectedRoute user={user} module='Equipment'><Equipments /></ProtectedRoute>} />
            <Route path='/equipments/form' element={<ProtectedRoute user={user} module='Equipment'><AddEditEquipmentForm /></ProtectedRoute>} />

            <Route path='/equipmentRequest/form' element={<ProtectedRoute user={user} module='EquipmentRequest'><AddEditEquipmentRequest /></ProtectedRoute>} />

            <Route path='/saleInvoice/form' element={<ProtectedRoute user={user} module='SaleInvoice'><AddEditSaleInvoice /></ProtectedRoute>} />
            <Route path='/purchaseOrder/form' element={<ProtectedRoute user={user} module='PurchaseOrder'><AddEditPurchaseOrder /></ProtectedRoute>} />

            <Route path='/projects' element={<ProtectedRoute user={user} module='Project'><Projects /></ProtectedRoute>} />
            <Route path='/projects/form' element={<ProtectedRoute user={user} module='Project'><AddEditProjectForm /></ProtectedRoute>} />
            <Route path='/projectDetails/:id' element={<ProtectedRoute user={user} module='Project'><ProjectDetails /></ProtectedRoute>} />
            <Route path='/project/dashboard/:id' element={<ProtectedRoute user={user} module='Project'><ProjectDashboard /></ProtectedRoute>} />

            <Route path='/task/form' element={<ProtectedRoute user={user} module='Task'><AddEditTaskForm /></ProtectedRoute>} />
            <Route path='/task/form/:id' element={<ProtectedRoute user={user} module='Task'><AddEditTaskForm /></ProtectedRoute>} />

            <Route path='/projects-list' element={<ProtectedRoute user={user} module='EmployeeProject'><EmployeeProjects /></ProtectedRoute>} />

            <Route path='/unauthorized' element={
              <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<AppButton type="dashed" onClick={() => navigate('/')} label='Back Home' />}
              />
            } />

        </Routes>
    </>
  )
}

export default MainRoutes;
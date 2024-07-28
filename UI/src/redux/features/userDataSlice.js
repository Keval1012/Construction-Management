import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: '',
    permissions: [],
    currentCompany: null,
    currentUserData: null,
    currentUserRole: null,
    allAssignCurrentEmployee: [],
}

export const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserIdData: (state, action) => {
            state.userId = action.payload;
        },
        setCurrentUserData: (state, action) => {
            state.currentUserData = action.payload;
        },
        setCurrentUserRole: (state, action) => {
            state.currentUserRole = action.payload;
        },
        setPermissionData: (state, action) => {
            state.permissions = action.payload;
        },
        setCurrentCompanyData: (state, action) => {
            state.currentCompany = action.payload;
        },
        setAllAssignCurrentEmployee: (state, action) => {
            state.allAssignCurrentEmployee = action.payload;
        }
    },
});

export const { setUserIdData, setPermissionData, setCurrentCompanyData, setCurrentUserRole, setCurrentUserData, setAllAssignCurrentEmployee } = userDataSlice.actions;

export default userDataSlice.reducer;
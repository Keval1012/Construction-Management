import { createAdminJwtToken } from "../helper.js";


export const changePasswordService = async (req, User, bcrypt) => {
    try {
        const { currentPassword, newPassword, userId } = req.body;

        if (!currentPassword || !newPassword || !userId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING - (currentPassword, newPassword, userId)' };

        const findUser = await User.findById(userId);
        if (!findUser) return { success: false, status: 400, message: 'User Not Found.' };

        const checkCurrPass = await bcrypt.compare(currentPassword, findUser.password);

        if (checkCurrPass) {
            const passHash = await bcrypt.hash(newPassword, 9);
            const updateUser = await User.findByIdAndUpdate(userId, { password: passHash });
            return { success: true, status: 200, message: 'Password Changed Successfully.' };

        } else return { success: false, status: 400, message: 'Current Password Not Matched' };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};

export const getUserLoginService = async (req, User, Role, UserRole, bcrypt) => {
    try {
        const { username, password, company, builderId } = req.body;
        // const session = req.session;
    
        if (!username || !password) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING - (username, password)' };

        const findUser = await User.findOne({ username: username });
        const findUserRole = await UserRole.findOne({ userId: findUser?.id });
        const findRole = await Role.findById(findUserRole?.roleId);

        if (findUserRole?.roleId !== findRole?.id) return { success: false, status: 404, message: 'User Not Found with this Role' }

        if (findRole?.name === 'employee' && !company) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING - (company)' };
        const findEmployeeBuilder = await User.findOne({ username: company });
        if (findRole?.name === 'employee' && !findEmployeeBuilder) return { success: false, status: 404, message: 'Company is not Found' };

        if (findRole?.name === 'employee' && findUser?.builderId !== findEmployeeBuilder?.id) return { success: false, status: 404, message: 'Company/UserName is incorrect!' };
    
        const checkPassword = await bcrypt.compare(password, findUser.password);
        
        if (findUser && findUserRole?.roleId === findRole?.id && checkPassword) {
            // next({ status: 400, message: 'MOBILE_NOT_FOUND_ERR' });
            
            const token = createAdminJwtToken({ sub: findUser.id, role: findRole.name });
        
            // session.username = username;
            // session.currentUserId = findUser.id;
            // await req.session.save();
            
            return {
                success: true,
                status: 200,
                message: "User verified successfully",
                token: token,
                userId: findUser.id,
                role: findRole.name,
            };
    
        } else {
            return { success: false, status: 404, message: 'username/password is not valid' };
        }
    
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};
const userDriver = require("../drivers/users/user.driver");
const { message } = require("../constants");
const jwtToken = require("../helpers/jwt.token");
const {initiateLogin} = require("../helpers/passport.authenticate");
const bcrypt = require("bcrypt");
const userSchema = require("../models/users/users.model");
const leadSchema = require("../models/leads/leads.model");
const leadDriver = require("../drivers/leads/leads.driver");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const loginView = (req, res) => {
    res.render("newViews/login", {
        layout: false,
        title: "Login",
    });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const dashboardView = async (req, res) => {
    const user = req.user;
    const allUsers = await userSchema.count();
    const allLeads = await leadSchema.count();
    const activeLeads = await leadDriver.getActiveLead();
    const completedLeads = await leadDriver.getCompletedLead();
    const inProcessLeads = await leadDriver.getInProcessLead();
    const followUpLeads = await leadDriver.getFollowUpLead();
    const latestAddedLeads = await leadDriver.getLatestLeads();
    const closedLead = await leadDriver.getClosedLead();
    res.render("newViews/dashboard", {
        user,
        allUsers,
        allLeads,
        activeLeads,
        completedLeads,
        inProcessLeads,
        followUpLeads,
        latestAddedLeads,
        closedLead,
        title: "Admin Dashboard",
        layout: "layout",
    });
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
// const login = async (req, res) => {
//     var { email, password } = req.body;
//     if (!email || !password) {
//         req.flash("error", message.MESSAGE_ALL_FIELDS_REQUIRED);
//         return res.render("newViews/login", { layout: false });
//     }
//     try {
//         //Getting User By Email
//         const user = await userDriver.findUserByEmail(email);
//         if (!user) {
//             req.flash("error", message.MESSAGE_NO_USER_FOUND);
//             return res.render("newViews/login", { layout: false });
//         }

//         //Password Matching
//         const passwordMatched = await bcrypt.compare(password, user.password);
//         if (!passwordMatched) {
//             req.flash("error", message.MESSAGE_EMAIL_OR_PASSWORD_NOT_MATCHED);
//             return res.render("newViews/login", { title: "Login", layout: false });
//         }

//         //Generating Access token
//         await jwtToken
//             .generateAccessToken({ id: user._id, email: user.email, role: user.role })
//             .then((token) => {
//                 const data = { ...user._doc, token };
//                 //Hiding Password
//                 var { password, __v, ...result } = data;
//                 res.cookie('auth', result);
//                 return res.redirect(301, "/dashboard");
//             })
//             .catch((error) => {
//                 req.flash("error", error);
//                 return res.render("newViews/login", { title: "Login", layout: false });
//             });
//     } catch (error) {
//         req.flash("error", error);
//         return res.render("newViews/login", { title: "Login", layout: false });
//     }
// };

async function login(passport){
    await initiateLogin(passport)
}

module.exports = {
    loginView,
    login,
    dashboardView,
};

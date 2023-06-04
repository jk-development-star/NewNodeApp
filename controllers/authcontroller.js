const userDriver = require('../drivers/users/user.driver')
const { message } = require('../constants')
const jwtToken = require('../helpers/jwt.token')
const bcrypt = require("bcrypt")
const userSchema = require('../models/users/users.model')
const leadSchema = require('../models/leads/leads.model')

// For View 
const loginView = (req, res) => {
    res.render("newViews/login", {
        layout: false, title: 'Login'
    });
}
// Dashboard view
const dashboardView = async (req, res) => {
    const allUsers = await userSchema.count();
    const allLeads = await leadSchema.count();
    res.render("newViews/dashboard", { allUsers, allLeads, title: 'Admin Dashboard', layout: 'layout' })
}



// Login the user in App
const login = async (req, res) => {

    var { email, password } = req.body
    if (!email || !password) {
        req.flash('error', message.MESSAGE_ALL_FIELDS_REQUIRED)
        return res.render('newViews/login', { layout: false });
    }
    try {
        //Getting User By Email
        const user = await userDriver.findUserByEmail(email);
        if (!user) {
            req.flash('error', message.MESSAGE_NO_USER_FOUND)
            return res.render('newViews/login', { layout: false });
        }

        //Password Matching
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            req.flash('error', message.MESSAGE_EMAIL_OR_PASSWORD_NOT_MATCHED)
            return res.render('newViews/login', { title: 'Login', layout: false });
        }

        //Generating Access token
        await jwtToken.generateAccessToken({ id: user._id, email: user.email }).then(accessToken => {
            const data = { ...user._doc, accessToken }
            //Hiding Password
            var { password, __v, ...result } = data
            req.session.user = result
            return res.redirect(301, '/dashboard')
        }).catch(error => {
            req.flash('error', error)
            return res.render('newViews/login', { title: 'Login', layout: false });
        })

    } catch (error) {
        req.flash('error', error)
        return res.render('newViews/login', { title: 'Login', layout: false });
    }


}

module.exports = {
    loginView,
    login,
    dashboardView
};



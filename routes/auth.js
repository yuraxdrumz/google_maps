/**
 * Created by Jbt on 22-Jul-16.
 */
module.exports = function (req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/')
    }
};

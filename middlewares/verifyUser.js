const User = require('../models/User')


module.exports = async (id) => {
    const user = await User.findById(id);
    if (!user)
        return false
    return true;
}



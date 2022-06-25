const jwt = require('jsonwebtoken');
const Token = require('../models/token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await Token.findOne({
        where : {userId: userId}
    })
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({userId: userId, refresh_token: refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({
            where: {refresh_token: refreshToken}
        })
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({
            where: {refresh_token: refreshToken}
        })
        return tokenData;
    }
}

module.exports = new TokenService()
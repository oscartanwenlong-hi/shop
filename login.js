import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// ✅ Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCh7tgqEZb1zLICy6trriTCMJlXEe0x6hM",
    authDomain: "shop-87351.firebaseapp.com",
    projectId: "shop-87351",
    storageBucket: "shop-87351.appspot.com",
    messagingSenderId: "994764608061",
    appId: "1:994764608061:web:e7a5a041cd3e082daad054"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 获取验证码
async function loadCaptcha() {
    try {
        const captchaCollection = collection(db, "captcha");
        const captchaDocs = await getDocs(captchaCollection);
        const captchaList = captchaDocs.docs.map(doc => doc.data());

        if (captchaList.length > 0) {
            const randomCaptcha = captchaList[Math.floor(Math.random() * captchaList.length)];
            document.getElementById("captcha-image").src = randomCaptcha.image;
            document.getElementById("captcha-image").dataset.answer = randomCaptcha.anw;

            // ✅ 验证码加载完成，隐藏加载层
            document.getElementById("loading-overlay").style.display = "none";
        }
    } catch (error) {
        console.error("❌ 验证码加载失败", error);
    }
}

// ✅ 监听验证码提交按钮
document.getElementById("captcha-submit").addEventListener("click", () => {
    const inputAnswer = document.getElementById("captcha-input").value.trim();
    const correctAnswer = document.getElementById("captcha-image").dataset.answer;

    if (inputAnswer === correctAnswer) {
        alert("✅ 验证成功！");
        document.getElementById("google-login").style.display = "block"; // ✅ 显示 Google 登录按钮
    } else {
        alert("❌ 验证失败，请重试！");
    }
});

// ✅ 页面加载时自动获取验证码
window.onload = loadCaptcha;

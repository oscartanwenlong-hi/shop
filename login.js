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

// ✅ 确保 DOM 加载完毕后执行
document.addEventListener("DOMContentLoaded", () => {
    const captchaImg = document.getElementById("captcha-img");
    const captchaInput = document.getElementById("captcha-input");
    const captchaSubmit = document.getElementById("captcha-submit");
    const captchaError = document.getElementById("captcha-error");
    const googleLoginBtn = document.getElementById("google-login");
    const loadingOverlay = document.getElementById("loading-overlay");

    if (!captchaImg) {
        console.error("❌ 找不到 captcha-img 元素，请检查 HTML 结构！");
        return;
    }

    let correctAnswer = "";

    // ✅ 1. 加载验证码
    async function loadCaptcha() {
        try {
            const querySnapshot = await getDocs(collection(db, "captcha"));
            const captchaList = querySnapshot.docs.map(doc => doc.data());

            if (captchaList.length === 0) {
                throw new Error("没有找到验证码数据");
            }

            const randomCaptcha = captchaList[Math.floor(Math.random() * captchaList.length)];
            correctAnswer = randomCaptcha.anw;

            captchaImg.src = randomCaptcha.image;
            captchaImg.style.display = "block";
            captchaImg.style.maxWidth = "100%"; 

            loadingOverlay.style.display = "none"; // ✅ 关闭加载遮罩
        } catch (error) {
            console.error("❌ 验证码加载失败", error);
            captchaError.textContent = "验证码加载失败，请刷新页面重试";
        }
    }

    // ✅ 2. 监听验证码提交
    captchaSubmit.addEventListener("click", () => {
        if (captchaInput.value.trim() === correctAnswer) {
            captchaError.textContent = "✅ 验证成功";
            captchaError.style.color = "green";
            googleLoginBtn.style.display = "block"; // ✅ 显示 Google 按钮
        } else {
            captchaError.textContent = "❌ 验证码错误，请重试";
            captchaError.style.color = "red";
        }
    });

    // ✅ 开始加载验证码
    loadCaptcha();
});

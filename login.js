// ✅ Firebase SDK (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// ✅ Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCh7tgEZb1zLICy6trriTCMJlXEe0x6hM",
    authDomain: "shop-87351.firebaseapp.com",
    projectId: "shop-87351",
    storageBucket: "shop-87351.appspot.com",
    messagingSenderId: "994764608061",
    appId: "1:994764608061:web:e7a5a041cd3e082daad054"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ 变量
const loadingOverlay = document.getElementById("loading-overlay");
const captchaContainer = document.getElementById("captcha-container");
const captchaImage = document.getElementById("captcha-image");
const captchaInput = document.getElementById("captcha-input");
const captchaSubmit = document.getElementById("captcha-submit");
const googleLoginBtn = document.getElementById("google-login");

let correctAnswer = "";

// ✅ 加载验证码
async function loadCaptcha() {
    try {
        const querySnapshot = await getDocs(collection(db, "captcha"));
        const captchaArray = querySnapshot.docs.map(doc => doc.data());
        
        if (captchaArray.length === 0) {
            throw new Error("没有找到验证码数据！");
        }

        // 随机选择一个验证码
        const randomCaptcha = captchaArray[Math.floor(Math.random() * captchaArray.length)];
        captchaImage.src = randomCaptcha.image;
        correctAnswer = randomCaptcha.anw.trim().toLowerCase();

        // ✅ 显示验证码
        captchaImage.style.display = "block";

        // ✅ 关闭加载层
        loadingOverlay.style.display = "none";
    } catch (error) {
        console.error("❌ 加载验证码失败", error);
        alert("加载验证码失败，请刷新页面！");
    }
}

// ✅ 监听验证码提交按钮
captchaSubmit.addEventListener("click", () => {
    const userAnswer = captchaInput.value.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        alert("✅ 验证成功！请使用 Google 登录。");
        googleLoginBtn.style.display = "block"; // 显示 Google 登录按钮
        captchaContainer.style.display = "none"; // 隐藏验证码
    } else {
        alert("❌ 验证失败，请重试！");
    }
});

// ✅ 加载验证码
loadCaptcha();

// ✅ 监听 Google 登录按钮
googleLoginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("✅ 登录成功:", user);

        // ✅ 获取 Firestore 用户数据
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("🔍 新用户，跳转到注册页面...");
            window.location.replace("register.html");
        } else {
            console.log("🚀 已注册用户，跳转到首页...");
            window.location.replace("home.html");
        }
    } catch (error) {
        console.error("❌ 登录失败", error);
    }
});

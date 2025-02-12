import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const captchaImg = document.getElementById("captcha-img");
const captchaInput = document.getElementById("captcha-input");
const captchaSubmit = document.getElementById("captcha-submit");
const captchaError = document.getElementById("captcha-error");
const googleLoginBtn = document.getElementById("google-login");
const loadingOverlay = document.getElementById("loading-overlay");

let correctAnswer = "";

// ✅ 1. 加载验证码
async function loadCaptcha() {
    try {
        const querySnapshot = await getDocs(collection(db, "captcha"));
        const captchaList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (captchaList.length === 0) {
            throw new Error("没有找到验证码数据");
        }

        const randomCaptcha = captchaList[Math.floor(Math.random() * captchaList.length)];
        correctAnswer = randomCaptcha.anw; // ✅ 获取正确答案

        captchaImg.src = randomCaptcha.image;
        captchaImg.style.display = "block"; // ✅ 确保图片显示
        captchaImg.style.maxWidth = "100%"; // ✅ 确保适应框大小

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

// ✅ 3. 监听 Google 登录按钮
googleLoginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("✅ 登录成功:", user);

        // ✅ 查询用户是否存在
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.warn("⚠️ 新用户，跳转到注册页面...");
            window.location.replace("register.html");
            return;
        }

        const userData = userSnap.data();
        const role = userData.role ? String(userData.role) : "0";

        // ✅ 根据角色跳转
        if (role === "1") {
            window.location.replace("seller.html");
        } else {
            window.location.replace("home.html");
        }

    } catch (error) {
        console.error("❌ 登录失败", error);
    }
});

// ✅ 初始化
window.onload = loadCaptcha;

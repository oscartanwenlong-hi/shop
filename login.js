// ✅ Firebase SDK (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

// ✅ 监听 Google 登录按钮（不再依赖 `DOMContentLoaded`，防止浏览器拦截弹窗）
document.getElementById("google-login").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("✅ 登录成功:", user);

        // ✅ 获取 Firestore 用户数据
        const userRef = doc(db, "users", user.uid);
        console.log("📡 正在查询 Firestore 数据...");
        const userSnap = await getDoc(userRef);

        let role = "0"; // 默认普通用户

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("🔍 Firestore 数据:", userData);

            // ✅ 处理 role（确保 role 字段存在）
            role = userData.role ? String(userData.role) : "0";
            console.log(`🎭 角色: ${role}`);
        } else {
            console.warn("⚠️ Firestore 没有找到用户文档，创建默认用户...");
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                role: "0", // 默认普通用户
                address: "",
                phone: ""
            });
        }

        // ✅ 根据 role 跳转
        if (role === "1") {
            console.log("🎉 卖家身份，跳转到 seller.html");
            window.location.replace("seller.html");
        } else {
            console.log("🚀 普通用户，跳转到 home.html");
            window.location.replace("home.html");
        }

    } catch (error) {
        console.error("❌ 登录失败", error);
    }
});

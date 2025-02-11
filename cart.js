import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCh7tgqEZb1zLICy6trriTCMJlXEe0x6hM",
    authDomain: "shop-87351.firebaseapp.com",
    projectId: "shop-87351",
    storageBucket: "shop-87351.firebasestorage.app",
    messagingSenderId: "994764608061",
    appId: "1:994764608061:web:e7a5a041cd3e082daad054"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// 监听用户登录状态
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        console.log("当前用户:", user.uid);
        await loadCart();
    } else {
        window.location.href = "login.html";
    }
});

// 加载购物车数据
async function loadCart() {
    if (!currentUser) return;
    
    const cartBody = document.getElementById("cart-body");
    const cartTotalElem = document.getElementById("cart-total");
    cartBody.innerHTML = "";
    let total = 0;

    const cartRef = collection(db, "carts", currentUser.uid, "items");
    const itemsSnapshot = await getDocs(cartRef);

    itemsSnapshot.forEach((docSnap) => {
        const item = { id: docSnap.id, ...docSnap.data() };
        const price = parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        total += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>¥${price.toFixed(2)}</td>
            <td>${quantity}</td>
            <td>¥${itemTotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">删除</button></td>
        `;
        cartBody.appendChild(row);
    });

    cartTotalElem.textContent = total.toFixed(2);

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async () => {
            await removeFromCart(button.dataset.id);
        });
    });
}

// 删除购物车商品
async function removeFromCart(itemId) {
    if (!currentUser) return;

    const itemRef = doc(db, "carts", currentUser.uid, "items", itemId);
    await deleteDoc(itemRef);
    await loadCart();
}

// 退出登录
document.getElementById("logout-btn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});

// 结算功能
document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("结算功能暂未实现！");
});

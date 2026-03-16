const API_URL = "http://localhost:3000";

let userToken = "";
let testUserEmail = `hacker_${Date.now()}@test.com`;

const logInfo = (msg: string) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`);
const logSuccess = (msg: string) => console.log(`\x1b[32m[SUCCESS] ✔\x1b[0m ${msg}`);
const logError = (msg: string, err?: any) => {
    console.error(`\x1b[31m[ERROR] ✖\x1b[0m ${msg}`);
    if (err) console.error(err);
};

async function runRbacFlow() {
    console.log("\n🛡️ BẮT ĐẦU CHẠY AUTOMATION TEST - RBAC & SECURITY FLOW 🛡️\n");

    try {
        // ==========================================
        // 1. TẠO TÀI KHOẢN USER THƯỜNG
        // ==========================================
        logInfo("1. Testing [POST /auth/register] - Tạo User thường...");
        let res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: testUserEmail, 
                displayName: "Normal User",
                password: "password123" 
            }),
        });
        let json = await res.json();
        if (!json.success) throw new Error(json.message);
        
        userToken = json.data.accessToken;
        logSuccess(`Tạo User thành công! Role hiện tại: ${json.data.user.role}`);

        // ==========================================
        // 2. HACKER CỐ GẮNG XEM DANH SÁCH USER (ADMIN ONLY)
        // ==========================================
        logInfo("\n2. Testing [GET /user] - User thường gọi API Admin...");
        res = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${userToken}` },
        });
        json = await res.json();

        if (res.status === 403) {
            logSuccess("Pass! Hệ thống đã chặn thành công: " + json.message);
        } else {
            throw new Error("Lỗ hổng bảo mật: User thường có thể xem danh sách Admin!");
        }

        // ==========================================
        // 3. HACKER CỐ GẮNG ĐỔI QUYỀN CỦA MÌNH LÊN ADMIN
        // ==========================================
        logInfo("\n3. Testing[PATCH /user/:id/role] - Tự phong quyền Admin...");
        res = await fetch(`${API_URL}/user/${json.data?.user?.id}/role`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}` 
            },
            body: JSON.stringify({ role: "admin" })
        });
        
        if (res.status === 403) {
            logSuccess("Pass! Hệ thống đã chặn thành công hành vi tự phong quyền.");
        } else {
            throw new Error("Lỗ hổng bảo mật: Có thể tự đổi quyền!");
        }

        // ==========================================
        // 4. TEST PARSE ID PIPE (Chống ID rác / Mongo Injection)
        // ==========================================
        logInfo("\n4. Testing [GET /user/wrong-id-format] - Gửi ID sai định dạng...");
        let adminRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@system.com", password: "Admin@123" }),
        });
        let adminJson = await adminRes.json();
        
        res = await fetch(`${API_URL}/user/this-is-not-a-valid-mongo-id`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${adminJson.data.accessToken}` },
        });
        json = await res.json();

        if (res.status === 400 && json.message.includes("Invalid ID format")) {
            logSuccess("Pass! ParseIdPipe đã chặn ID rác thành công.");
        } else {
            throw new Error("ParseIdPipe hoạt động không đúng!");
        }

        console.log("\n🎉 TOÀN BỘ RBAC & SECURITY FLOW ĐÃ CHẠY THÀNH CÔNG! HỆ THỐNG AN TOÀN! 🎉\n");
    } catch (error: any) {
        console.log("\n");
        logError("Test Flow bị gián đoạn do lỗi!", error.message);
        console.log("\n");
    }
}

runRbacFlow();
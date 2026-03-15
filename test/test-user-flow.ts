const API_URL = "http://localhost:3000";

let accessToken = "";
let refreshTokenCookie = "";
let currentUserId = "";

const logInfo = (msg: string) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`);
const logSuccess = (msg: string) => console.log(`\x1b[32m[SUCCESS] ✔\x1b[0m ${msg}`);
const logError = (msg: string, err?: any) => {
    console.error(`\x1b[31m[ERROR] ✖\x1b[0m ${msg}`);
    if (err) console.error(err);
};

const extractCookie = (response: Response) => {
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
        refreshTokenCookie = setCookieHeader.split(";")[0];
    }
};

async function runTestFlow() {
    console.log("\n🚀 BẮT ĐẦU CHẠY AUTOMATION TEST - USER FLOW 🚀\n");

    try {
        // ==========================================
        // 1. CHECK HEALTH
        // ==========================================
        logInfo("1. Testing [GET /health/status]...");
        let res = await fetch(`${API_URL}/health/status`);
        let json = await res.json();
        
        if (json.statusCode === 200) {
            logSuccess(`Health Check OK (DB: ${json.data.database}, Redis: ${json.data.redis})`);
        } else {
            throw new Error("Health check failed");
        }

        // ==========================================
        // 2. LOGIN
        // ==========================================
        logInfo("\n2. Testing [POST /auth/login]...");
        res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin@system.com", // Dùng admin tự sinh
                password: "Admin@123"
            }),
        });
        json = await res.json();

        if (json.success) {
            accessToken = json.data.accessToken;
            extractCookie(res);
            logSuccess("Login thành công! Đã lấy được Access Token & Refresh Cookie.");
        } else {
            throw new Error(`Login thất bại: ${json.message}`);
        }

        // ==========================================
        // 3. AUTH ME
        // ==========================================
        logInfo("\n3. Testing[GET /user/me]...");
        res = await fetch(`${API_URL}/user/me`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}` 
            },
        });
        json = await res.json();

        if (json.success) {
            currentUserId = json.data.id || json.data._id;
            logSuccess(`Lấy profile thành công! User ID: ${currentUserId}, Role: ${json.data.role}`);
        } else {
            throw new Error(`Auth me thất bại: ${json.message}`);
        }

        // ==========================================
        // 4. REFRESH TOKEN
        // ==========================================
        logInfo("\n4. Testing [POST /auth/refresh-token]...");
        res = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { 
                "Cookie": refreshTokenCookie
            },
        });
        json = await res.json();

        if (json.success) {
            accessToken = json.data.accessToken;
            extractCookie(res);
            logSuccess("Refresh token thành công! Đã lấy được Access Token mới.");
        } else {
            throw new Error(`Refresh token thất bại: ${json.message}`);
        }

        // ==========================================
        // 5. GET ALL USERS
        // ==========================================
        logInfo("\n5. Testing[GET /user?page=1&limit=5]...");
        res = await fetch(`${API_URL}/user?page=1&limit=5`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}` 
            },
        });
        json = await res.json();

        if (json.success) {
            logSuccess(`Lấy danh sách Users thành công! Tổng số: ${json.meta.total}`);
        } else {
            logError(`Không thể lấy danh sách: ${json.message}`);
        }

        // ==========================================
        // 6. EXPORT USERS TO CSV
        // ==========================================
        logInfo("\n6. Testing [GET /user/export]...");
        res = await fetch(`${API_URL}/user/export`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}` 
            },
        });
        const text = await res.text();

        if (res.ok && text.includes("ID") && text.includes("Email")) {
            logSuccess("Xuất file CSV thành công! Dữ liệu CSV trả về đúng định dạng.");
        } else {
            throw new Error(`Export CSV thất bại. HTTP Status: ${res.status}`);
        }

        // ==========================================
        // 7. GET USER BY ID 
        // ==========================================
        logInfo(`\n7. Testing [GET /user/${currentUserId}]...`);
        res = await fetch(`${API_URL}/user/${currentUserId}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}` 
            },
        });
        json = await res.json();

        if (json.success) {
            logSuccess(`Lấy User theo ID thành công! Email: ${json.data.email}`);
        } else {
            logError(`Lấy User theo ID thất bại: ${json.message}`);
        }

        // ==========================================
        // 8. LOGOUT
        // ==========================================
        logInfo("\n8. Testing[POST /auth/logout]...");
        res = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${accessToken}`,
                "Cookie": refreshTokenCookie
            },
        });
        json = await res.json();

        if (json.success) {
            logSuccess("Logout thành công! Session đã bị hủy.");
        } else {
            throw new Error(`Logout thất bại: ${json.message}`);
        }

        console.log("\n🎉 TOÀN BỘ USER FLOW ĐÃ CHẠY THÀNH CÔNG! 🎉\n");

    } catch (error: any) {
        console.log("\n");
        logError("Test Flow bị gián đoạn do lỗi!", error.message);
        console.log("\n");
    }
}

runTestFlow();


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
                email: "test@example.com",
                password: "admin123"
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
                "Cookie": refreshTokenCookie // Gửi cookie lên
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
        // 5. GET ALL USERS (Yêu cầu quyền ADMIN)
        // ==========================================
        logInfo("\n5. Testing [GET /user?page=1&limit=5]...");
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
            logError(`Không thể lấy danh sách (Có thể do không phải ADMIN): ${json.message}`);
        }

        // ==========================================
        // 6. GET USER BY ID (Yêu cầu quyền ADMIN)
        // ==========================================
        logInfo(`\n6. Testing [GET /user/${currentUserId}]...`);
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
        // 7. LOGOUT
        // ==========================================
        logInfo("\n7. Testing[POST /auth/logout]...");
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

// Chạy hàm test
runTestFlow();
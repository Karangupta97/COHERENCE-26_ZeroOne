const http = require("http");
require("dotenv").config();

const PORT = Number(process.env.PORT) || 4000;

function sendJson(res, statusCode, body) {
	res.writeHead(statusCode, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
	// Basic CORS support for frontend testing.
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const baseUrl = `http://${req.headers.host || `localhost:${PORT}`}`;
	const url = new URL(req.url || "/", baseUrl);

	if (req.method === "GET" && url.pathname === "/") {
		sendJson(res, 200, {
			ok: true,
			message: "Test server is running",
		});
		return;
	}

	if (req.method === "GET" && url.pathname === "/health") {
		sendJson(res, 200, {
			ok: true,
			status: "healthy",
			uptime: Number(process.uptime().toFixed(2)),
			timestamp: new Date().toISOString(),
		});
		return;
	}

	sendJson(res, 404, {
		ok: false,
		message: "Route not found",
		path: url.pathname,
	});
});

server.listen(PORT, () => {
	console.log(`Test server running at http://localhost:${PORT}`);
});

function shutdown(signal) {
	console.log(`${signal} received. Closing server...`);
	server.close(() => {
		process.exit(0);
	});
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = server;

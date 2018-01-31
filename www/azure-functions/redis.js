var redis = require("redis");
console.log(`Redis app started.`);
// Add your cache name and access key.
var client = redis.createClient(6380, '<name>.redis.cache.windows.net', { auth_pass: '<key>', tls: { servername: '<name>.redis.cache.windows.net' } });
client.set("key1", "value", function (err, reply) {
    console.log(reply);
});
client.get("key1", function (err, reply) {
    console.log(reply);
});
console.log(`Redis app ended.`);
//# sourceMappingURL=redis.js.map
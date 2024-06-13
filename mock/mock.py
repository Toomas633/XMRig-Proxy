import random
import time
from flask import Flask, jsonify

app = Flask(__name__)


def random_float(start, end):
    return round(random.uniform(start, end), 2)


def generate_random_summary():
    return {
        "id": "".join(random.choices("0123456789abcdef", k=16)),
        "worker_id": "".join(random.choices("0123456789abcdef", k=12)),
        "uptime": random.randint(0, 86400),
        "restricted": random.choice([True, False]),
        "resources": {
            "memory": {
                "free": random.randint(1000000000, 20000000000),
                "total": random.randint(2000000000, 30000000000),
                "resident_set_memory": random.randint(1000000, 20000000)
            },
            "load_average": [random_float(0.0, 1.0), random_float(0.0, 1.0), random_float(0.0, 1.0)],
            "hardware_concurrency": random.randint(1, 32)
        },
        "features": random.sample(["api", "http", "tls", "ssh"], random.randint(1, 4)),
        "version": "6.21.1",
        "kind": random.choice(["proxy", "node"]),
        "algo": random.choice(["cryptonight", "argon2"]),
        "mode": "simple",
        "ua": f"xmrig-proxy/{random.randint(1, 10)}.{random.randint(0, 99)}.{random.randint(0, 99)} (Linux x86_64) libuv/1.48.0 gcc/13.2.0",
        "donate_level": random.randint(0, 5),
        "donated": round(random.uniform(0.0, 100.0), 2),
        "hashrate": {
            "total": [random_float(0.0, 1000.0), random_float(0.0, 1000.0), random_float(0.0, 1000.0),
                      random_float(0.0, 1000.0), random_float(0.0, 1000.0), random_float(0.0, 1000.0)]
        },
        "miners": {
            "now": random.randint(0, 10),
            "max": random.randint(0, 10)
        },
        "workers": random.randint(0, 100),
        "upstreams": {
            "active": random.randint(0, 10),
            "sleep": random.randint(0, 10),
            "error": random.randint(0, 10),
            "total": random.randint(0, 20),
            "ratio": round(random.uniform(0.0, 1.0), 2)
        },
        "results": {
            "accepted": random.randint(0, 10000),
            "rejected": random.randint(0, 1000),
            "invalid": random.randint(0, 100),
            "expired": random.randint(0, 50),
            "avg_time": random_float(0.0, 10.0),
            "latency": random_float(0.0, 100.0),
            "hashes_total": random.randint(0, 1000000),
            "hashes_donate": random.randint(0, 100000),
            "best": [random.randint(0, 1000) for _ in range(10)]
        }
    }


@app.route('/1/summary', methods=['GET'])
def summary():
    summary_data = generate_random_summary()
    return jsonify(summary_data)


def generate_random_ip():
    return ".".join(str(random.randint(0, 255)) for _ in range(4))


def generate_random_time():
    now = int(time.time() * 1000)
    ten_minutes_ago = now - 600000
    return random.randint(ten_minutes_ago, now)


def generate_random_workers():
    num_workers = random.randint(5, 20)
    workers = []
    for _ in range(num_workers):
        worker = [
            "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=8)),
            generate_random_ip(),
            random.randint(0, 1),
            random.randint(0, 100),
            random.randint(0, 100),
            random.randint(0, 100),
            random.randint(0, 10000000),
            generate_random_time(),
            random_float(0.0, 100.0),
            random_float(0.0, 100.0),
            random_float(0.0, 100.0),
            random_float(0.0, 100.0),
            random_float(0.0, 100.0),
        ]
        workers.append(worker)
    return workers


@app.route('/1/workers', methods=['GET'])
def workers():
    workers_data = {
        "hashrate": {
            "total": [random_float(0.0, 1000.0), random_float(0.0, 1000.0),
                      random_float(0.0, 1000.0), random_float(0.0, 1000.0),
                      random_float(0.0, 1000.0), random_float(0.0, 1000.0)]
        },
        "mode": "rig_id",
        "workers": generate_random_workers()
    }
    return jsonify(workers_data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

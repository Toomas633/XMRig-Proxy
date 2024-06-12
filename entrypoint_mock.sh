#!/bin/sh
apache2ctl -D FOREGROUND &

python3 /mock/mock.py &

XMRIG_PROXY_OPTIONS="-o $POOL_URL -u $USER -p $PASS --algo $ALGO --mode simple --http-host 0.0.0.0 --http-port 8081"

/xmrig-proxy/build/xmrig-proxy $XMRIG_PROXY_OPTIONS
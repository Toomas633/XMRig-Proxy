#!/bin/sh
apache2ctl -D FOREGROUND &

XMRIG_PROXY_OPTIONS="-o $POOL_URL -u $USER -p $PASS --algo $ALGO --mode simple --http-host 0.0.0.0 --http-port 8080"

/xmrig-proxy/build/xmrig-proxy $XMRIG_PROXY_OPTIONS
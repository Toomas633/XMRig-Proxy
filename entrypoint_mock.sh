#!/bin/sh
python3 /mock/mock.py &

apache2ctl -D FOREGROUND
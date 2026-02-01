#!/bin/bash
export LD_LIBRARY_PATH=/tmp/libasound-extract/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
exec /home/hisham/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome "$@"

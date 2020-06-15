PID=$(pidof node server.js)
echo killing process with PID=$PID
$(kill $PID)
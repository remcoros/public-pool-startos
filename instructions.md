# Public Pool Instructions

StartOS does not support forwarding non-http ports yet (like the Stratum port). Until this is possible, you can use the following method to open and forward the Stratum port.

Login to StartOS over SSH and switch to the root user:

    sudo -i

Run the following command to switch to the "chrooted" environment, any system changes made now will be persisted across reboots.

    /usr/lib/startos/scripts/chroot-and-upgrade

Install "simpleproxy":

    apt update && apt install simpleproxy -y

Paste the following, this will create a new systemd service responsible for port forwarding 3333 (Stratum):

```
cat > /lib/systemd/system/simpleproxy.stratum.service <<'EOL'
[Unit]
Description=simpleproxy stratum forward
Wants=podman.service
After=podman.service

[Service]
Type=simple
Restart=always
RestartSec=3
ExecStartPre=/bin/bash -c "/bin/systemctl set-environment IP=$(ip route | grep default | awk '{print $9}' | head -1)"
ExecStart=/usr/bin/simpleproxy -L ${IP}:3333 -R public-pool.embassy:3333

[Install]
WantedBy=multi-user.target
EOL
```

Enable the new systemd service:

    systemctl enable simpleproxy.stratum

Now exit the chroot environment. this will reboot StartOS! **Do NOT close the SSH window manually, actually type `exit` and let it reboot.**

    exit

# See https://hub.docker.com/r/clamav/clamav/tags
FROM clamav/clamav:1.4.2

# See https://github.com/Cisco-Talos/clamav-docker/blob/main/clamav/1.2/alpine/scripts/docker-entrypoint-unprivileged.sh
COPY "./docker-entrypoint-unprivileged.sh" "/init"
RUN chmod +x /init

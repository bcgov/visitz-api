# ClamAV

Steps for deploying ClamAV on OpenShift are available in [docs/RELEASES.md](../docs/RELEASES.md)

## Test the image locally

```sh
docker run -it --rm \
    --mount type=bind,source=/path/to/configurations,target=/etc/clamav \
    --env 'CLAMAV_NO_CLAMD=false' \
    --env 'CLAMAV_NO_FRESHCLAMD=false' \
    --env 'CLAMAV_NO_MILTERD=true' \
    --env 'CLAMD_STARTUP_TIMEOUT=1800' \
    --env 'FRESHCLAM_CHECKS=1' \
    -p 3310:3310 \
    ghcr.io/bcgov/clamav-unprivileged:main
```

## Check version (in deployed image)
1. Find running pod in OpenShift
2. Open the terminal
3. Run
	```sh
	clamd --version
	```
	to find the version